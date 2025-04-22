import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import "./App.css";
import GridEditor from "../components/GridEditor/GridEditor";
import AddDialog from "../components/AddDialog/AddDialog";

import { BAR_CHART, ENDPOINT_URL, LINE_CHART, MOCK_BAR_GRAPH_REQUEST_RETURN, MOCK_LINE_GRAPH_REQUEST_RETURN, MOCK_MULTI_BAR_GRAPH_REQUEST_RETURN, MOCK_MULTI_LINE_GRAPH_REQUEST_RETURN, MOCK_PIE_GRAPH_REQUEST_RETURN, MOCK_TABLE_REQUEST_RETURN, MOCK_TITLE, MULTI_BAR_CHART, MULTI_LINE_CHART, PIE_CHART, TABLE_CHART } from '../types/Constants';
import { DataType, DocRequest, Entity, GraphRequest } from '../types/BackendInterfaces';
import { VizDataProps } from '../types/DisplayInterfaces';

import { Button, CircularProgress, IconButton, Stack } from '@mui/material';
import { Add, Download, Print, Reviews } from '@mui/icons-material';

interface DocumentObject {
    name: string;
    entities: Record<string, Entity>;
    dataTypes: Record<string, DataType>;
    visualizations: Record<string, VizDataProps>;
}

const App: React.FC = () => {
    // State for application and children
    const { documentId } = useParams();
    const [visualizations, setVisualizations] = useState<Record<string, VizDataProps>>({});
    const [nextId, setNextId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedId, setSelectedId] = useState<string|undefined>(undefined);
    const [requestAdd, setRequestAdd] = useState<boolean|undefined>(undefined);
    const [entities, setEntities] = useState<Record<string, Entity>>({});
    const [dataTypes, setDataTypes] = useState<Record<string, DataType>>({});
    const [title, setTitle] = useState<string>("Blank Report");

    const getDocument = (documentId: string, callback: (obj: DocumentObject) => void) => {
        // api/doc
        const headers = new Headers();
        headers.append("Content-Type", "application/json")

        const url = new Request(`${ENDPOINT_URL}/doc?layout=${documentId}`, {
            method: 'GET',
            headers: headers
        });
        
        fetch(url)
        .then((resp) => {
            console.log('got resp', resp)
            if (resp.status == 200) {
                resp.json().then((j) => {
                    // TODO verify this JSON object *actually* matches the interface.
                    // This will simply assume the object is correct.
                    console.log(j);
                    callback(j as DocumentObject);
                })
            }
        })
    }

    const onLoad = (doc: DocumentObject) => {
        console.log("Setting stuff to doc:", doc);
        setTitle(doc.name);
        console.log("Name:", doc.name);
        setEntities(doc.entities);
        console.log("Ent:", doc.entities);
        setDataTypes(doc.dataTypes);
        console.log("Types:", doc.dataTypes);
        setVisualizations(doc.visualizations);
        console.log("Viz:", doc.visualizations);
        setLoading(false);
    };

    // Init app state from request before render.
    useEffect(() => {
        // Initialize documents
        if (documentId) {
            setTitle(documentId);
            getDocument(documentId, (obj) => {
                onLoad(obj);
            });
        }
    }, [])

    const loadBtnClick = (): void => {
        const updatedVisualizations = {...visualizations};
        for (const [, viz] of Object.entries(updatedVisualizations)) {
            viz.ret = requestData(viz.req);
        }
        setVisualizations(updatedVisualizations);
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
        <span>
        <CircularProgress id='app-loading' sx={{visibility: loading ? 'visible' : 'hidden'}} />
        <div className={"App " + (loading ? " loading-fade" : "")} >
            <AddDialog 
                nextId={nextId}
                entities={entities}
                dataTypes={dataTypes}
                requested_open={requestAdd}
                set_requested_open={setRequestAdd}
                add_visualization={addVisualization}/>
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
        </span>
    );
};

export default App;
