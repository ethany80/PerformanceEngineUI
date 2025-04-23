// GridEditor

import { GraphRequest, GraphRequestReturn, SingleBarRequestReturn } from "./BackendInterfaces";

/** Size of each grid cell. */
export const CELL_SIZE = 25;
/** Overall grid width. */
export const GRID_WIDTH = 850;
/** Overall grid height. */
export const GRID_HEIGHT = 1100;

// Chart types
export const BAR_CHART = 'bar-unused';
export const MULTI_BAR_CHART = 'bar';
export const PIE_CHART = 'pie';
export const LINE_CHART = 'line-unused';
export const MULTI_LINE_CHART = 'line';
export const TABLE_CHART = 'table';

export const MOCK_BAR_GRAPH_REQUEST: GraphRequest = {
    id: ['bargraph'],
    dataPoints: 3,
    type: 'returns',
    range: ['00', '01'],
    chartType: BAR_CHART
};

export const MOCK_PIE_GRAPH_REQUEST: GraphRequest = {
    id: ['piegraph'],
    type: 'allocation',
    dataPoints: 3,
    range: ['00', '01'],
    chartType: PIE_CHART
};

export const MOCK_BAR_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: "Bar",
    type: BAR_CHART,
    chartData: {
        xAxis: ["1/1", "2/1", "3/1"],
        values: [14, 3, 5]
    }
}

export const MOCK_MULTI_BAR_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: "Multi Bar!",
    type: MULTI_BAR_CHART,
    chartData: {
        xAxis: ["1/1", "2/1", "3/1"],
        values: {
            "A": [1, 4, 6],
            "B": [8, 3, 4],
            "C": [4, 4, 3]
        }
    }
}

export const MOCK_PIE_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: "Pie",
    type: PIE_CHART,
    chartData: {
        slices: [
            { name: "AAPL", value: 60 },
            { name: "AMZN", value: 10 },
            { name: "NVDA", value: 30 },
        ]
    }
}

export const MOCK_LINE_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: "Line",
    type: LINE_CHART,
    chartData: {
        points: [
            {x: 1, y: 8},
            {x: 2, y: 5.5},
            {x: 3, y: 26},
            {x: 5, y: 8.5},
            {x: 8, y: 5.5},
            {x: 10, y: 6},
        ],
    }
}

export const MOCK_MULTI_LINE_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: "Line 2",
    type: MULTI_LINE_CHART,
    chartData: {
        points: {
            "A": [
                {x: 1, y: 8},
                {x: 2, y: 5.5},
                {x: 3, y: 26},
                {x: 5, y: 8.5},
                {x: 8, y: 5.5},
                {x: 10, y: 6},
            ],
            "B": [
                {x: 1, y: 10},
                {x: 2, y: 3.5},
                {x: 3, y: 18},
                {x: 4, y: 12.5},
                {x: 8, y: 4.5},
                {x: 10, y: 1},
            ]
        },
    }
}

export const MOCK_TABLE_REQUEST_RETURN: GraphRequestReturn = {
    title: "Table!",
    type: TABLE_CHART,
    chartData: {
        cols: 3,
        headers: ["Col 1", "Col 2", "Col 3"],
        dataType: "number",
        seperateBottom: true,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}

export const MOCK_TITLE: string = "Loaded Report Title";

// export const ENDPOINT_URL: string = "http://127.0.0.1:5000/api";
export const ENDPOINT_URL: string = "https://1c04-209-54-90-249.ngrok-free.app/api";