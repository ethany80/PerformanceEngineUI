import Draggable from "react-draggable";

import Visualization from "../Visualization/Visualization";

import "./GridEditor.css";

import { GRID_HEIGHT, GRID_WIDTH, CELL_SIZE } from "../../types/Constants";
import { VizDataProps } from "../../types/DisplayInterfaces";
import { createRef, useEffect, useRef } from "react";

type Props = {
    update_coords: (id: string, x: number, y: number) => void;
    set_selected: (id: string | undefined) => void;
    remove_chart: (id: string) => void;
    charts: Record<string, VizDataProps>;
    selected: string|undefined;
}

const GridEditor: React.FC<Props> = (props) => {
    const nodeRefMap = useRef(new Map());
    const getNodeRef = (id: string) => {
        if (!nodeRefMap.current.has(id)) {
          nodeRefMap.current.set(id, createRef());
        }
        return nodeRefMap.current.get(id);
      };

    useEffect(() => {
        return () => {
          nodeRefMap.current.clear();
        };
      }, []);

    // Handle dragging and snapping to the grid
    const handleDrag = (data: any, id: string) => {
        props.update_coords(id, data.x, data.y);
    };

    const removeChart = (id: string) => {
        if (nodeRefMap.current.has(id)) {
            nodeRefMap.current.delete(id);
        }
        props.remove_chart(id);
    }

    return (
        <div id="grid"
            style={{
                width: GRID_WIDTH,
                height: GRID_HEIGHT,
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            }}
            onClickCapture={() => { props.set_selected(undefined); }}
            >
                <div style={{position: "relative", left: "1px", top: "1px", width: GRID_WIDTH - 1, height: GRID_HEIGHT - 1}}>
            {/* Draggable Charts */}
            {Object.entries(props.charts).map(([id, chart]) => (
                <Draggable
                    key={id}
                    nodeRef={getNodeRef(id)}
                    position={{ x: chart.x, y: chart.y }} // Set the position based on chart state
                    grid={[CELL_SIZE, CELL_SIZE]}
                    bounds={"parent"}
                    onDrag={(_e, data) => handleDrag(data, id)} // Handle the drag
                >
                    <div
                        key={id + "_div"}
                        className={((props.selected && props.selected == id) ? "selected-viz" : "unselected-viz") + " viz"}
                        ref={getNodeRef(id)}
                        style={{
                            width: chart.width,
                            height: chart.height
                        }}
                        onDoubleClickCapture={(target) => {target.stopPropagation(); removeChart(id);}}
                        onClickCapture={() => { props.set_selected(id) }}>
                        <Visualization graph_type={chart.req.chartType} returned_data={chart.ret} />
                    </div>
                </Draggable>
            ))}
            </div>
        </div>
    );
};

export default GridEditor;
