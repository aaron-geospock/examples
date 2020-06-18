import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import App from "./components/App";
import {configureStore} from "./state/store";

// These are imported here so that Webpack knows to process all the CSS, which is then extracted into a separate file by
// a plugin. If you're not going to use Webpack, you may want to move these elsewhere.
import "@blueprintjs/core/lib/css/blueprint.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "../css/integration-kepler.css";

// Configure the Redux state tree...
const store = configureStore();

ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    document.getElementById("application")
);
