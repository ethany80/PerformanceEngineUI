import { createContext, useState } from 'react';


import GridEditor from "./components/GridEditor/GridEditor";
import EditBar from './components/EditBar/EditBar';
import "./App.css";
import { GraphRequest } from './types/BackendInterfaces';
import { Button, Input, Paper, Stack, styled } from '@mui/material';
import { MOCK_BAR_GRAPH_REQUEST, MOCK_PIE_GRAPH_REQUEST } from './types/Constants';

const App: React.FC = () => {
    const [newGraph, setNewGraph] = useState<GraphRequest | undefined>(undefined);
    const [loadData, setLoadData] = useState<boolean>(false);

    const loadBtnClick = (_: any): void => {
        setLoadData(true);
    };

    const addBtnClick = (_: any): void => {
        const rand = Math.floor(Math.random() * 2);
        let newReq: GraphRequest | undefined;
        if (rand == 0) {
            newReq = MOCK_BAR_GRAPH_REQUEST;
        } else if (rand == 1) {
            newReq = MOCK_PIE_GRAPH_REQUEST;
        } else {
            newReq = undefined;
        }

        setNewGraph(newReq);
    };

    return (
        <div className="App">
            <h1>Editor</h1>
            <Stack
                direction={"row"}
                className='hidden-on-print'
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
                spacing={2}
            >
                <Button variant="contained" onClick={addBtnClick}>Add Chart</Button>
                <Button variant='contained' onClick={loadBtnClick}>Load Data</Button>
            </Stack>
            <GridEditor
                new_graph_request={newGraph}
                set_graph_request={setNewGraph}
                loadData={loadData}
                setLoaded={setLoadData} />
        </div>
    );
};

export default App;
