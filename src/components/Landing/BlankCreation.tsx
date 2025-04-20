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
    entitiesMap: Record<string, Entity>
}

const BlankCreation: React.FC<Props> = (props) => {
    const [checked, setChecked] = useState<boolean[]>([]);
    const [entitiesList, setEntitiesList] = useState<Entity[]>([]);
        
    useEffect(() => {        
        let tempList: Entity[] = [];
        let childrenMap: Record<string, string[]> = {};

        for (const [key, entity] of Object.entries(props.entitiesMap)) {
            if (entity.parent && childrenMap[entity.parent]) {
                childrenMap[entity.parent].push(key);
            } else if (entity.parent) {
                childrenMap[entity.parent] = [key];
            }
        }

        for (const [key, entity] of Object.entries(props.entitiesMap)) {
            if (key.slice(0, 3).toUpperCase() == "ACC") {
                tempList.push(entity);
                
                if (childrenMap[key]) {
                    for (const entry of childrenMap[key]) {
                        tempList.push(props.entitiesMap[entry]);
                    }
                }
            }
        }

        setChecked(Array(tempList.length).fill(false));
        setEntitiesList(tempList);
    }, [props.entitiesMap])

    return (
        <div id='blank-creation'>
            <p>Select the entities to use in your report.</p>
            {entitiesList.map((val) => (
                <p>{val.name}</p>
            ))}
        </div>
    );
};

export default BlankCreation;
