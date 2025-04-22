import { useEffect, useMemo, useState } from 'react';

import "./Landing.css";

import { Button, FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import { Entity, FromAiRequest, FromBlankRequest } from '../types/BackendInterfaces';
import BlankCreation from '../components/Landing/BlankCreation';
import TemplateCreation from '../components/Landing/TemplateCreation';
import { Dayjs } from 'dayjs';
import AiCreation from '../components/Landing/AICreation';
import { ENDPOINT_URL } from '../types/Constants';

const Landing: React.FC = () => {
    const [isBlankStr, setIsBlankStr] = useState<string>("blank");
    const [entitiesList, setEntitiesList] = useState<Record<string, Entity>>({});
    const [templatesList, setTemplatesList] = useState<Record<string, string>[]>([]);

    const navigate = useNavigate();

    const getEntities = () => {
        console.log('starting req');
        const url = new Request(`${ENDPOINT_URL}/all-entities`);
        fetch(url)
        .then((resp) => {
            console.log('got resp', resp)
            if (resp.status == 200) {
                resp.json().then((j) => {
                    // TODO verify this JSON object *actually* matches the interface.
                    // This will simply assume the object is correct.
                    setEntitiesList(j);
                })
            }
        })
    }

    const getTemplates = () => {
        setTemplatesList([
            { "templateId1": "Template Name 1" },
            { "templateId2": "Template Name 2" }
        ]);
    }

    const fromTemplate = (templateId: string, entities: string[], range1: Dayjs, range2: Dayjs) => {
        console.log('Creating:', templateId, 'with', entities, 'and ranges', range1.format('MM/DD/YYYY'), range2.format('MM/DD/YYYY'));
        navigate(`/editor/${templateId}`)
    }

    const fromBlank = (name: string, entities: string[]) => {
        console.log('Creating:', name, 'with', entities);
        // `/api/create`
        // `random-id`

        const req: FromBlankRequest = {
            name: name,
            entities: entities
        }

        const url = new Request(`${ENDPOINT_URL}/from-blank`, {
            method: 'POST',
            body: req.toString()
        });
        fetch(url)
        .then((resp) => {
            if (resp.status == 201) {
                resp.json().then((j) => {
                    // TODO verify this JSON object *actually* matches the interface.
                    // This will simply assume the object is correct.
                    navigate(`/editor/${j.layout}`)
                })
            }
        })
        
    }

    const fromAi = (prompt: string, entities: string[], range1: Dayjs, range2: Dayjs) => {
        console.log('Creating from prompt', prompt, 'with', entities, 'and ranges', range1.format('MM/DD/YYYY'), range2.format('MM/DD/YYYY'));
        const req: FromAiRequest = {
            prompt: prompt,
            entities: entities,
            range1: range1.format("MM/DD/YYYY"),
            range2: range2.format("MM/DD/YYYY")
        }

        const url = new Request(`${ENDPOINT_URL}/from-ai`, {
            method: 'POST',
            body: req.toString()
        });
        fetch(url)
        .then((resp) => {
            if (resp.status == 201) {
                resp.json().then((j) => {
                    // TODO verify this JSON object *actually* matches the interface.
                    // This will simply assume the object is correct.
                    navigate(`/editor/${j.layout}`)
                })
            }
        })
    }

    useMemo(() => {
        getEntities();
    }, [])

    return (
        <div className="Landing">
            <h1>Create a Report</h1>
            <RadioGroup row value={isBlankStr}
                onChange={(e) => {
                    setIsBlankStr(e.target.value)
                    getEntities();
                    getTemplates();
                }} >
                <FormControlLabel value="blank" control={<Radio />} label="Blank" />
                {/* <FormControlLabel value="template" control={<Radio />} label="Template" /> */}
                <FormControlLabel value="ai" control={<Radio />} label="AI" />
            </RadioGroup>
            {isBlankStr == "blank" ?
                <BlankCreation entitiesMap={entitiesList} create={fromBlank} />
                :
                <AiCreation entitiesMap={entitiesList} templates={templatesList} fromAi={fromAi} />
            }
        </div>
    );
};

export default Landing;
