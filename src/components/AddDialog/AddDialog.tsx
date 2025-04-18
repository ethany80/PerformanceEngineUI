import { useEffect, useState } from 'react';

import "./AddDialog.css"

import { BAR_CHART, CELL_SIZE, LINE_CHART, PIE_CHART } from '../../types/Constants';
import { DataType, Entity, GraphRequest } from '../../types/BackendInterfaces';
import { VizDataProps } from '../../types/DisplayInterfaces';

import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Stack,
    TextField
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type Props = {
    nextId: number,
    entities: Record<string, Entity>,
    dataTypes: Record<string, DataType>,
    requested_open: boolean | undefined,
    set_requested_open: (newVal: boolean | undefined) => void,
    add_visualization: (newId: string, viz: VizDataProps) => void
}

const AddDialog: React.FC<Props> = (props) => {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [addDialogId, setAddDialogId] = useState<string>("");
    const [idType, setIdType] = useState<string>("ACC");
    const [parentAccounts, setParentAccounts] = useState<string[]>([]);
    const [multiSelectedAccounts, setMultiSelectedAccounts] = useState<Record<string, boolean>>({});
    const [multiSelectedPositions, setMultiSelectedPositions] = useState<Record<string, boolean>>({});
    const [radioSelectedAccount, setRadioSelectedAccount] = useState<string>("");
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [range1, setRange1] = useState<Dayjs|null>(null);
    const [range2, setRange2] = useState<Dayjs|null>(null);
    const [graphType, setGraphType] = useState<string>("");
    const [allowedGraphTypes, setAllowedGraphTypes] = useState<string[]>([]);
    const [graphTypeEnabled, setGraphTypeEnabled] = useState<boolean>(false);

    const [posEntities, setPosEntities] = useState<Record<string, Entity>>({});
    const [accEntities, setAccEntities] = useState<Record<string, Entity>>({});    

    const [prefixedDataTypes, setPrefixedDataTypes] = useState<Record<string,string[]>>({});

    useEffect(() => {
        if (props.requested_open != undefined) {
            setAddDialogOpen(props.requested_open);
            props.set_requested_open(undefined);
        }
    })

    // Initialize available accounts/positions only once
    useEffect(() => {
        let initAcc: Record<string, boolean> = {};
        let parentsInit: Record<string, boolean> = {};
        let initPosE: Record<string, Entity> = {};
        let initAccE: Record<string, Entity> = {};
        let initPrefixes: Record<string, string[]> = {};
        for (const [key, val] of Object.entries(props.entities)) {
            const entityIdent = key.slice(0, 3).toUpperCase();
            if (entityIdent == "ACC") {
                initAccE[key] = val;
                initAcc[key] = false;
            } else if (entityIdent == "POS") {
                initPosE[key] = val;
                if (val.parent) {
                    parentsInit[val.parent] = true;
                }
            }
            
            // Every data type will be the same for each prefix, but 
            // /this assignment is faster than checking each time.
            initPrefixes[entityIdent] = val.types;
        }
    
        setParentAccounts(Object.entries(parentsInit).map(([k]) => ( k )));
        setPrefixedDataTypes(initPrefixes);
        setAvailableTypes(initPrefixes[idType]);
        setMultiSelectedAccounts(initAcc);
        setPosEntities(initPosE);
        setAccEntities(initAccE);
    }, [])

    const resetAddDialog = () => {
        closeAddDialog();
        setIdType("ACC");
        setAddDialogId("");
        setSelectedType("");
        setRange1(null);
        setRange2(null);
        setGraphType("");
        setAllowedGraphTypes([]);
        setGraphTypeEnabled(false);
        setRadioSelectedAccount("");
        let tempMultiSelect: Record<string, boolean> = {};
        Object.keys(multiSelectedAccounts).forEach((key) => {
            tempMultiSelect[key] = false;
        })
        setMultiSelectedAccounts(tempMultiSelect)
        tempMultiSelect = {};
        Object.keys(multiSelectedPositions).forEach((key) => {
            tempMultiSelect[key] = false;
        })
        setMultiSelectedPositions(tempMultiSelect);
    };

    const addBtnSubmit = () => {
        const range1Str = range1 ? range1.toString() : "NULL";
        const range2Str = range2 ? range2.toString() : "NULL";
        const newReq: GraphRequest = {
            id: addDialogId,
            type: selectedType,
            range: [range1Str, range2Str],
            chartType: graphType

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
                <DialogContentText>Entity Level</DialogContentText>
                <RadioGroup row value={idType} onChange={(e) => {
                    setIdType(e.target.value);
                    setAvailableTypes(prefixedDataTypes[e.target.value])
                }} >
                    <FormControlLabel value="ACC" control={<Radio />} label="Account" />
                    <FormControlLabel value="POS" control={<Radio />} label="Position" />
                </RadioGroup>
                <DialogContentText>Select the target account(s)/position(s)</DialogContentText>
                        {(idType == "ACC") ? 
                        <List className='add-selector-list'>
                            <FormGroup>
                            {Object.entries(accEntities).map(([key, entity]) => (
                                <ListItem>
                                    <FormControlLabel value={key} control={<Checkbox checked={multiSelectedAccounts[key]} onChange={(e) => {
                                        setMultiSelectedAccounts({
                                            ...multiSelectedAccounts,
                                            [key]: !multiSelectedAccounts[key]
                                        })
                                    }} />} label={entity.name} />
                                </ListItem>
                            ))}
                            </FormGroup>
                        </List>

                        :

                        <Stack direction={'row'} spacing={0.5}>
                            <List className='add-selector-list'>
                                <RadioGroup value={radioSelectedAccount} onChange={(e) => {
                                    setRadioSelectedAccount(e.target.value);
                                    let newPositions: Record<string, boolean> = {};
                                    Object.entries(posEntities).map(([key,entity]) => {
                                        if (entity.parent == e.target.value) {
                                            newPositions[key] = false;
                                        }
                                    })

                                    setMultiSelectedPositions(newPositions);
                                }}>
                                    {parentAccounts.map((key) => (
                                        <ListItem>
                                            <FormControlLabel value={key} control={<Radio />} label={accEntities[key].name} />
                                        </ListItem>
                                    ))}
                                </RadioGroup>
                            </List>
                            <FormGroup>
                                <List className='add-selector-list'>
                                    {Object.entries(posEntities).flatMap(([key, entity]) => (
                                        entity.parent == radioSelectedAccount &&
                                        <ListItem>
                                            <FormControlLabel value={key} control={<Checkbox checked={multiSelectedPositions[key]} onChange={(e) => {
                                                setMultiSelectedPositions({
                                                    ...multiSelectedPositions,
                                                    [key]: !multiSelectedPositions[key]
                                                })
                                            }}  />} label={entity.name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </FormGroup>
                        </Stack>
                        }
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
                    <Stack direction={'row'} spacing={2}>
                        { /* Data type selection */}
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={selectedType}
                                label="Data Type"
                                onChange={(e: SelectChangeEvent) => {
                                    setSelectedType(e.target.value);
                                    setAllowedGraphTypes(props.dataTypes[e.target.value].types);
                                    setGraphType("");
                                }}>
                                {availableTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        { /* Range selection based on data type */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                            disabled={selectedType == ""} 
                            defaultValue={dayjs("01-05-2023","MM-DD-YYYY")}
                            minDate={dayjs("01-05-2023","MM-DD-YYYY")}
                            maxDate={dayjs("03-22-2025","MM-DD-YYYY")}
                            value={range1} 
                            onChange={((e) => {
                                setRange1(e)

                                if (props.dataTypes[selectedType].range2Enabled && range2) {
                                    setGraphTypeEnabled(true);
                                } else if (!props.dataTypes[selectedType].range2Enabled) {
                                    setGraphTypeEnabled(true);
                                }
                            })} />

                            { selectedType != "" && props.dataTypes[selectedType].range2Enabled &&
                                <DatePicker 
                                defaultValue={dayjs("03-22-2025","MM-DD-YYYY")} 
                                minDate={dayjs("01-05-2023","MM-DD-YYYY")}
                                maxDate={dayjs("03-22-2025","MM-DD-YYYY")}
                                value={range2} 
                                onChange={((e) => {
                                    setRange2(e)

                                    if (range1) {
                                        setGraphTypeEnabled(true);
                                    }
                                })} />
                            }

                        </LocalizationProvider>
                    </Stack>
                    {/* Chart Type */}
                    <FormControl sx={{ paddingTop: "20" }} fullWidth>
                        <InputLabel>Chart Type</InputLabel>
                        <Select
                            value={graphType}
                            label="Chart Type"
                            onChange={(e: SelectChangeEvent) => {
                                setGraphType(e.target.value);
                            }}
                            disabled={!(
                                (selectedType != "" && props.dataTypes[selectedType].range2Enabled && range2 != null && range1 != null) ||
                                (selectedType != "" && !props.dataTypes[selectedType].range2Enabled && range1 != null)
                                )}>
                            {allowedGraphTypes.map((type) => (
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
