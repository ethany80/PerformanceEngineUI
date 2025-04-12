import React, { JSX } from "react";
import { BAR_CHART, CELL_SIZE, LINE_CHART, PIE_CHART } from "../../types/Constants";
import { BarChart } from "@mui/x-charts/BarChart";
import { GraphRequestReturn, PieRequestReturn, SingleBarRequestReturn, SingleLineRequestReturn } from "../../types/BackendInterfaces";

import "./Visualization.css";
import { LineChart, PieChart, PieValueType } from "@mui/x-charts";
import { DatasetElementType } from "@mui/x-charts/internals";

type Props = { graph_type: string, returned_data?: GraphRequestReturn }

const Visualization: React.FC<Props> = (props) => {
    let chart = (<p>Uh oh! Something went wrong with the chart!</p>);

    if (props.graph_type == BAR_CHART && props.returned_data?.type == BAR_CHART) {
        const data = props.returned_data.chartData as SingleBarRequestReturn;

        chart = (<BarChart
            xAxis={[{ scaleType: "band", data: data.xAxis }]}
            axisHighlight={{x: 'none', y: 'none'}}
            series={[{ data: data.values }]}
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
    } else if (props.graph_type == PIE_CHART && props.returned_data?.type == PIE_CHART) {
        const data = props.returned_data.chartData as PieRequestReturn;
        
        let dataSeries: PieValueType[] = [];
        for (let i = 0; i < data.slices.length; i++) {
            dataSeries = [...dataSeries, {
                id: i,
                value: data.slices[i].value,
                label: data.slices[i].name
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
    } else if (props.graph_type == LINE_CHART && props.returned_data?.type == LINE_CHART) {
        const data = props.returned_data.chartData as SingleLineRequestReturn;

        chart = (<LineChart
            xAxis={[{dataKey: "x"}]}
            series={[{dataKey: "y"}]}
            dataset={data.points as any as DatasetElementType<number>[]}

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

    return (
        <div className="viz-div">
            {props.returned_data?.title &&
                <span>
                    <h5 className="viz-title">{props.returned_data.title}</h5>
                    <hr className="viz-title" />
                </span>
            }
            {chart}
        </div>
    );
};

export default Visualization;
