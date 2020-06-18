/*

Show the animated taxis on request.

 */

const Cesium = require('cesium/Cesium');
const AutoMap = require("auto-creating-map");

async function taxis(config, viewer) {
    let resource = await Cesium.IonResource.fromAssetId(config.taxiAsset);

    let entities = [];

    return rows => {
        entities.forEach(entity => viewer.entities.remove(entity));

        let trips = new AutoMap(() => []);

        for (let [tripId, ...row] of rows) {
            trips.get(tripId).push(row);
        }

        let positions = new Map();

        for (let [tripId, rows] of trips.entries()) {
            let url = resource;
            let height = 0;

            let position = new Cesium.SampledPositionProperty();

            for (let [timestamp, longitude, latitude] of rows) {
                position.addSample(
                    Cesium.JulianDate.fromDate(new Date(timestamp * 1e3)),
                    Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
                );
            }

            positions.set(tripId, position);

            const duration = 5;
            const orientation = new Cesium.VelocityOrientationProperty(position);

            entities.push(viewer.entities.add({
                name : tripId,
                position : position,
                orientation : orientation,
                model : {
                    uri : url,
                    scale: 1,
                },
                path: {
                    resolution: 1,
                    material: Cesium.Color.RED,
                    width: 1,
                    trailTime: duration,
                    leadTime: 0
                },
                viewFrom: new Cesium.Cartesian3(30, 0, 0),
            }));
        }


        let clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

        viewer.screenSpaceEventHandler.setInputAction(async function onLeftClick(movement) {
            let pickedFeature = viewer.scene.pick(movement.position);

            let tripId = pickedFeature && pickedFeature.id && pickedFeature.id.name;

            if (!trips.has(tripId)) {
                clickHandler(movement);
                return;
            }

            let [ , , , passengers, fareGroup] = trips.get(tripId)[0];

            let position = positions.get(tripId);

            let labelEntity = viewer.entities.add({
                position : position,
                label : {
                    text : `
    Passengers: ${passengers}
    Fare: ${fareGroup}
    `,
                    scaleByDistance : new Cesium.NearFarScalar(0, 1.0, 1000, 0),
                }
            });

            labelEntity.label.showBackground = true;
            labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 4, 0.0);

            entities.push(labelEntity);

            viewer.scene.requestRender();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Default handler will track objects, but not from a
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(() => {}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
}

module.exports = taxis;
