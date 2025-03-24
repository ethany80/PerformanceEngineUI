import React, { useState } from "react";
import { useRef } from "react";
import Draggable from "react-draggable";
import { BarChart } from "@mui/x-charts/BarChart";

import { Dataset } from "../../types/BackendInterfaces";
import { GRID_HEIGHT, GRID_WIDTH, CELL_SIZE } from "../../types/Constants";

interface ChartDataProps {
  id: string;
  x: number;
  y: number;
}

type Props = {datasets: Dataset[]}

const GridEditor: React.FC<Props> = (props) => {
  const [charts, setCharts] = useState<ChartDataProps[]>([
    { id: "chart1", x: 0, y: 0 },
    { id: "chart2", x: 200, y: 200 },
  ]);

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
            <BarChart
              xAxis={[{ scaleType: "band", data: ["A", "B", "C"] }]}
              series={[{ data: [4, 7, 2] }]}
              width={CELL_SIZE * 10}
              height={CELL_SIZE * 10}
            />
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default GridEditor;
