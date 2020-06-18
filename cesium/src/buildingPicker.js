/*

Attach listeners to click events which will highlight selected buildings and provide information about them.
Uses buildings.json as extra information about building names in addition to those in the tile set.

Buildings in the tileset are assumed to have these properties (all of which are optional):

building_identification_number - an NYC building identifier (see https://nycplanning.github.io/Geosupport-UPG/chapters/chapterVI/section03/)
gml:name - Name of building
doitt_id - Department of Information Technology & Telecommunications identifier
PLUTO_lot_address - Address from Property Land Use Tax lot Output dataset

 */

const Cesium = require('cesium/Cesium');
const buildingNames = require("./buildings.json");

function buildingPicker(viewer) {

    let selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };

    // An entity object which will hold info about the currently selected feature for infobox display
    let selectedEntity = new Cesium.Entity();

    let highlighted = {
        feature : undefined,
        originalColor : new Cesium.Color()
    };

    let clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewer.screenSpaceEventHandler.setInputAction(async function onLeftClick(movement) {
        // If a feature was previously selected, undo the highlight
        if (Cesium.defined(selected.feature)) {
            selected.feature.color = selected.originalColor;
            selected.feature = undefined;
        }
        // Pick a new feature
        let pickedFeature = viewer.scene.pick(movement.position);
        if (!pickedFeature || !pickedFeature.getProperty || !pickedFeature.getProperty('building_identification_number')) {
            clickHandler(movement);
            return;
        }

        viewer.scene.requestRender();

        console.log(pickedFeature);

        // Select the feature if it's not already selected
        if (selected.feature === pickedFeature) {
            return;
        }
        selected.feature = pickedFeature;
        // Save the selected feature's original color
        if (pickedFeature === highlighted.feature) {
            Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
            highlighted.feature = undefined;
        } else {
            Cesium.Color.clone(pickedFeature.color, selected.originalColor);
        }
        // Highlight newly selected feature
        pickedFeature.color = Cesium.Color.fromCssColorString('#FFF9D9');
        // Set feature infobox description

        let name = pickedFeature.getProperty('gml:name') || '';
        let buildingIdentificationNumber = pickedFeature.getProperty('building_identification_number') || '';
        let doittId = pickedFeature.getProperty('doitt_id') || '';
        let address = pickedFeature.getProperty('PLUTO_lot_address') || '';
        let alternativeName = buildingNames
            .filter(([id]) => id === buildingIdentificationNumber)
            .map(([, name]) => name)
            .pop();

        if (buildingIdentificationNumber) {
            selectedEntity.name = name || alternativeName || address || buildingIdentificationNumber;
            selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
            viewer.selectedEntity = selectedEntity;
            selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
                '<tr><th>BIN</th><td>' + buildingIdentificationNumber + '</td></tr>' +
                '<tr><th>DOITT ID</th><td>' + doittId + '</td></tr>' +
                '<tr><th>Address</th><td>' + address + '</td></tr>' +
                '<tr><th>Longitude</th><td>' + pickedFeature.getProperty('Longitude').toFixed(5) + '</td></tr>' +
                '<tr><th>Latitude</th><td>' + pickedFeature.getProperty('Latitude').toFixed(5) + '</td></tr>' +
                '<tr><th>Height</th><td>' + pickedFeature.getProperty('Height').toFixed(0) + '</td></tr>' +
                '</tbody></table>';
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

module.exports = buildingPicker;
