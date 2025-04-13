import { useEffect, useState } from 'react';

import "./App.css";
import GridEditor from "./components/GridEditor/GridEditor";
import AddDialog from "./components/AddDialog";

import { BAR_CHART, LINE_CHART, MOCK_BAR_GRAPH_REQUEST_RETURN, MOCK_LINE_GRAPH_REQUEST_RETURN, MOCK_PIE_GRAPH_REQUEST_RETURN, MOCK_TITLE, PIE_CHART } from './types/Constants';
import { DocumentInfo, GraphRequest } from './types/BackendInterfaces';
import { VizDataProps } from './types/DisplayInterfaces';

import { Button, IconButton, Stack, TextField } from '@mui/material';
import { Add, Download, Print, Reviews } from '@mui/icons-material';
import { Link, useParams } from 'react-router';

const Landing: React.FC = () => {
    const [docId, setDocId] = useState<string>("");

    return (
        <div className="Landing">
            <TextField variant='filled' value={docId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDocId(e.target.value);}} />
            <Link to={"/editor/" + docId}>Start Editor</Link>
        </div>
    );
};

export default Landing;
