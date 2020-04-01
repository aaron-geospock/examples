import humanizeDuration from "humanize-duration";
import Kepler from "./Kepler";
import React, {
    useEffect,
    useReducer,
} from "react";

// Internal state action names...
const APPEND_DATA = "APPEND_DATA";
const DISPLAY_KEPLER = "DISPLAY_KEPLER";
const SET_ERROR = "SET_ERROR";
const SET_STATUS = "SET_STATUS";

// Presto query status
const STATE_FINISHED = "FINISHED";
const STATE_INITIALISING = "INITIALISING";
const STATE_RUNNING = "RUNNING";

const reducer = (state, {type, payload}) => {
    switch (type) {
        case APPEND_DATA:
            return {
                ...state,
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

        case SET_STATUS:
            return {
                ...state,
                status: payload,
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
    status: STATE_INITIALISING,
};

const appendData = (columns, data) => ({
    type: APPEND_DATA,
    payload: {
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

const setStatus = (value) => ({
    type: SET_STATUS,
    payload: value,
});

const submitQuery = async (prestoUri, sql, prestoUser) =>
    await fetch(`${prestoUri}/v1/statement`, {
        body: sql,
        headers: {
            "Content-Type": "application/sql",
            "X-Presto-User": prestoUser,
        },
        method: "POST",
    });

const requestStatus = async (uri, prestoUser) =>
    await fetch(uri, {
        headers: {
            "X-Presto-User": prestoUser,
        },
        method: "GET",
    });

// While you can send API requests to Presto in a tight loop, you wont necessarily get any results back in the response.
// So we delay the next call slightly, to allow Presto to accumulate some results to send back. If you use the Network
// tab in your browser devtools console, you will most likely still see some requests being returned without any
// results, so you may want to adjust this value accordingly.
const STATUS_DELAY = 1500;
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DataLoader(props) {
    const {
        mapboxToken,
        prestoUri,
        prestoUser,
        sql,
    } = props;

    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        const contactPresto = async () => {
            // For more details on the Presto REST API - https://github.com/prestodb/presto/wiki/HTTP-Protocol

            let uri = undefined;
            do {
                // Send the query for execution...
                let [response] = await Promise.all([
                    uri ? requestStatus(uri, prestoUser) : submitQuery(prestoUri, sql, prestoUser),
                    timeout(STATUS_DELAY),
                ]);

                if (!response.ok) {
                    throw new Error(`Network response was not OK -> ${response.status}`);
                }

                // Destructure the response so we can process it appropriately...
                let {
                    columns,
                    data,
                    error,
                    nextUri,
                    stats: {
                        completedSplits,
                        elapsedTimeMillis,
                        state,
                        totalSplits,
                    } = {},
                } = await response.json();


                // The response has data, store it until the query finishes...
                if (data) {
                    dispatch(appendData(columns, Array.isArray(data[0]) ? data : [data]));
                }

                // nextUri will be undefined when the query has terminated...
                uri = nextUri;

                if (nextUri) {
                    // Update the current state of the query...
                    let status = state;
                    if (state === STATE_RUNNING) {
                        status = `${state} (${completedSplits} of ${totalSplits} splits in ${humanizeDuration(elapsedTimeMillis)})`;
                    }
                    dispatch(setStatus(status));
                }
                else if (state === STATE_FINISHED) {
                    // We have all the results, display then with Kepler...
                    dispatch(displayKepler());
                }
                else if (error) {
                    // Something went wrong...
                    dispatch(setError(error));
                }
            }
            while (uri);
        };

        // Execute the query...
        contactPresto()
            .catch((error) => {
                dispatch(setError(error));
            });
    }, [sql]);

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
            <Kepler
                mapboxToken = {mapboxToken}
                queryResults = {results}
            />
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
