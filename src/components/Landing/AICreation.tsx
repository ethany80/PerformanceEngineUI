import { useEffect, useMemo, useState } from 'react';

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
    entitiesMap: Record<string, Entity>,
    templates: Record<string, string>[],
    fromAi: (prompt: string, entities: string[], range1: Dayjs, range2: Dayjs) => void;
}

const AiCreation: React.FC<Props> = (props) => {
    const [idType, setIdType] = useState<string>("ACC");
    const [aiPrompt, setAiPrompt] = useState<string>("");
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [parentAccounts, setParentAccounts] = useState<string[]>([]);
    const [multiSelectedAccounts, setMultiSelectedAccounts] = useState<Record<string, boolean>>({});
    const [multiSelectedPositions, setMultiSelectedPositions] = useState<Record<string, boolean>>({});
    const [radioSelectedAccount, setRadioSelectedAccount] = useState<string>("");
    const [posEntities, setPosEntities] = useState<Record<string, Entity>>({});
    const [accEntities, setAccEntities] = useState<Record<string, Entity>>({});
    const [range1, setRange1] = useState<Dayjs | null>(null);
    const [range2, setRange2] = useState<Dayjs | null>(null);
    // Initialize available accounts/positions only once.
    useMemo(() => {
        let initAcc: Record<string, boolean> = {};
        let parentsInit: Record<string, boolean> = {};
        let initPosE: Record<string, Entity> = {};
        let initAccE: Record<string, Entity> = {};
        let initPrefixes: Record<string, string[]> = {};
        for (const [key, val] of Object.entries(props.entitiesMap)) {
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

        setParentAccounts(Object.entries(parentsInit).map(([k]) => (k)));
        setMultiSelectedAccounts(initAcc);
        setPosEntities(initPosE);
        setAccEntities(initAccE);
    }, [])

    const isTrueInRecord = (rec: [string, boolean][]): boolean => {
        for (const [, val] of rec) {
            if (val) {
                return true;
            }
        }

        return false;
    }

    const validateFields = (): boolean => {
        return (
            ((idType == "ACC" && isTrueInRecord(Object.entries(multiSelectedAccounts))) ||
                (idType == "POS" && isTrueInRecord(Object.entries(multiSelectedPositions)))) &&
            aiPrompt != "" &&
            range1 != null &&
            range2 != null
        );
    }

    return (
        <div id='template-creation'>
            <p>Enter a prompt for the AI to generate a report:</p>
            <FormControl fullWidth>
                <TextField
                    variant='outlined'
                    value={aiPrompt}
                    label={"AI Prompt"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAiPrompt(e.target.value);
                    }} />
            </FormControl>
            <p>Entity level to use with this template:</p>
            <RadioGroup row value={idType} onChange={(e) => {
                setIdType(e.target.value);
            }} >
                <FormControlLabel value="ACC" control={<Radio />} label="Account" />
                <FormControlLabel value="POS" control={<Radio />} label="Position" />
            </RadioGroup>
            <p>Select the target account(s)/position(s) to use with this template.</p>
            {(idType == "ACC") ?
                <List className='add-selector-list'>
                    <FormGroup>
                        {Object.entries(accEntities).map(([key, entity]) => (
                            <ListItem key={key}>
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
                            Object.entries(posEntities).map(([key, entity]) => {
                                if (entity.parent == e.target.value) {
                                    newPositions[key] = false;
                                }
                            })

                            setMultiSelectedPositions(newPositions);
                        }}>
                            {parentAccounts.map((key) => (
                                <ListItem key={key}>
                                    <FormControlLabel value={key} control={<Radio />} label={accEntities[key].name} />
                                </ListItem>
                            ))}
                        </RadioGroup>
                    </List>
                    <FormGroup>
                        <List className='add-selector-list'>
                            {Object.entries(posEntities).flatMap(([key, entity]) => (
                                entity.parent == radioSelectedAccount &&
                                <ListItem key={key}>
                                    <FormControlLabel value={key} control={<Checkbox checked={multiSelectedPositions[key]} onChange={(e) => {
                                        setMultiSelectedPositions({
                                            ...multiSelectedPositions,
                                            [key]: !multiSelectedPositions[key]
                                        })
                                    }} />} label={entity.name} />
                                </ListItem>
                            ))}
                        </List>
                    </FormGroup>
                </Stack>
            }

            <p>Select the date range to use with this template:</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction='row'>
                    <DatePicker className='template-creation-date-picker'
                        defaultValue={dayjs("01-05-2023", "MM-DD-YYYY")}
                        minDate={dayjs("01-05-2023", "MM-DD-YYYY")}
                        maxDate={dayjs("03-22-2025", "MM-DD-YYYY")}
                        value={range1}
                        onChange={((e) => {
                            setRange1(e)
                        })} />

                    <DatePicker className='template-creation-date-picker'
                        defaultValue={dayjs("03-22-2025", "MM-DD-YYYY")}
                        minDate={dayjs("01-05-2023", "MM-DD-YYYY")}
                        maxDate={dayjs("03-22-2025", "MM-DD-YYYY")}
                        value={range2}
                        onChange={((e) => {
                            setRange2(e)
                        })} />
                </Stack>

            </LocalizationProvider>

            <br />

            <Button variant='contained' disabled={!validateFields()} onClick={() => {
                let entities: string[] = [];

                Object.entries(multiSelectedAccounts).map(([id, val]) => {
                    if (val === true) {
                        entities.push(id);
                    }
                });

                Object.entries(multiSelectedPositions).map(([id, val]) => {
                    if (val === true) {
                        entities.push(id);
                    }
                });

                props.fromAi(aiPrompt, entities, range1 as Dayjs, range2 as Dayjs);
            }}>Create</Button>
        </div>
    );
};

export default AiCreation;
