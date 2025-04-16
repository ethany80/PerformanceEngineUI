import { useState } from 'react';

import "./App.css";
import GridEditor from "./components/GridEditor/GridEditor";
import AddDialog from "./components/AddDialog";

import { BAR_CHART, LINE_CHART, MOCK_BAR_GRAPH_REQUEST_RETURN, MOCK_LINE_GRAPH_REQUEST_RETURN, MOCK_MULTI_BAR_GRAPH_REQUEST_RETURN, MOCK_MULTI_LINE_GRAPH_REQUEST_RETURN, MOCK_PIE_GRAPH_REQUEST_RETURN, MOCK_TABLE_REQUEST_RETURN, MOCK_TITLE, MULTI_BAR_CHART, MULTI_LINE_CHART, PIE_CHART, TABLE_CHART } from './types/Constants';
import { DocumentInfo, GraphRequest } from './types/BackendInterfaces';
import { VizDataProps } from './types/DisplayInterfaces';

import { Button, IconButton, Stack } from '@mui/material';
import { Add, Download, Print, Reviews } from '@mui/icons-material';

const App: React.FC = () => {
    // State for application and children
    const [visualizations, setVisualizations] = useState<Record<string, VizDataProps>>({});
    const [nextId, setNextId] = useState<number>(0);
    const [selectedId, setSelectedId] = useState<string|undefined>(undefined);
    const [requestAdd, setRequestAdd] = useState<boolean|undefined>(undefined);
    const [ids, setIds] = useState<Record<string, DocumentInfo>>({
        "ID1": { id: "ID1", availableTypes: ["Market Value", "Return"] },
        "ID2": { id: "ID2", availableTypes: ["Market Value", "Return"] },
        "ID3": { id: "ID3", availableTypes: ["Market Value", "Return"] },
        "ID4": { id: "ID4", availableTypes: ["Asset Allocation"] }
    });
    const [title, setTitle] = useState<string>("Blank Report");

    const loadBtnClick = (): void => {
        const updatedVisualizations = {...visualizations};
        for (const [, viz] of Object.entries(updatedVisualizations)) {
            viz.ret = requestData(viz.req);
        }
        setVisualizations(updatedVisualizations);        
        setTitle(MOCK_TITLE);
    };

    const addBtnClick = (): void => {
        setRequestAdd(true);
    };

    const addVisualization = (newId: string, viz: VizDataProps) => {
        setVisualizations(prev => {
            return {...prev, 
                [newId]: viz
            }
        });
        setNextId(nextId + 1);
    };

    const requestData = (req: GraphRequest) => {
        if (req.chartType == BAR_CHART) {
            return MOCK_BAR_GRAPH_REQUEST_RETURN;
        } else if (req.chartType == MULTI_BAR_CHART) {
            return MOCK_MULTI_BAR_GRAPH_REQUEST_RETURN;
        } else if (req.chartType == PIE_CHART) {
            return MOCK_PIE_GRAPH_REQUEST_RETURN;
        } else if (req.chartType == LINE_CHART) {
            return MOCK_LINE_GRAPH_REQUEST_RETURN;
        } else if  (req.chartType == MULTI_LINE_CHART) {
            return MOCK_MULTI_LINE_GRAPH_REQUEST_RETURN;
        } else if (req.chartType == TABLE_CHART) {
            return MOCK_TABLE_REQUEST_RETURN;
        }

        return undefined;
    };

    const updateCoords = (id: string, x: number, y: number) => {
        setSelectedId(id);
        setVisualizations(prev => {
            return {
                ...prev,
                [id]: { ...prev[id], x: x, y: y }
            };
        });
    };

    const removeChart = (id: string) => {
        // Perform destructuring wizardry I didn't realize existed until now.
        setVisualizations(prev => {
            const { [id]: _, ...others } = prev;
            return others;
        })
    };

    const deleteBtn = () => {
        if (selectedId) {
            removeChart(selectedId);
        }
    };

    return (
        <div className="App">
            <AddDialog 
                nextId={nextId}
                ids={ids}
                requested_open={requestAdd}
                set_requested_open={setRequestAdd}
                add_visualization={addVisualization} />
            <h1 className='hidden-on-print'>{title}</h1>
            <Stack
                direction={"row"}
                className='hidden-on-print'
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
                spacing={2} >
                <Button variant="contained" onClick={addBtnClick} endIcon={<Add />}>Add Chart</Button>
                <Button variant='contained' onClick={loadBtnClick} endIcon={<Download />}>Load Data</Button>
                <Button variant='contained' onClick={deleteBtn}>Delete</Button>
                <Button variant='contained' onClick={window.print} endIcon={<Print />}>Print</Button>
                <IconButton aria-label="delete" size="large">
                    <Reviews fontSize="inherit" />
                </IconButton>
            </Stack>
            <div id='grid-editor'>
                <GridEditor
                    update_coords={updateCoords}
                    set_selected={setSelectedId}
                    remove_chart={removeChart}
                    charts={visualizations}
                    selected={selectedId}
                    />
            </div>
        </div>
    );
};

export default App;
