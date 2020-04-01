import React from "react";
import DataLoader from "./DataLoader";

function App() {
    // This is the URI of the Presto REST API.
    const PRESTO_URI = "https://sqlaccess.example.com:8446";

    // This is the Presto user that will execute the query, it's passed via the X-Presto-User REST API request header.
    // This does not have to be the same user that will be used to provide the authentication to access the REST API.
    const PRESTO_USER = "presto-user@example.com";

    // This is an example query, it assumes that you have already followed the instruction and ingested the
    // integration examples dataset. Map based visualisations in Web browsers don't cope with millions of points very
    // well, so we are using the Presto TABLESAMPLE function to return a quarter of the available results, or around
    // 6,500 rows of the example dataset. The bounding box encompasses the United Kingdom and the Republic of Ireland,
    // while the time range is limited to two months. Changing any of these variables will result in your query time
    // changing, in some cases significantly; for example an unrestricted time range, with a bounding box of the entire
    // world, will take around 45 to 50 minutes to complete.
    const EXAMPLE_QUERY =
        "SELECT *\n" +
        "  FROM geospock.default.tweets AS tweets TABLESAMPLE BERNOULLI (25)\n" +
        " WHERE tweets.\"longitude\" BETWEEN -10.8544921875 AND 2.021484375\n" +
        "   AND tweets.\"latitude\" BETWEEN 49.82380908513249 AND 59.478568831926395" +
        "   AND tweets.\"timestamp\" BETWEEN TIMESTAMP '2012-04-01 00:00:00' AND TIMESTAMP '2012-05-31 23:59:59'";

    // This is your MapBox token, which is required for Kepler to function.
    const MAPBOX_TOKEN = "mapbox-token";

    return (
        <DataLoader
            mapboxToken = {MAPBOX_TOKEN}
            prestoUri = {PRESTO_URI}
            prestoUser = {PRESTO_USER}
            sql = {EXAMPLE_QUERY}
        />
    );
}

export default App;
