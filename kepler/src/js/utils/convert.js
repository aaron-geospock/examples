// Presto columns have the following shape:
//  {
// 	    "name": "xxx",
// 	    "type": "yyy",
// 	    "typeSignature": {
// 	        "rawType": "yyy",
// 	        "typeArguments": [],
// 	        "literalArguments": [],
// 	        "arguments": []
// 	    }
// 	}
//
// Whereas Kepler fields have this shape:
//  {
//      name: "xxx",
//      format: "yyy",
//      type: "zzz",
//  }
//
// The main difference is in the types, "varchar" as opposed to "string" etc. The conversion function below is naive, in
// that it ignores what the columns actually are, i.e. longitude and latitude, and just maps types from one schema to
// the other. If you name your longitude and latitude Kepler fields appropriately, then Kepler with automatically
// discover them, otherwise you will need to change the Kepler config. However, if you've stored longitude and latitude
// under names other than longitude and latitude, you can always rename them in your SQL query, which avoids having to
// change the Kepler config:
//
//      SELECT vehicle_longitude AS longitude, vehicle_latitude AS latitude, ...
//        FROM geospock.default.mydataset
//       WHERE ...
//
// An alternative strategy, is to issue a DESCRIBE query on the table containing the data. The GeoSpock DB encodes
// geo-temporal information within the comments column, which you could process and feed into a mapping function. An
// example of the output from this type of query is shown below:
//
// presto> DESCRIBE geospock.default.tweet;
//   Column   |   Type    | Extra |     Comment
// -----------+-----------+-------+-----------------
//  tweetid   | varchar   |       | Nullable
//  longitude | double    |       | LONGITUDE index
//  latitude  | double    |       | LATITUDE index
//  timestamp | timestamp |       | TIME index
//  id        | integer   |       | Nullable
//  userid    | varchar   |       | Nullable
//  artistid  | varchar   |       | Nullable
//  trackid   | varchar   |       | Nullable
//  weekday   | integer   |       | Nullable
// (9 rows)

const formatForType = (type) => {
    if (type === "timestamp") {
        // NOTE: if your temporal data has a different format, you'll need to change this match...
        return "YYYY-MM-DD HH:mm:ss.SSS";
    }

    return "";
};

const convertType = (type) => {
    if (type === "varchar") {
        return "string";
    }
    else if (type === "double" || type === "integer") {
        return "real";
    }
    else if (type === "timestamp") {
        return "timestamp";
    }
    else {
        console.log(
            `This naive type converter is unable to handle this type - "${type}"; defaulting to string.\n`,
            "If a string type isn't what you require, then you will need to change the code in the convertType(type) function."
        );
        return "string";
    }
};

export const prestoColumnsToKelperFields = (columns) =>
    columns.map(({name, type}) => ({
        name: name,
        format: formatForType(type),
        type: convertType(type),
    }));
