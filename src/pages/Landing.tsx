import { useEffect, useMemo, useState } from 'react';

import "./Landing.css";
import GridEditor from "./components/GridEditor/GridEditor";
import AddDialog from "./components/AddDialog";

import { BAR_CHART, LINE_CHART, MOCK_BAR_GRAPH_REQUEST_RETURN, MOCK_LINE_GRAPH_REQUEST_RETURN, MOCK_PIE_GRAPH_REQUEST_RETURN, MOCK_TITLE, PIE_CHART } from './types/Constants';
import { DocumentInfo, GraphRequest } from './types/BackendInterfaces';
import { VizDataProps } from './types/DisplayInterfaces';

import { Button, FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { Add, Download, Print, Reviews } from '@mui/icons-material';
import { Link, useParams } from 'react-router';
import { Entity } from '../types/BackendInterfaces';
import BlankCreation from '../components/Landing/BlankCreation';
import TemplateCreation from '../components/Landing/TemplateCreation';

const Landing: React.FC = () => {
    const [isBlankStr, setIsBlankStr] = useState<string>("blank");
    const [entitiesList, setEntitiesList] = useState<Record<string, Entity>>({});
    const [templatesList, setTemplatesList] = useState<Record<string, string>[]>([]);

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
            "pos03": { name: "Position 3", types: ["Market Value", "Return"], parent: "acc02"}
        });
    }

    const getTemplates = () => {
        setTemplatesList([
            { "templateId1": "Template Name 1" },
            { "templateId2": "Template Name 2" }
        ]);
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
            { isBlankStr == "blank" ?
                <BlankCreation entitiesMap={entitiesList} />
                :
                <TemplateCreation entitiesMap={entitiesList} templates={templatesList} />
            }
        </div>
    );
};

export default Landing;
