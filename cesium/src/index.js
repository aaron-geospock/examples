/*

Entry point of web application

 */

const Cesium = require('cesium/Cesium');
require('./css/main.css');
require('cesium/Widgets/widgets.css');

const cameraController = require("./cameraController");
const buildingPicker = require("./buildingPicker");
const taxis = require("./taxis");
const city = require("./city");
const timeline = require("./timeline");
const getAuth = require("./auth");
const sql = require("./sql");
const highlightTrackingArea = require("./highlightTrackingArea");

let config;
try {
    config = require("./config.js");
} catch (e) {
    alert("Ensure config.js is created correctly");
    throw new Error("Ensure config.js is created correctly");
}

Cesium.Ion.defaultAccessToken = config.cesiumIonToken;

let viewer = new Cesium.Viewer('cesiumContainer', {
    requestRenderMode : true,
});


window.addEventListener("load", () => {
    cameraController(viewer);

    buildingPicker(viewer);

    let {getTime, getTimeRange} = timeline(viewer);

    city(config, viewer);

    let getHighlightedArea = highlightTrackingArea(viewer);


    (async () => {
        let auth = await getAuth();
        document.querySelector("#cesiumContainer").style.display = "block";
        let showTaxis = await taxis(config, viewer);
        sql(config, auth, getHighlightedArea, showTaxis, getTime, getTimeRange);
    })().catch(console.error);
});

// Support use of console to explore Cesium:
window.viewer = viewer;
window.Cesium = Cesium;
