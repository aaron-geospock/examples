# Presto Client for browsers

GeoSpock Presto REST API client for browsers

Note that Presto must be available with CORS configured. Doing so is out of the scope of this module.

## Usage

```
import PrestoClient from "presto-client-browser";

let prestoClient = new PrestoClient('https://host:port', username, password);
let blocks = [];
let resultColumns = [];
for await (let {state, data, columns} of prestoClient.execute(`
     select * 
     from mytable 
 `)) {
    console.log(state);
    blocks.push(data);
    resultColumns = columns;
}
let rows = [].concat(...blocks);
console.log("Columns:", resultColumns.map(({name}) => name).join(", "));
console.log("Rows:", rows.length);

```
