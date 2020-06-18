/*

Show a yellow square of size 100m in the centre of the view.

 */

const Cesium = require('cesium/Cesium');

function getMapCenter(viewer) {
    let windowPosition = new Cesium.Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
    let pickRay = viewer.scene.camera.getPickRay(windowPosition);
    let pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
    let pickPositionCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
    let longitude = pickPositionCartographic.longitude * (180/Math.PI);
    let latitude = pickPositionCartographic.latitude * (180/Math.PI);
    return {longitude, latitude};

}

function delay(action, timeMs) {
    let timeout = null;
    return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(action, timeMs);
    };
}

function highlightBox(viewer) {
    return viewer.entities.add({
        name : 'Hightlight box',
        position: Cesium.Cartesian3.fromDegrees(0.0, 0.0, 0),
        plane : {
            plane : new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
            dimensions : new Cesium.Cartesian2(100, 100),
            fill : true,
            outline : false,
            material : Cesium.Color.YELLOW.withAlpha(0.5),
        }
    });
}

function highlightedTrackingArea(viewer) {
    let  highlightedArea = highlightBox(viewer);

    function updateArea() {
        try {
            let {longitude, latitude} = getMapCenter(viewer);
            console.log(longitude, latitude);
            highlightedArea.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
            viewer.scene.requestRender();
        } catch (e) {
            console.error(e);
        }
    }

    viewer.camera.percentageChanged = 0.01;
    viewer.camera.changed.addEventListener(delay(updateArea, 300));

    return () => getMapCenter(viewer);
}

module.exports = highlightedTrackingArea;
