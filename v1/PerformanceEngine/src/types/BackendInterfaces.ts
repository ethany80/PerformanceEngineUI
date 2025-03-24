/**
 * Interface type for GraphRequest params.
 */
export interface GraphRequest {
  /**
   * ID to identify graph data source.
   */
  id: string;
  /**
   * Graph data type. (Ex. market value, return)
   */
  type: string;
  /** Array with two indices, start of range and end of range.
   * These will be filtered in the backend.
   */
  range: string[];

  /**
   * Type of chart to use for this graph request.
   */
  chartType: string;
}

/**
 * Interface type for return values of GraphRequest.
 */
export interface GraphRequestReturn {
    /**
     * Axis labels.
     */
    axes: string[];
    /** 
     * Data may be either a 1D (bar charts, pie charts, 1-line line charts) 
     * or 2D array of numbers (multi-line, table), check supported types before attempting to access at index.  */
    data: number[][]|number[];
    /**
     * String array of supported types. Possible values are:
     * - `bar`
     * - `1-line`
     * - `multi-line`
     * - `pie`
     * - `table`
     */
    supportedTypes: string[];
}