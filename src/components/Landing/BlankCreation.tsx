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
    create: (name: string, entities: string[]) => void
};

type EntityEntry = {
    checked: boolean,
    test: string
};

const BlankCreation: React.FC<Props> = (props) => {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [childrenMap, setChildrenMap] = useState<Record<string, string[]>>({});
    const [accountsList, setAccountsList] = useState<string[]>([]);
    const [docName, setDocName] = useState<string>("");

    useEffect(() => {        
        let tempList: string[] = [];
        let tempChecked: Record<string, boolean> = {};
        let tempChildrenMap: Record<string, string[]> = {};

        for (const [key, entity] of Object.entries(props.entitiesMap)) {
            if (entity.parent && tempChildrenMap[entity.parent]) {
                tempChildrenMap[entity.parent].push(key);
            } else if (entity.parent) {
                tempChildrenMap[entity.parent] = [key];
            }
        }


        for (const [key,] of Object.entries(props.entitiesMap)) {
            if (key.slice(0, 3).toUpperCase() == "ACC") {
                tempList.push(key);
                tempChecked[key] = false;
                
                if (tempChildrenMap[key]) {
                    for (const entry of tempChildrenMap[key]) {
                        tempChecked[entry] = false;
                    }
                }
            }
        }

        setChildrenMap(tempChildrenMap);
        setChecked(tempChecked);
        setAccountsList(tempList);
    }, [props.entitiesMap])

    const validateFields = (): boolean => {
        if (docName == "") {
            return false;
        }

        for (const [, val] of Object.entries(checked)) {
            if (val === true) {
                return true;
            }
        }

        return false;
    }

    return (
        <div id='blank-creation'>
            <p>Select the entities to use in your report.</p>
            <div id='create-list'>
                {accountsList.map((accKey) => (
                    <div className='account-list'>
                            <FormControlLabel 
                                className='blank-account-listitem' 
                                control={<Checkbox checked={checked[accKey]} 
                                onChange={() => {
                                    if (childrenMap[accKey] != undefined && checked[accKey]) {
                                        let newChecked = {...checked,
                                            [accKey]: false
                                        };
                                        for (const key of childrenMap[accKey]) {
                                            newChecked[key] = false;
                                        }

                                        setChecked(newChecked);
                                    } else {
                                        setChecked({
                                            ...checked,
                                            [accKey]: !checked[accKey]
                                        })
                                    }
                                }} />} 
                                label={props.entitiesMap[accKey].name} />

                        {(childrenMap[accKey] != undefined) &&
                        childrenMap[accKey].map((childPos) => (
                            <span>
                                <br />
                                <Checkbox checked={checked[childPos]} 
                                    onChange={() => {
                                        setChecked({
                                            ...checked,
                                            [childPos]: !checked[childPos],
                                            [accKey]: true
                                        })
                                    }} />
                                {props.entitiesMap[childPos].name}
                            </span>
                        ))
                        }

                    </div>
                
                ))}
            </div>
            
            <br/>

            <FormControl>
                <TextField
                    variant='outlined'
                    value={docName}
                    label={"New Report Name"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setDocName(e.target.value);
                    }} />
            </FormControl>

            <br /><br />
            <Button variant='contained' disabled={!validateFields()} onClick={() => {
                    let entities: string[] = [];
                    
                    Object.entries(checked).map(([id, val]) => {
                        if (val === true) {
                            entities.push(id);
                        }
                    });

                    props.create(docName, entities);
                }}>Create</Button>

        </div>
    );
};

export default BlankCreation;
