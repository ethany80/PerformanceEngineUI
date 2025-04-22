import { useEffect, useMemo, useState } from 'react';

import "./Landing.css";

import { Button, FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import { Entity } from '../types/BackendInterfaces';
import BlankCreation from '../components/Landing/BlankCreation';
import TemplateCreation from '../components/Landing/TemplateCreation';
import { Dayjs } from 'dayjs';

const Landing: React.FC = () => {
    const [isBlankStr, setIsBlankStr] = useState<string>("blank");
    const [entitiesList, setEntitiesList] = useState<Record<string, Entity>>({});
    const [templatesList, setTemplatesList] = useState<Record<string, string>[]>([]);

    const navigate = useNavigate();

    const getEntities = () => {
        setEntitiesList({
            "acc01": { name: "Account 1", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc02": { name: "Account 2", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc04": { name: "Account 4", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc05": { name: "Account 5", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc06": { name: "Account 6", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc07": { name: "Account 7", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc08": { name: "Account 8", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "acc09": { name: "Account 9", types: ["Return", "Market Value", "Allocation"], parent: undefined },
            "pos01": { name: "Position 1", types: ["Market Value", "Return"], parent: "acc01" },
            "pos02": { name: "Position 2", types: ["Market Value", "Return"], parent: "acc01" },
            "pos03": { name: "Position 3", types: ["Market Value", "Return"], parent: "acc02" }
        });
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
        navigate(`/editor/${name}`)
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
                <FormControlLabel value="template" control={<Radio />} label="Template" />
            </RadioGroup>
            {isBlankStr == "blank" ?
                <BlankCreation entitiesMap={entitiesList} create={fromBlank} />
                :
                <TemplateCreation entitiesMap={entitiesList} templates={templatesList} fromTemplate={fromTemplate} />
            }
        </div>
    );
};

export default Landing;
