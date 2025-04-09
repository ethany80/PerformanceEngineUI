import React from "react";
import { BAR_CHART, CELL_SIZE, LINE_CHART, PIE_CHART } from "../../types/Constants";
import { BarChart } from "@mui/x-charts/BarChart";
import { GraphRequestReturn } from "../../types/BackendInterfaces";

import "./Visualization.css";
import { LineChart, PieChart, PieValueType } from "@mui/x-charts";

type Props = { graph_type: string, returned_data?: GraphRequestReturn }

function is2DArray<T>(union: T[] | T[][]) {
    return union.length > 0 && Array.isArray(union[0]);
}

const Visualization: React.FC<Props> = (props) => {
    let chart = (<p>Uh oh! Something went wrong with the chart!</p>);

    if (
        props.graph_type == BAR_CHART &&
        props.returned_data &&
        props.returned_data.data &&
        !is2DArray(props.returned_data.data)) {
        chart = (<BarChart
            xAxis={[{ scaleType: "band", data: props.returned_data.axes }]}
            axisHighlight={{x: 'none', y: 'none'}}
            series={[{ data: props.returned_data.data as number[] }]}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (props.graph_type == BAR_CHART) {
        chart = (<BarChart
            className="undefined-chart"
            axisHighlight={{x: 'none', y: 'none'}}
            xAxis={[{ scaleType: "band", data: ["A", "B", "C"] }]}
            series={[{ data: [4, 7, 2] }]}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (
        props.graph_type == PIE_CHART &&
        props.returned_data &&
        props.returned_data.data &&
        !is2DArray(props.returned_data.data)) {

        let dataSeries: PieValueType[] = [];
        for (let i = 0; i < props.returned_data.axes.length; i++) {
            dataSeries = [...dataSeries, {
                id: i,
                value: props.returned_data.data[i] as number,
                label: props.returned_data.axes[i]
            }]
        }

        chart = (<PieChart
            series={[
                {
                    data: dataSeries
                }
            ]}
            axisHighlight={{x: 'none', y: 'none'}}
            tooltip={{trigger: 'none'}}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (props.graph_type == PIE_CHART) {
        chart = (<PieChart
            className="undefined-chart"
            series={[
                {
                    data: [
                        { id: 0, value: 14, label: 'Placeholder A' },
                        { id: 1, value: 15, label: 'Placeholder B' },
                        { id: 2, value: 20, label: 'Placeholder C' },
                    ]
                }
            ]}
            axisHighlight={{x: 'none', y: 'none'}}
            tooltip={{trigger: 'none'}}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (
        props.graph_type == LINE_CHART &&
        props.returned_data &&
        props.returned_data.data &&
        is2DArray(props.returned_data.data)) {

        chart = (<LineChart
            xAxis={[{data: (props.returned_data.data[0] as number[])}]}
            series={[
                {
                    data: (props.returned_data.data[1] as number[])
                }
            ]}
            axisHighlight={{x: 'none', y: 'none'}}
            tooltip={{trigger: 'none'}}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (props.graph_type == LINE_CHART) {
        chart = (<LineChart
            className="undefined-chart"
            xAxis={[{data: [1, 2, 3, 5, 8, 10]}]}
            series={[
                {
                    data: [2, 5.5, 2, 8.5, 1.5, 5]
                }
            ]}
            axisHighlight={{x: 'none', y: 'none'}}
            tooltip={{trigger: 'none'}}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    }

    return chart;
};

export default Visualization;
