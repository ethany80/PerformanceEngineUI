// GridEditor

import { GraphRequest, GraphRequestReturn, SingleBarRequestReturn } from "./BackendInterfaces";

/** Size of each grid cell. */
export const CELL_SIZE = 25;
/** Overall grid width. */
export const GRID_WIDTH = 850;
/** Overall grid height. */
export const GRID_HEIGHT = 1100;

// Chart types
export const BAR_CHART = 'bar';
export const MULTI_BAR_CHART = 'multi-bar';
export const PIE_CHART = 'pie';
export const LINE_CHART = 'line';
export const MULTI_LINE_CHART = 'multi-line';
export const TABLE_CHART = 'table';

export const MOCK_BAR_GRAPH_REQUEST: GraphRequest = {
    id: 'bargraph',
    type: 'returns',
    range: ['00', '01'],
    chartType: BAR_CHART
};

export const MOCK_PIE_GRAPH_REQUEST: GraphRequest = {
    id: 'piegraph',
    type: 'allocation',
    range: ['00', '01'],
    chartType: PIE_CHART
};

export const MOCK_BAR_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: undefined,
    type: BAR_CHART,
    chartData: {
        xAxis: ["1/1", "2/1", "3/1"],
        values: [14, 3, 5]
    }
}

export const MOCK_PIE_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    title: undefined,
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
    title: undefined,
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

export const MOCK_TITLE: string = "Loaded Report Title"