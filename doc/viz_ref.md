# API Thoughts/Reference
General flow is as follows:

`
Client makes request w/ layout id -> Server responds with account ids and their available data/types, as well as any template visualizations
-> Client builds basic UI using these types/IDs, requests graph data
-> Server responds with graph data -> When client is done, send a save request
`

When generating a new report, backend clones the preset and gives the client the corresponding 'layout' id of the new document.

# Document Info Request
## Client Request:
`GET /api/doc`
```json
{
  "layout": "layout-id"
}
```
## Server Response:
```json
{
  "accounts": {
    "id1": ["bar", "line"],
    "id2": ["pie"],
    "...": ["etc."]
  },
  "visualizations": {
    "ID10": {
      "width": 249,
      "height": 249,
      "x": 125,
      "y": 25,
      "req": {
        "id": "AccID1",
        "type": "Market Value",
        "range": ["01/25", "02/25"],
        "chartType": "bar"
      }
    },
    "ID41": {
      "width": 249,
      "height": 249,
      "x": 425,
      "y": 325,
      "req": {
        "id": "AccID4",
        "type": "Asset Allocation",
        "range": ["01/25", "02/25"],
        "chartType": "pie"
      }
    },
    "...": { "etc.": "..." }
  }
}
```

# Viz Data Request (Client -> Server)
`GET /api/graph`
```json
{
  "id": "AccID4",
  "type": "Asset Allocation",
  "range": ["01/25", "02/25"],
  "chartType": "pie"
}
```

# Viz Request Return Types (Server -> Client)
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
      {"x": 1, "y": 2},
      {"x": 3, "y": 4}
    ],
    "b": [
      {"x": 1, "y": 1},
      {"x": 5, "y": 3}
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

# Save Report (Client -> Server)
Since the client does cannot to modify the available accounts in a report (yet...), only send the visualizations
with their scaling and location info.

`POST /api/save`
```json
{
"visualizations": {
    "ID10": {
      "width": 249,
      "height": 249,
      "x": 125,
      "y": 25,
      "req": {
        "id": "AccID1",
        "type": "Market Value",
        "range": ["01/25", "02/25"],
        "chartType": "bar"
      }
    },
    "ID41": {
      "width": 249,
      "height": 249,
      "x": 425,
      "y": 325,
      "req": {
        "id": "AccID4",
        "type": "Asset Allocation",
        "range": ["01/25", "02/25"],
        "chartType": "pie"
      }
    },
    "...": { "etc.": "..." }
  }
}