# Viz Request Return Types:
- ## General / All
  - Chart title
  - Chart type
  - Chart-Specific data
```json
{
  "title": "Chart Name",
  "type": "/* use name specified in Constants.ts */",
  "chart-data": { "/* info specified below */": "" }
}
```
- ## Single bar
  - Axis labels
  - Bar values
  - Bar labels
```json
{
  "x-axis": ["date1", "date2", "date3"],
  "values": [15,14,13],
}
```
- ## Multi bar
  - Axis labels
  - Bar heights
  - Bar labels
```json
{
  "x-axis": ["date1", "date2", "date3"],
  "values": {
    "a": [1,44,5],
    "b": [3,30,9]
  }
}
```
- ## Single line
  - Line label
  - Points
```json
{
  "points": [
    {"x": 1, "y": 2},
    {"x": 3, "y": 4}
  ]
}
```
- ## Multi line
  - Same as single line but record w/ line name as key
```json
{
  "points": {
    "a": [
      {x: 1, y: 2},
      {x: 3, y: 4}
    ],
    "b": [
      {x: 1, y: 1},
      {x: 5, y: 3}
    ],
  }
}
```
- ## Pie
  - Slices
    - Probably `[{value: x, label: y}, ...]`
```json
{
  "slices": [
    {"name": "slice a", "value": 50},
    {"name": "slice b", "value": 50}
  ]
}
```
- ## Table
  - Needs to support many datapoints
  - List number of cols, then just an array, frontend can split where necessary
```json
{
  "cols": 2,
  "headers": ["header1", "header2"],
  "datapoints": [1,2,3,4,5,6,7, "..."]
}
```