import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import "./App.css";
import GridEditor from "./components/GridEditor/GridEditor";
import AddDialog from "./components/AddDialog/AddDialog";

import { BAR_CHART, LINE_CHART, MOCK_BAR_GRAPH_REQUEST_RETURN, MOCK_LINE_GRAPH_REQUEST_RETURN, MOCK_PIE_GRAPH_REQUEST_RETURN, MOCK_TITLE, PIE_CHART } from './types/Constants';
import { DataType, Entity, GraphRequest } from './types/BackendInterfaces';
import { VizDataProps } from './types/DisplayInterfaces';

import { Button, IconButton, Stack } from '@mui/material';
import { Add, Download, Print, Reviews } from '@mui/icons-material';

interface DocumentObject {
    entities: Record<string, Entity>;
    dataTypes: Record<string, DataType>;
    visualizations: Record<string, VizDataProps>;
}

const App: React.FC = () => {
    // State for application and children
    const { documentId } = useParams();
    const [visualizations, setVisualizations] = useState<Record<string, VizDataProps>>({});
    const [nextId, setNextId] = useState<number>(0);
    const [selectedId, setSelectedId] = useState<string|undefined>(undefined);
    const [requestAdd, setRequestAdd] = useState<boolean|undefined>(undefined);
    const [entities, setEntities] = useState<Record<string, Entity>>({
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
    const [dataTypes, setDataTypes] = useState<Record<string, DataType>>({
        "Market Value": { types: ["line", "multi-line", "bar", "table"], range2Enabled: true, canBeMultiple: true },
        "Return": { types: ["line", "multi-line", "bar", "table"], range2Enabled: true, canBeMultiple: true },
        "Allocation": { types: ["pie", "table"], range2Enabled: false, canBeMultiple: false }
    });
    const [title, setTitle] = useState<string>("Blank Report");

    const onLoad = (doc: DocumentObject) => {
        setEntities(doc.entities);
        setDataTypes(doc.dataTypes);
        setVisualizations(doc.visualizations);
    };

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
        } else if (req.chartType == PIE_CHART) {
            return MOCK_PIE_GRAPH_REQUEST_RETURN;
        } else if (req.chartType == LINE_CHART) {
            return MOCK_LINE_GRAPH_REQUEST_RETURN;
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
                entities={entities}
                dataTypes={dataTypes}
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
