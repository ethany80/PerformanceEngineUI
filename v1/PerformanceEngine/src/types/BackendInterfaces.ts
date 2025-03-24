/**
 * Interface type for datasets.
 */
export interface Dataset {
    /**
     * Dataset id.
     */
    id: string;
    /**
     * Axis labels.
     */
    axes: string[];
    /** 
     * Data may be either a 1D (bar charts, pie charts, 1-line line charts) 
     * or 2D array of numbers (multi-line, table), check supported types before attempting to access at index.  */
    data: Array<number[]|number>;
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