import KeplerGl, {addDataToMap} from "kepler.gl";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {AutoSizer} from "react-virtualized";

// The example dataset has the following columns, in production, you should know what columns your data has and
// be able to convert the query response into the corresponding set of Kepler fields. You could do this with a
// preflight DESCRIBE query, or parse your dataset schema, for example. These are here as we map the Presto columns
// to Kepler fields dynamically, so you don't need to edit this file after modifying the example query.
//
// presto> DESCRIBE geospock.default.tweets3;
//      Column     |   Type    | Extra |     Comment
// ----------------+-----------+-------+-----------------
//  tweet_id       | varchar   |       | Nullable
//  tweet_tweetid  | varchar   |       | Nullable
//  tweet_userid   | varchar   |       | Nullable
//  tweet_artistid | varchar   |       | Nullable
//  tweet_trackid  | double    |       | Nullable
//  timestamp      | timestamp |       | TIME index
//  tweet_weekday  | double    |       | Nullable
//  longitude      | double    |       | LONGITUDE index
//  latitude       | double    |       | LATITUDE index
// (9 rows)
/* eslint-disable babel/camelcase */
const KEPLER_FIELDS = {
    tweet_id: {
        name: "tweet_id",
        format: "",
        type: "string",
    },
    tweet_tweetid: {
        name: "tweet_tweetid",
        format: "",
        type: "string",
    },
    tweet_userid: {
        name: "tweet_userid",
        format: "",
        type: "string",
    },
    tweet_artistid: {
        name: "tweet_artistid",
        format: "",
        type: "string",
    },
    tweet_trackid: {
        name: "tweet_trackid",
        format: "",
        type: "real",
    },
    timestamp: {
        name: "timestamp",
        format: "YYYY-MM-DD HH:mm:ss.SSS",
        type: "timestamp",
    },
    tweet_weekday: {
        name: "tweet_weekday",
        format: "",
        type: "real",
    },
    longitude: {
        name: "longitude",
        format: "",
        type: "real",
    },
    latitude: {
        name: "latitude",
        format: "",
        type: "real",
    },
};
/* eslint-enable babel/camelcase */

const DATASET_ID = "example";

export default function Kepler(props) {
    const {
        mapboxToken,
        queryResults,
    } = props;

    const dispatch = useDispatch();
    useEffect(() => {
        const {
            columns = [],
            data = [],
        } = queryResults;

        const keplerData = {
            // We are processing the columns returned by the query against the known list of fields, so that you can
            // change the query, without also changing this processing code...
            fields: columns.map(({name}) => KEPLER_FIELDS[name]),
            rows: data,
        };

        const sampleConfig = {
            visState: {
                filters: [],
            }
        };

        // We are only adding the time range filter, if there is a timestamp field returned by the query...
        keplerData.fields.forEach(({name, type}) => {
            if (type === "timestamp") {
                sampleConfig.visState.filters.push({
                    id: `filter_${name}`,
                    dataId: DATASET_ID,
                    name: name,
                    type: "timeRange",
                    enlarged: true
                });
            }
        });

        dispatch(addDataToMap({
            datasets: {
                info: {
                    label: "Tweets...",
                    id: DATASET_ID
                },
                data: keplerData
            },
            option: {
                centerMap: true,
                readOnly: false,
                keepExistingConfig: false
            },
            info: {
                title: "GeoSpock Integration Example",
                description: "This is an example of integrating the GeoSpock and Kepler, via the Presto REST API..."
            },
            config: sampleConfig
        }));
    }, [queryResults]);

    return (
        <AutoSizer>
            {({height, width}) => (
                <KeplerGl
                    appName = {"GeoSpock Integration"}
                    height = {height}
                    id = {"kepler-map"}
                    mapboxApiAccessToken = {mapboxToken}
                    mapStylesReplaceDefault = {true}
                    mapStyles = {[
                        {
                            id: "dark",
                            label: "Dark",
                            url: "mapbox://styles/mapbox/dark-v9",
                            icon: `https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=${mapboxToken}&logo=false&attribution=false`,
                        }
                    ]}
                    version = {"0.0.1"}
                    width = {width}
                />
            )}
        </AutoSizer>
    );
}
