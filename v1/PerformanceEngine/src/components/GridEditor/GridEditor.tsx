import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Draggable from "react-draggable";
import { BarChart } from "@mui/x-charts/BarChart";

import Visualization from "../Visualization/Visualization";

import { GRID_HEIGHT, GRID_WIDTH, CELL_SIZE, MOCK_BAR_GRAPH_REQUEST_RETURN, BAR_CHART, PIE_CHART, MOCK_PIE_GRAPH_REQUEST_RETURN } from "../../types/Constants";
import { GraphRequest, GraphRequestReturn } from "../../types/BackendInterfaces";

interface ChartDataProps {
  req: GraphRequest;
  ret: GraphRequestReturn|undefined;
  id: string;
  x: number;
  y: number;
}

type Props = { 
  new_graph_request?: GraphRequest, 
  set_graph_request: (req: GraphRequest|undefined) => void,
  loadData: boolean, setLoaded: (val: boolean) => void }

const GridEditor: React.FC<Props> = (props) => {
  const [charts, setCharts] = useState<ChartDataProps[]>([]);
  const [nextId, setNextId] = useState<number>(0);

  useEffect(() => {
    if (props.new_graph_request != undefined) {
      const req = props.new_graph_request;
      setCharts((prevCharts) => [...prevCharts, {
        req: req,
        ret: undefined,
        x: 0, 
        y: 0, 
        id: req.id + nextId.toString()
      }]);
      setNextId(nextId + 1);
      props.set_graph_request(undefined);
    }

    if (props.loadData) {
      for (const chart of charts) {
        if (chart.req.chartType == BAR_CHART) {
          chart.ret = MOCK_BAR_GRAPH_REQUEST_RETURN;
        } else if (chart.req.chartType == PIE_CHART) {
          chart.ret = MOCK_PIE_GRAPH_REQUEST_RETURN;
        }
      }

      props.setLoaded(false);
    }
  })

  const nodeRef = useRef(null);

  // Handle dragging and snapping to the grid
  const handleDrag = (e: any, data: any, id: string) => {
    setCharts((prevCharts) =>
      prevCharts.map((chart) =>
        chart.id === id ? { ...chart, x: data.x, y: data.y } : chart
      )
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        border: "1px solid black",
        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        backgroundImage:
          "linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)",
      }}
    >
      {/* Draggable Charts */}
      {charts.map((chart) => (
        <Draggable
          nodeRef={nodeRef}
          key={chart.id}
          position={{ x: chart.x, y: chart.y }} // Set the position based on chart state
          grid={[CELL_SIZE, CELL_SIZE]}
          bounds={ "parent" }
          onDrag={(e, data) => handleDrag(e, data, chart.id)} // Handle the drag
        >
          <div
            ref={nodeRef}
            style={{
                width: CELL_SIZE * 10,
                height: CELL_SIZE * 10,
                cursor: "grab",
                background: "white",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: 0,
                position: "absolute",
            }}
        >
          <Visualization graph_type={chart.req.chartType} returned_data={chart.ret} />
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default GridEditor;
