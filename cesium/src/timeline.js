/*

Set the start, end, initial point and timezone of the timeline.

 */


const Cesium = require('cesium/Cesium');

module.exports = function timeline(viewer) {

    let start = Cesium.JulianDate.fromDate(new Date("2015-01-01T05:00:00Z"));
    let initial = Cesium.JulianDate.fromDate(new Date("2015-01-01T17:00:00Z"));
    let stop = Cesium.JulianDate.fromDate(new Date("2015-01-02T05:00:00Z"));

    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = initial.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    viewer.clock.multiplier = 1;
    viewer.timeline.zoomTo(start, stop);
    viewer.clock.shouldAnimate = false;

    function getTime() {
        return Cesium.JulianDate.toDate(viewer.clock.currentTime);
    }

    function getTimeRange() {
        return {
            start: Cesium.JulianDate.toDate(viewer.clock.startTime),
            end: Cesium.JulianDate.toDate(viewer.clock.stopTime),
        }
    }

    let timeZone = "America/New_York";

    let timeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short"
    });
    viewer.animation.viewModel.timeFormatter = date => timeFormat.format(Cesium.JulianDate.toDate(date));

    let dateFormat = new Intl.DateTimeFormat('en-US', {
        timeZone,
        dateStyle: "medium"
    });
    viewer.animation.viewModel.dateFormatter = date => dateFormat.format(Cesium.JulianDate.toDate(date));

    let dateTimeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short"

    });
    viewer.timeline.makeLabel = date => dateTimeFormat.format(Cesium.JulianDate.toDate(date));

    return {getTime, getTimeRange};
};
