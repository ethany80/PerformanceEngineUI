/**
 * Interface containing information for a given entity ID retrieved from the backend.
 */
export interface Entity {
    /**
     * Name for a given entity.
     */
    name: string;
    /**
     * Available visualization types for the given ID.
     */
    types: string[];
    /**
     * Name of the entity's parent entity.
     */
    parent: string|undefined;
}

/**
 * Interface containing data about the available data types and what they can be used for.
 */
export interface DataType {
    /**
     * Supported graph types for this data type.
     */
    types: string[];
    /**
     * Whether this data type will have a secondary range selector.
     */    
    range2Enabled: boolean;
    /**
     * Whether this data type supports multi-selected IDs (either positions or accounts).
     */
    canBeMultiple: boolean;
}

/**
 * Interface type for GraphRequest params.
 */
export interface GraphRequest {
    /**
     * ID to identify graph data source.
     */
    id: string[];
    /**
     * Graph data type. (Ex. market value, return)
     */
    type: string;
    /** Array with two indices, start of range and end of range.
     * These will be filtered in the backend.
     */
    range: string[];
    /**
     * Number of data points to include in the graph.
     */
    dataPoints: number;
    /**
     * Type of chart to use for this graph request.
     */
    chartType: string;
}

/**
 * Interface type for return of a single bar chart request.
 */
export interface SingleBarRequestReturn {
    /** Labels for the X-axis. */
    xAxis: string[];
    /** Numeric values for each label. */
    values: number[];
}

/**
 * Interface type for return of a multi-series bar chart request.
 */
export interface MultiBarRequestReturn {
    /** Shared X-axis labels. */
    xAxis: string[];
    /** Mapping of series names to arrays of numeric values. */
    values: Record<string, number[]>;
}

/**
 * Represents a single 2D point.
 */
export interface LinePoint {
    x: number;
    y: number;
}

/**
 * Interface type for return of a single line chart request.
 */
export interface SingleLineRequestReturn {
    /** Array of 2D points. */
    points: LinePoint[];
}

/**
 * Interface type for return of a multi-series line chart request.
 */
export interface MultiLineRequestReturn {
    /** Mapping of series names to 2D points. */
    points: Record<string, LinePoint[]>;
}

/**
 * Represents a single pie slice.
 */
export interface PieSlice {
    name: string;
    value: number;
}

/**
 * Interface type for return of a pie chart request.
 */
export interface PieRequestReturn {
    /** Array of pie slices. */
    slices: PieSlice[];
}

/**
 * Interface type for return of a table request.
 */
export interface TableRequestReturn {
    /** Number of columns. */
    cols: number;
    /** Column headers. */
    headers: string[];
    /** Data type of each cell (valid values: 'string', 'number'). */
    dataType: string;
    /** Whether to separate the bottom row in styling. */
    seperateBottom: boolean;
    /** Flattened row-major array of table values. */
    data: string[]|number[];
}


/**
 * Interface type for return values of GraphRequest.
 */
export interface GraphRequestReturn {
    /**
     * Title to apply to chart
     */
    title: string|undefined;
    /**
     * Chart type. Used to quickly determine which chart type to cast.
     */
    type: string,
    /**
     * Chart-specific data.
     */
    chartData:
    SingleBarRequestReturn |
    MultiBarRequestReturn |
    SingleLineRequestReturn |
    MultiLineRequestReturn |
    PieRequestReturn |
    TableRequestReturn;
}

export interface FromAiRequest {
    prompt: string;
    entities: string[];
    range1: string;
    range2: string;
}

export interface FromBlankRequest {
    name: string;
    entities: string[];
}