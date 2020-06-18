/*

Initialise and restrict the Cesium camera.
Initialised to look at a road junction in NYC.
Restricted to have no roll and not look up.

 */

const Cesium = require('cesium/Cesium');

function cameraController(viewer) {
    viewer.scene.preRender.addEventListener(function(scene, time) {
        let camera = viewer.scene.camera;
        camera.setView({
            orientation: {
                heading: camera.heading,
                pitch: Math.min(0, camera.pitch),
                roll: 0
            }
        });
    });

    let initialPosition = new Cesium.Cartesian3(1333336.60, -4653991.20, 4138597.99);
    let initialOrientation = new Cesium.HeadingPitchRoll(3.216, -0.293, 0);


    function setInitialPosition() {
        viewer.scene.camera.setView({
            destination: initialPosition,
            orientation: initialOrientation,
            endTransform: Cesium.Matrix4.IDENTITY
        });
    }
    setInitialPosition();

    viewer.homeButton.viewModel._command = Cesium.createCommand(setInitialPosition, true);
}

module.exports = cameraController;

