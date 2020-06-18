import KeplerGl, {addDataToMap} from "kepler.gl";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {AutoSizer} from "react-virtualized";
import {prestoColumnsToKelperFields} from "../utils/convert";

// This is your MapBox access token, which is required for Kepler to function.
const MAPBOX_TOKEN = "Insert your API token here";

const DATASET_ID = "example";

export default function Kepler(props) {
    const {queryResults} = props;

    const dispatch = useDispatch();
    useEffect(() => {
        const {
            columns = [],
            data = [],
        } = queryResults;

        const keplerData = {
            // We are processing the columns returned by the query against the known list of fields, so that you can
            // change the query, without also changing this processing code...
            fields: prestoColumnsToKelperFields(columns),
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
                    label: "Tweets",
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
                title: "GeoSpock DB Integration Example",
                description: "This is an example of integrating the GeoSpock DB and Kepler, via the Presto REST API..."
            },
            config: sampleConfig
        }));
    }, [queryResults]);

    return (
        <AutoSizer>
            {({height, width}) => (
                <KeplerGl
                    appName = {"GeoSpock DB Integration"}
                    height = {height}
                    id = {"kepler-map"}
                    mapboxApiAccessToken = {MAPBOX_TOKEN}
                    mapStylesReplaceDefault = {true}
                    mapStyles = {[
                        {
                            id: "dark",
                            label: "Dark",
                            url: "mapbox://styles/mapbox/dark-v9",
                            icon: `https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=${MAPBOX_TOKEN}&logo=false&attribution=false`,
                        }
                    ]}
                    version = {"0.0.1"}
                    width = {width}
                />
            )}
        </AutoSizer>
    );
}
