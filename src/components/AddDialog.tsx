import { useEffect, useState } from 'react';

import { BAR_CHART, CELL_SIZE, LINE_CHART, MULTI_BAR_CHART, MULTI_LINE_CHART, PIE_CHART, TABLE_CHART } from '../types/Constants';
import { DocumentInfo, GraphRequest } from '../types/BackendInterfaces';
import { VizDataProps } from '../types/DisplayInterfaces';

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
import { Close } from '@mui/icons-material';

type Props = {
    nextId: number,
    ids: Record<string, DocumentInfo>,
    requested_open: boolean|undefined,
    set_requested_open: (newVal: boolean|undefined) => void,
    add_visualization: (newId: string, viz: VizDataProps) => void
}

const AddDialog: React.FC<Props> = (props) => {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [addDialogId, setAddDialogId] = useState<string>("");
    const [addDialogType, setAddDialogType] = useState<string>("");
    const [addDialogRange1, setAddDialogRange1] = useState<string>("");
    const [addDialogRange2, setAddDialogRange2] = useState<string>("");
    const [addDialogGraphType, setAddDialogGraphType] = useState<string>("");
    const [addDialogAllowedGraphTypes, setAddDialogAllowedGraphTypes] = useState<string[]>([]);
    const [addDialogGraphTypeEnabled, setAddDialogGraphTypeEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (props.requested_open != undefined) {
            setAddDialogOpen(props.requested_open);
            props.set_requested_open(undefined);
        }
    })

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
            setAddDialogAllowedGraphTypes([PIE_CHART, TABLE_CHART]);
        } else {
            setAddDialogAllowedGraphTypes([BAR_CHART, LINE_CHART, MULTI_LINE_CHART, MULTI_BAR_CHART]);
        }
    };

    const addBtnSubmit = () => {
        const newReq: GraphRequest = {
            id: addDialogId,
            type: addDialogType,
            range: [addDialogRange1, addDialogRange2],
            chartType: addDialogGraphType

        }

        const newId = newReq.id + props.nextId.toString();
        const newViz: VizDataProps = {
            req: newReq,
            ret: undefined,
            // To completely fit in the grid, width/height needs to be size minus 1.
            x: 0,
            y: 0,
            width: CELL_SIZE * 10 - 1,
            height: CELL_SIZE * 10 - 1,
        }
        props.add_visualization(newId, newViz)

        resetAddDialog();
    };

    const closeAddDialog = () => {
        setAddDialogOpen(false);
    };

    return (
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
                                {Object.entries(props.ids).map((id) => (
                                    <MenuItem key={id[1].id} value={id[1].id}>{id[1].id}</MenuItem>
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
                                {props.ids[addDialogId]?.availableTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
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
                                <MenuItem key={type} value={type}>{type}</MenuItem>
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
    );
};

export default AddDialog;
