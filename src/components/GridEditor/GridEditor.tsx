import React, { RefObject, useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

import Visualization from "../Visualization/Visualization";

import { GRID_HEIGHT, GRID_WIDTH, CELL_SIZE, MOCK_BAR_GRAPH_REQUEST_RETURN, BAR_CHART, PIE_CHART, MOCK_PIE_GRAPH_REQUEST_RETURN, LINE_CHART, MOCK_LINE_GRAPH_REQUEST_RETURN } from "../../types/Constants";
import { GraphRequest, GraphRequestReturn } from "../../types/BackendInterfaces";
import { ChartDataPropContext, ChartDataProps } from "../../types/DisplayInterfaces";

type Props = {
    new_graph_request?: GraphRequest,
    set_graph_request: (req: GraphRequest | undefined) => void,
    loadData: boolean, setLoaded: (val: boolean) => void
}

const GridEditor: React.FC<Props> = (props) => {
    const [nextId, setNextId] = useState<number>(0);
    const charts = useContext(ChartDataPropContext);

    let refs: Map<string, React.RefObject<HTMLDivElement>|undefined> = new Map();

    // When parent updates props
    useEffect(() => {
        if (props.loadData) {
            for (const chart of charts) {
                if (chart.req.chartType == BAR_CHART) {
                    chart.ret = MOCK_BAR_GRAPH_REQUEST_RETURN;
                } else if (chart.req.chartType == PIE_CHART) {
                    chart.ret = MOCK_PIE_GRAPH_REQUEST_RETURN;
                } else if (chart.req.chartType == LINE_CHART) {
                    chart.ret = MOCK_LINE_GRAPH_REQUEST_RETURN;
                }
            }

            props.setLoaded(false);
        }
    })

    // Handle dragging and snapping to the grid
    const handleDrag = (_: any, data: any, id: string) => {
        let vizContext = useContext(ChartDataPropContext);
        vizContext = vizContext.map((chart) => {
            chart.id === id ? { ...chart, x: data.x, y: data.y } : chart
        });
    };

    const removeChart = (id: string) => {
        for (const prop of charts) {
            if (prop.id === id) {
                
            }
        }
        
        setCharts(charts.filter((prop) => {
            return prop.id !== id;
        }));
    }

    return (
        <div id="grid"
            style={{
                position: "relative",
                width: GRID_WIDTH,
                height: GRID_HEIGHT,
                border: "1px solid black",
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                backgroundImage:
                    "linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)",
            }}>
                <div style={{position: "relative", left: "1px", top: "1px", width: GRID_WIDTH - 1, height: GRID_HEIGHT - 1}}>
            {/* Draggable Charts */}
            {charts.map((chart) => (
                <Draggable
                    nodeRef={refs.get(chart.id)}
                    key={chart.id}
                    position={{ x: chart.x, y: chart.y }} // Set the position based on chart state
                    grid={[CELL_SIZE, CELL_SIZE]}
                    bounds={"parent"}
                    onDrag={(e, data) => handleDrag(e, data, chart.id)} // Handle the drag
                >
                    <div
                        key={chart.id}
                        ref={refs.get(chart.id)}
                        style={{
                            width: chart.width,
                            height: chart.height,
                            cursor: "grab",
                            background: "white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            borderRadius: 0,
                            position: "absolute",
                        }}
                        onDoubleClickCapture={() => {removeChart(chart.id);}}>
                        <Visualization graph_type={chart.req.chartType} returned_data={chart.ret} />
                    </div>
                </Draggable>
            ))}
            </div>
        </div>
    );
};

export default GridEditor;
