import { useState } from 'react';


import GridEditor from "./components/GridEditor/GridEditor";
import "./App.css";
import { DocumentInfo, GraphRequest } from './types/BackendInterfaces';
import { Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    FormControl, 
    IconButton, 
    InputLabel, 
    MenuItem, 
    Select, 
    SelectChangeEvent, 
    Stack,
    TextField } from '@mui/material';
import { BAR_CHART, LINE_CHART, MOCK_TITLE, PIE_CHART } from './types/Constants';
import { Add, Close, Download, Print, Reviews } from '@mui/icons-material';

const App: React.FC = () => {
    // State for application and children
    const [newGraph, setNewGraph] = useState<GraphRequest | undefined>(undefined);
    const [loadData, setLoadData] = useState<boolean>(false);
    const [ids, setIds] = useState<Map<string, DocumentInfo>>((): Map<string, DocumentInfo> => {
        const newMap = new Map<string, DocumentInfo>();
        newMap.set("ID1", { id: "ID1", availableTypes: ["Market Value", "Return"] });
        newMap.set("ID2", { id: "ID2", availableTypes: ["Market Value", "Return"] });
        newMap.set("ID3", { id: "ID3", availableTypes: ["Market Value", "Return"] });
        newMap.set("ID4", { id: "ID4", availableTypes: ["Asset Allocation"] });
        return newMap;
    });
    const [title, setTitle] = useState<string>("Blank Report");

    // State for new chart dialog
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [addDialogId, setAddDialogId] = useState<string>("");
    const [addDialogType, setAddDialogType] = useState<string>("");
    const [addDialogRange1, setAddDialogRange1] = useState<string>("");
    const [addDialogRange2, setAddDialogRange2] = useState<string>("");
    const [addDialogGraphType, setAddDialogGraphType] = useState<string>("");
    const [addDialogAllowedGraphTypes, setAddDialogAllowedGraphTypes] = useState<string[]>([]);
    const [addDialogGraphTypeEnabled, setAddDialogGraphTypeEnabled] = useState<boolean>(false);

    const loadBtnClick = (_: any): void => {
        setLoadData(true);
        setTitle(MOCK_TITLE);
    };

    const addBtnClick = (_: any): void => {
        setAddDialogOpen(true);
    };

    const resetAddDialog = () => {
        closeAddDialog();
        setAddDialogId("");
        setAddDialogType("");
        setAddDialogRange1("");
        setAddDialogRange2("");
        setAddDialogGraphType("");
        setAddDialogAllowedGraphTypes([]);
        setAddDialogGraphTypeEnabled(false);
    };

    const enableGraphType = () => {
        // Get allowed graph types given input
        setAddDialogGraphTypeEnabled(true);
        if (addDialogId === "ID4") {
            setAddDialogAllowedGraphTypes([PIE_CHART]);
        } else {
            setAddDialogAllowedGraphTypes([BAR_CHART, LINE_CHART]);
        }
    };

    const addBtnSubmit = () => {
        let newReq: GraphRequest = {
            id: addDialogId,
            type: addDialogType,
            range: [addDialogRange1, addDialogRange2],
            chartType: addDialogGraphType

        }
        setNewGraph(newReq);

        resetAddDialog();
    };

    const closeAddDialog = () => {
        setAddDialogOpen(false);
    };

    return (
        <div className="App">
            <Dialog
                open={addDialogOpen}
                onClose={closeAddDialog}
                fullWidth
                maxWidth={'md'}>
                <DialogTitle>Add Chart</DialogTitle>
                <IconButton aria-label='close' onClick={closeAddDialog} sx={(_) => ({ position: 'absolute', right: 8, top: 8 })}>
                    <Close />
                </IconButton>
                <DialogContent>
                    <DialogContentText>Enter the required information and select chart type.</DialogContentText>
                    <Stack
                        direction={'column'}
                        spacing={2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            paddingTop: '10px'
                        }}>
                        <Stack
                            direction={'row'}
                            spacing={2}
                            paddingLeft={'20px'}
                            paddingRight={'20px'}>
                            {/* ID */}
                            <FormControl fullWidth>
                                <InputLabel>ID</InputLabel>
                                <Select
                                    value={addDialogId}
                                    labelId='simple-select-id'
                                    label="ID"
                                    onChange={(e: SelectChangeEvent) => {
                                        setAddDialogId(e.target.value);

                                        if (e.target.value && addDialogType && addDialogRange1 && addDialogRange2) {
                                            enableGraphType();
                                        } else if (addDialogGraphTypeEnabled) {
                                            setAddDialogGraphTypeEnabled(false);
                                        }
                                    }}>
                                    {Array.from(ids.entries()).map((id) => (
                                        <MenuItem value={id[1].id}>{id[1].id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* Type */}
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={addDialogType}
                                    label="Data Type"
                                    onChange={(e: SelectChangeEvent) => {
                                        setAddDialogType(e.target.value);

                                        if (addDialogId && e.target.value && addDialogRange1 && addDialogRange2) {
                                            enableGraphType();
                                        } else if (addDialogGraphTypeEnabled) {
                                            setAddDialogGraphTypeEnabled(false);
                                        }
                                    }}>
                                    {ids.get(addDialogId)?.availableTypes.map((type) => (
                                        <MenuItem value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* Range 1 */}
                            <FormControl fullWidth>
                                <TextField
                                    variant='filled'
                                    value={addDialogRange1}
                                    label={"Range 1"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setAddDialogRange1(e.target.value);

                                        if (addDialogId && addDialogType && e.target.value && addDialogRange2) {
                                            enableGraphType();
                                        } else if (addDialogGraphTypeEnabled) {
                                            setAddDialogGraphTypeEnabled(false);
                                        }
                                    }} />
                            </FormControl>
                            {/* Range 2 */}
                            <FormControl fullWidth>
                                <TextField
                                    variant='filled'
                                    value={addDialogRange2}
                                    label={"Range 2"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setAddDialogRange2(e.target.value);

                                        if (addDialogId && addDialogType && addDialogRange1 && e.target.value) {
                                            enableGraphType();
                                        } else if (addDialogGraphTypeEnabled) {
                                            setAddDialogGraphTypeEnabled(false);
                                        }
                                    }} />
                            </FormControl>
                        </Stack>
                        {/* Chart Type */}
                        <FormControl sx={{ paddingTop: "20" }} fullWidth>
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                value={addDialogGraphType}
                                label="Chart Type"
                                onChange={(e: SelectChangeEvent) => {
                                    setAddDialogGraphType(e.target.value);
                                }}
                                disabled={!addDialogGraphTypeEnabled}>
                                {addDialogAllowedGraphTypes.map((type) => (
                                    <MenuItem value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={closeAddDialog}>Close</Button>
                    <Button variant='contained' onClick={addBtnSubmit}>Add</Button>
                </DialogActions>
            </Dialog>

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
                <Button variant='contained' onClick={window.print} endIcon={<Print />}>Print</Button>
                <IconButton aria-label="delete" size="large">
                    <Reviews fontSize="inherit" />
                </IconButton>
            </Stack>
            <div id='grid-editor'>
                <GridEditor
                    new_graph_request={newGraph}
                    set_graph_request={setNewGraph}
                    loadData={loadData}
                    setLoaded={setLoadData} />
            </div>
        </div>
    );
};

export default App;
