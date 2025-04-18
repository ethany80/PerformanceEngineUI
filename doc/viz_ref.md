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
If valid layout-id:
```json
{
  "entities": {
    "acc01": { "name": "Account Name!", "types": ["Return", "Market Value", "Allocation"] }
    "acc02": { "name": "Account Name 2", "types": ["Return", "Market Value", "Allocation"] }
    "pos01": { "name": "Position Name!", "types": ["Market Value", "Return"], "parent": "acc01" }
    "...": ["etc."]
  },
  "data-types": [
    "Market Value": { "types": ["line", "multi-line", "bar", "table"], "range2-enabled": true, "can-be-multiple": true },
    "Return": { "types": ["line", "multi-line", "bar", "table"], "range2-enabled": true, "can-be-multiple": true },
    "Allocation": { "types": ["pie", "table"], "range2-enabled": false, "can-be-multiple": false }
  ],
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
        "data-points": 10,
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
        "data-points": 10,
        "chartType": "pie"
      }
    },
    "...": { "etc.": "..." }
  }
}
```
Response should be `HTTP 200`.

If the layout-id is invalid, send an `HTTP 400` response.

# Viz Data Request (Client -> Server)
`GET /api/graph`
```json
{
  "id": "AccID4",
  "type": "Asset Allocation",
  "range": ["01/25", "02/25"],
  "data-points": 10,
  "chartType": "pie"
}
```

# Viz Request Return Types (Server -> Client)
- ## General / All
  - Chart title
  - Chart type
  - Number of data points
  - Chart-Specific data
```json
{
  "title": "Chart Name",
  "type": "/* use name specified in Constants.ts */",
  "chart-data": { "/* info specified below */": "" }
}
```
Response should be `HTTP 200`.
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
  "separate-bottom": true,
  "datapoints": [1,2,3,4,5,6,7, "..."]
}
```

# Getting Available Templates
In order to display the templates (other than blank) to create a new report from, and endpoint with no params is needed.
The return of this can be an empty array if none are available.

`GET /api/all-templates`

### Server Response
```json
[
  "template-id-1": "Template Name",
  "template-id-2": "Template Name 2",
  "template-id-3": "Template Name 3"
]
```

Response should be `HTTP 200`.

# Getting Available Entities
In order to display the entities to be selected in the creation screen, an endpoint needs to be available
to retrieve all entities. No params should be needed for this.
### Client Request
`GET /api/all-entities`

No params should be needed for this.
### Server Response
Since this is almost the same use-case as the entities object of a 
document request return, just use the same types.
Note that the `types` array can be empty, since it won't actually be used.
It only needs to be present to fulfill the type requirement.
```json
{
  "acc01": { "name": "Account Name!", "types": [] },
  "acc02": { "name": "Account Name 2", "types": [] },
  "pos01": { "name": "Position Name!", "types": [], "parent": "acc01" }
  "...": ["etc."]
}
```
Response should be `HTTP 200`.

# Create Report (Client ->  Server)
### Blank Report
Even a blank report will need a layout-id to be generated.

`POST /api/create`
```json
{
  "base-layout": "layout-id OR 'blank'",
  "name": "Initial Report Name",
  "entities": ["acc01", "pos01", "etc..."]
}
```
This endpoint should return a newly generated layout-id for the editor to work on. 
This should be in an `HTTP 201` response.

### New From Template
`POST /api/from-template`
```json
{
  "id": "template-id",
  "entities": [
    "ACC1",
    "ACC2",
  ],

  "range1": "01/16/2002",
  "range2": "01/17/2002", 
}
```

Should return a newly generated layout-id for the editor to work on w/ an `HTTP 201` response.

# Save Report (Client -> Server)
Since the client cannot modify the available accounts in a report (yet...), only send the visualizations
with their scaling and location info. Note, for an actual prod use, this needs to be modified to include an auth
token, or else anyone can overwrite any report by changing the layout field.

`POST /api/save`
```json
{
"layout": "layout-id",
"name": "name",
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
        "data-points": 10,
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
        "data-points": 10,
        "chartType": "pie"
      }
    },
    "...": { "etc.": "..." }
  }
}
```
Response should be `HTTP 200`.

