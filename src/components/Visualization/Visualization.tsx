import React, { JSX } from "react";
import { BAR_CHART, CELL_SIZE, LINE_CHART, MULTI_BAR_CHART, MULTI_LINE_CHART, PIE_CHART, TABLE_CHART } from "../../types/Constants";
import { BarChart } from "@mui/x-charts/BarChart";
import { GraphRequestReturn, MultiBarRequestReturn, MultiLineRequestReturn, PieRequestReturn, SingleBarRequestReturn, SingleLineRequestReturn, TableRequestReturn } from "../../types/BackendInterfaces";

import "./Visualization.css";
import { LineChart, PieChart, PieValueType } from "@mui/x-charts";
import { DatasetElementType } from "@mui/x-charts/internals";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

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
    } else if (props.graph_type == MULTI_BAR_CHART && props.returned_data?.type == MULTI_BAR_CHART) {
        const data = props.returned_data.chartData as MultiBarRequestReturn;

        chart = (<BarChart
            xAxis={[{ scaleType: "band", 
                data: data.xAxis
                }]}
            axisHighlight={{x: 'none', y: 'none'}}
            series={ Object.entries(data.values).map(([], i) => {
                return { 
                    data: Object.entries(data.values).map(([, val]) => {
                        return val[i];
                    }) 
                }
            }) }
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (props.graph_type == MULTI_BAR_CHART) {
        chart = (<BarChart
            className="undefined-chart"
            axisHighlight={{x: 'none', y: 'none'}}
            xAxis={[{ scaleType: "band", data: ["A", "B", "C"] }]}
            series={[{ data: [4, 7, 2] }, { data: [3, 4, 6] }, { data: [8, 1, 4] }]}
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
    } else if (props.graph_type == MULTI_LINE_CHART && props.returned_data?.type == MULTI_LINE_CHART) {
        const data = props.returned_data.chartData as MultiLineRequestReturn;

        chart = (<LineChart
            xAxis={Object.entries(data.points).map(([key,val]) => {
                return {label: key, data: val.map((pt) => { return pt.x })}
            })}
            series={Object.entries(data.points).map(([key,val]) => {
                return {label: key, data: val.map((pt) => { return pt.y })}
            })}

            axisHighlight={{x: 'none', y: 'none'}}
            tooltip={{trigger: 'none'}}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (props.graph_type == MULTI_LINE_CHART) {
        chart = (<LineChart
            className="undefined-chart"
            xAxis={[{data: [1, 2, 3, 5, 8, 10]}]}
            series={[
                { data: [2, 5.5, 2, 8.5, 1.5, 5] },
                { data: [5, 1.5, 8.5, 2, 5.5, 2] }
            ]}
            axisHighlight={{x: 'none', y: 'none'}}
            tooltip={{trigger: 'none'}}
            width={CELL_SIZE * 10}
            height={CELL_SIZE * 10} />)
    } else if (props.graph_type == TABLE_CHART && props.returned_data?.type == TABLE_CHART) {
        const data = props.returned_data.chartData as TableRequestReturn;
        let rows = []
        for (let i = 0; i < data.data.length; i+= data.cols) {
            rows.push(data.data.slice(i, i + data.cols));
        }

        chart = (<Table>
            <TableHead className="table-header">
                <TableRow>
                    {data.headers.map((cell) => (
                        <TableCell className="table-header">{cell}</TableCell>
                    )) }
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, idx) => (
                    (idx == rows.length - 1 && data.seperateBottom === true) ?
                        <TableRow>
                            {row.map((val) => (
                                <TableCell className="final-table-row-item">{val}</TableCell>
                            ))}
                        </TableRow>
                    :

                        <TableRow>
                            {row.map((val, rowIdx) => (
                                rowIdx == 0 ?
                                <TableCell component="th" scope="row">{val}</TableCell>
                                :
                                <TableCell>{val}</TableCell>
                            ))}
                        </TableRow>
                )) }
            </TableBody>
            </Table>)
    } else if (props.graph_type == TABLE_CHART) {
        chart = (<Table>
            <TableHead className="table-header">
                <TableRow>
                    <TableCell className="table-header">A Header</TableCell>
                    <TableCell className="table-header">B Header</TableCell>
                    <TableCell className="table-header">C Header</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row">A</TableCell>
                    <TableCell>B</TableCell>
                    <TableCell>C</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">D</TableCell>
                    <TableCell>E</TableCell>
                    <TableCell>F</TableCell>
                </TableRow>
            </TableBody>
            </Table>)
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
