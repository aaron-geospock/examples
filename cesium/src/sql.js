/*

Compute an initial SQL statement, display an editing dialog to the user and run the query.

 */

const {default: PrestoClient} = require('presto-client-browser');

function getSQL(longitude, latitude, time, timeRange) {
    let startTime = new Date(time.getTime() - 60000);
    let endTime = new Date(time.getTime() + 60000);


    return `
select 
    trip_id, 
    to_unixtime(timestamp), 
    longitude, 
    latitude, 
    passengers, 
    fare_group 
from 
    geospock.default.synthesisedtaxidatanyc
where 
    timestamp between from_iso8601_timestamp('${timeRange.start.toISOString()}') 
                  and from_iso8601_timestamp('${timeRange.end.toISOString()}')
    and trip_id in (
        select 
            distinct trip_id
        from 
            geospock.default.synthesisedtaxidatanyc
        where 
            timestamp between from_iso8601_timestamp('${startTime.toISOString()}')
                          and from_iso8601_timestamp('${endTime.toISOString()}')
            and longitude between ${longitude - 0.0005} 
                              and ${longitude + 0.0005}
            and latitude between ${latitude - 0.0005} 
                             and ${latitude + 0.0005}
            
    )        
order by 
    timestamp`
}

async function query(username, password, query, url, reportProgress) {
    let prestoClient = new PrestoClient(url, username, password);
    let blocks = [];
    let resultColumns = [];
    reportProgress("Starting");
    for await (let {state, data, columns, splitRatio} of prestoClient.execute(query)) {
        reportProgress(splitRatio);

        if (data) {
            blocks.push(data);
        }
        resultColumns = columns;
    }
    let rows = [].concat(...blocks);
    console.log("Columns:", resultColumns.map(({name}) => name).join(", "));
    console.log("Rows:", rows.length);
    return rows;
}


async function runQuery(config, {username, password}, sql, showTaxis, reportProgress) {
    showTaxis(await query(username, password, sql, config.prestoURL, reportProgress));
}

module.exports = (config, auth, getHighlightedArea, showTaxis, getTime, getTimeRange) => {
    let sqlPanel = document.querySelector("#sql");
    let progressPanel = document.querySelector("#progress");
    let statusElement = document.querySelector("#progress .status");
    let sqlTextArea = document.querySelector("#sql textarea");

    document.querySelector(".show-sql").onclick = () => {
        let {longitude, latitude} = getHighlightedArea();
        let time = getTime();
        let timeRange = getTimeRange();
        sqlTextArea.value = getSQL(longitude, latitude, time, timeRange);
        sqlPanel.style.display = "grid";
    };

    document.querySelector("#sql .cancel").onclick = event => {
        sqlPanel.style.display = "none";
        event.preventDefault();
    };

    document.querySelector("#sql .load").onclick = event => {
        sqlPanel.style.display = "none";
        progressPanel.style.display = "grid";
        event.preventDefault();
        runQuery(config, auth, sqlTextArea.value, showTaxis, progress => statusElement.textContent = progress)
            .catch(e => {
                console.error(e);
                alert(e.message);
            })
            .then(() => {
                progressPanel.style.display = "none";
            });
    };
};
