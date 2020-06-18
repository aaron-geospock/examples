/*

Automatically adjust rendering quality depending on framerate.

If the frame rate falls too low (below 1/√2 of requested target) then:
- first decrease the number of buildings shown to a minimum
- then decrease the rendering resolution
If the frame rate rises (above √2 of requested target) then:
- first increase the resolution
- then increase the number of buildings shown

The number of buildings shown in controlled by the maximum screen space error
which selects which buildings are too small to be rendered.
The resolution is in CSS pixels.

The keyboard shortcuts, shift+arrow keys - see below, change the quality settings.

 */

const bestResolutionScale = window.devicePixelRatio;
const worstResolutionScale = 1 / 8;
const initialResolutionScale = 1;
const initialScreenSpaceError = 128;
const worstScreenSpaceError = 128;
const bestScreenSpaceError = 1;

function resolutionController(viewer, targetFrameRate, tileset) {
    let priorFrame;
    let idleTimer;
    let slowFrameCount = 0;
    let fastFrameCount = 0;
    let autoResolution = true;
    viewer.scene.preRender.addEventListener(function() {
        if (idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
        }

        let thisFrame = Date.now();
        let fps = 1000 / (thisFrame - priorFrame);
        if (autoResolution) {
            if (fps < targetFrameRate / (2 ** 0.5)) {
                slowFrameCount ++;
                if (slowFrameCount >= 2) {
                    reduceQuality(true);
                    slowFrameCount = 0;
                }
            } else {
                slowFrameCount = 0;
            }
            if (fps > targetFrameRate * (2 ** 0.5)) {
                fastFrameCount++;
                if (fastFrameCount >= 5) {
                    increaseQuality(true);

                    fastFrameCount = 0;
                }
            } else {
                fastFrameCount = 0;
            }
        }
        priorFrame = thisFrame;
    });


    viewer.scene.postRender.addEventListener(function(scene, time) {
        idleTimer = setTimeout(idle, 1000);
    });

    function idle() {
        priorFrame = undefined;
        slowFrameCount = 0;
    }

    autoQuality();

    function setQuality(resolutionScale, maximumScreenSpaceError, auto, message) {
        viewer.resolutionScale = Math.max(
            worstResolutionScale,
            Math.min(bestResolutionScale, resolutionScale)
        );
        tileset.maximumScreenSpaceError = Math.min(
            worstScreenSpaceError,
            Math.max(bestScreenSpaceError, maximumScreenSpaceError)
        );
        autoResolution = auto;
        console.log(message, viewer.resolutionScale, tileset.maximumScreenSpaceError);
        viewer.scene.requestRender();
    }

    function increaseQuality(auto) {
        if (viewer.resolutionScale < bestResolutionScale) {
            setQuality(viewer.resolutionScale * (2**0.25), tileset.maximumScreenSpaceError, auto, "Increase quality");
        } else if (tileset.maximumScreenSpaceError > bestScreenSpaceError) {
            setQuality(viewer.resolutionScale, tileset.maximumScreenSpaceError  / (2**0.25), auto, "Increase quality");
        }
    }

    function reduceQuality(auto) {
        if (tileset.maximumScreenSpaceError < worstScreenSpaceError) {
            setQuality(viewer.resolutionScale, tileset.maximumScreenSpaceError * (2**0.25), auto, "Reduce quality");
        } else if (viewer.resolutionScale > worstResolutionScale) {
            setQuality(viewer.resolutionScale / (2**0.25), tileset.maximumScreenSpaceError, auto, "Reduce quality");
        }
    }

    function bestQuality() {
        setQuality(bestResolutionScale, bestScreenSpaceError, false, "Best quality");
        autoResolution = false;
        console.log("Best quality", viewer.resolutionScale, tileset.maximumScreenSpaceError);
    }

    function autoQuality() {
        setQuality(initialResolutionScale, initialScreenSpaceError, false, "Automatic quality");
        autoResolution = true;
        console.log("Automatic quality", viewer.resolutionScale, tileset.maximumScreenSpaceError);
    }


    window.addEventListener("keydown" , event => {
        if (event.key == "ArrowUp" && event.shiftKey) {
            increaseQuality(false);
        }
        if (event.key == "ArrowDown" && event.shiftKey) {
            reduceQuality(false);
        }
        if (event.key == "ArrowLeft" && event.shiftKey) {
            autoQuality();
        }
        if (event.key == "ArrowRight" && event.shiftKey) {
            bestQuality();
        }
    });

    viewer.scene.debugShowFramesPerSecond = true;
}

module.exports = resolutionController;
