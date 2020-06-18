import PrestoClient from "presto-client-browser";
import Kepler from "./Kepler";
import React, {
    useEffect,
    useReducer,
} from "react";

// Map based visualisations in Web browsers don't cope with millions of points very well, so if you change these queries
// be aware that you can easily cause the browser to run out of memory. You can use the TABLESAMPLE function to return a
// a portion of the available results.

// This query enables you to visualize where the tweets on a single day were sent from
const QUERY_ITEMS_ON_DATE =
    "SELECT event.*" +
    "  FROM geospock.default.tweet AS event" +
    " WHERE event.timestamp BETWEEN TIMESTAMP '2012-11-02 00:00:00' AND TIMESTAMP '2012-11-03 00:00:00'";

// Focusing on the city of Paris, this query shows the distribution of all tweets across the city
const QUERY_ITEMS_IN_PARIS =
    "SELECT event.*" +
    "  FROM geospock.default.tweet AS event" +
    " WHERE st_within(st_point(event.longitude, event.latitude), st_geometryfromtext('POLYGON ((2.225 48.854, 2.250 48.881, 2.320 48.901, 2.396 48.900, 2.410 48.881, 2.412 48.8333, 2.356 48.815, 2.225 48.854))'))";

// This query shows all tweets about a selected artist
const QUERY_PARIS_OUR_ARTIST =
    "SELECT event.*" +
    "  FROM geospock.default.tweet AS event" +
    " WHERE tweet_artistid = '356772'" +
    "   AND st_within(st_point(event.longitude, event.latitude), st_geometryfromtext('POLYGON ((2.225 48.854, 2.250 48.881, 2.320 48.901, 2.396 48.900, 2.410 48.881, 2.412 48.8333, 2.356 48.815, 2.225 48.854))'))";

// This query determines if our selected artist is popular across the globe as well as in Paris
const QUERY_ARTIST =
    "SELECT event.*" +
    "  FROM geospock.default.tweet AS event" +
    " WHERE tweet_artistid = '356772'" +
    "   AND event.timestamp BETWEEN TIMESTAMP '2012-11-01 00:00:00' AND TIMESTAMP '2012-12-01 00:00:00'";

// It looks like there are more tweets for this artist in Europe, but it is not clear. To see this more clearly, we can
// break the world up into boxes and look at the number of tweets in each box.
const QUERY_BOXED =
    "WITH events_boxed AS (" +
    "    SELECT ROUND((latitude + 10.0)/20.0,0) * 20.0 - 10.0 as latitude_box, ROUND((longitude + 10.0)/20.0,0) * 20.0 - 10.0 as longitude_box" +
    "      FROM geospock.default.tweet AS event" +
    "     WHERE tweet_artistid = '356772'" +
    "       AND event.timestamp BETWEEN TIMESTAMP '2012-11-01 00:00:00' AND TIMESTAMP '2012-12-01 00:00:00'" +
    ")" +
    "SELECT latitude_box, longitude_box, count(*) as num_events" +
    "  FROM events_boxed" +
    " GROUP BY latitude_box, longitude_box";

// This is the query that will be run, change this to another query and reload the browser tab to see the new results.
const EXAMPLE_QUERY = QUERY_ITEMS_ON_DATE;

// Internal state action names...
const DISPLAY_KEPLER = "DISPLAY_KEPLER";
const SET_ERROR = "SET_ERROR";
const UPDATE_QUERY_DETAILS = "UPDATE_QUERY_DETAILS";

const reducer = (state, {type, payload}) => {
    switch (type) {
        case UPDATE_QUERY_DETAILS:
            return {
                ...state,
                status: payload.status,
                results: {
                    columns: payload.columns,
                    data: [...state.results.data, ...payload.data],
                },
            };

        case DISPLAY_KEPLER:
            return {
                ...state,
                displayResults: true,
            };

        case SET_ERROR:
            return {
                ...state,
                error: payload,
            };

        default:
            return state;
    }
};

const initialState = {
    displayResults: false,
    error: undefined,
    results: {
        columns: [],
        data: [],
    },
    status: "INITIALISING",
};

const updateQueryDetails = (status, columns, data) => ({
    type: UPDATE_QUERY_DETAILS,
    payload: {
        status,
        columns,
        data,
    },
});

const displayKepler = () => ({
    type: DISPLAY_KEPLER,
});

const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});

export default function DataLoader(props) {
    const {
        prestoUri,
        prestoUser,
        prestoPasswd,
    } = props;

    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        const contactPresto = async () => {
            let prestoClient = new PrestoClient(prestoUri, prestoUser, prestoPasswd);
            for await (let response of prestoClient.execute(EXAMPLE_QUERY)) {
                let {
                    columns,
                    data,
                    elapsedTime,
                    splitRatio,
                    state,
                } = response;

                // Columns and data maybe undefined if the query isn't yet running...
                dispatch(updateQueryDetails(`${state} (${splitRatio} splits in ${elapsedTime})`, columns ?? [], data ?? []));
            }

            dispatch(displayKepler());
        };

        // Execute the query...
        contactPresto()
            .catch((error) => {
                dispatch(setError(error));
            });
    }, [prestoUri, prestoUser, prestoPasswd]);

    const {
        displayResults,
        error,
        results,
        status,
    } = state;

    if (error) {
        return (
            <div className = {"centered column"}>
                <h1>{"Error"}</h1>
                <pre>{error.message ?? error}</pre>
            </div>
        );
    }

    if (displayResults) {
        return (
            <Kepler queryResults = {results} />
        );
    }

    return (
        <div className = {"centered column"}>
            <div className = {"app-loader"}>
                <div />
                <div />
            </div>
            <div>{status}</div>
        </div>
    );
}
