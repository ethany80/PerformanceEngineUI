// GridEditor

import { GraphRequest, GraphRequestReturn } from "./BackendInterfaces";

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
    axes: ["D", "E", "F"],
    data: [14, 3, 5],
    supportedTypes: [BAR_CHART]
}

export const MOCK_PIE_GRAPH_REQUEST_RETURN: GraphRequestReturn = {
    axes: ["Cool", "OK", "Bad"],
    data: [50, 20, 30],
    supportedTypes: [PIE_CHART]
}