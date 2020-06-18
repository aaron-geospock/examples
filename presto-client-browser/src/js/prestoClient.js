import humanizeDuration from "humanize-duration";
import btoa from "btoa";

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default class PrestoClient {
    constructor(prestoURL, prestoUser, prestoPassword) {
        this.prestoURL = prestoURL;
        this.prestoUser = prestoUser;
        this.prestoPassword = prestoPassword;
        this.fetch = globalThis.fetch;

        // Wait for this many milliseconds while waiting for something to happen
        this.statusDelayMs = 5000;
    }

    setFetch(fetch) {
        this.fetch = fetch;
    }


    async prestoFetch(uri, options= {}) {
        let fetch = this.fetch;
        return await fetch(uri, {
            ...options,
            headers: {
                "Authorization": `Basic ${btoa(this.prestoUser + ":" + this.prestoPassword)}`,
                "X-Presto-User": this.prestoUser,
                ...options.headers,
            },
        });
    }

    // This function submits the SQL query to Presto.
    async submitQuery(sql) {
        return await this.prestoFetch(`${this.prestoURL}${this.prestoURL.endsWith("/") ? "": "/"}v1/statement`, {
            body: sql,
            headers: {
                "Content-Type": "application/sql",
            },
            method: "POST",
        });
    }


    async * execute(sql) {
        let response = await this.submitQuery(sql);

        let priorState = null;

        while (response) {
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

            if (error) {
                throw error;
            }

            // Make some of the info slightly more human friendly...
            const splitRatio = `${completedSplits} / ${totalSplits}`;
            const elapsedTime = humanizeDuration(elapsedTimeMillis);

            // Yield the current state of the query. Unless the state is RUNNING, some of these fields will be
            // undefined, or return 0 based values.
            yield {
                columns,
                data,
                elapsedTime,
                splitRatio,
                state,
            };

            if (state === priorState && !data) {
                await timeout(this.statusDelayMs);
            }

            priorState = state;

            response = nextUri && await this.prestoFetch(nextUri);

            while (response && response.status === 503) {
                await timeout(this.statusDelayMs);
                response = await this.prestoFetch(nextUri);
            }
        }
    }
}

// Query has been accepted and is awaiting execution.
PrestoClient.STATE_QUEUED = "QUEUED";

// Query is being planned.
PrestoClient.STATE_PLANNING = "PLANNING";

// Query execution is being started.
PrestoClient.STATE_STARTING = "STARTING";

// Query has at least one running task.
PrestoClient.STATE_RUNNING = "RUNNING";

// Query is blocked and is waiting for resources (buffer space, memory, splits, etc.).
PrestoClient.STATE_BLOCKED = "BLOCKED";

// Query is finishing (e.g. commit for autocommit queries).
PrestoClient.STATE_FINISHING = "FINISHING";

// Query has finished executing and all output has been consumed.
PrestoClient.STATE_FINISHED = "FINISHED";

// Query execution failed.
PrestoClient.STATE_FAILED = "FAILED";
