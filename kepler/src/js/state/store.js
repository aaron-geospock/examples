import {enhanceReduxMiddleware} from "kepler.gl/middleware";
import keplerGlReducer, {uiStateUpdaters} from "kepler.gl/reducers";
import {createBrowserHistory as createHistory} from "history";
import {routerMiddleware} from "react-router-redux";
import {
    combineReducers,
    createStore,
    applyMiddleware,
    compose,
} from "redux";
import thunk from "redux-thunk";

const composeMiddleware = () => {
    const history = createHistory();
    const middlewares = enhanceReduxMiddleware([thunk.withExtraArgument(history), routerMiddleware(history)]);
    const enhancers = [applyMiddleware(...middlewares)];

    let composeEnhancers = compose;

    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            actionsBlacklist: [
                "@@kepler.gl/MOUSE_MOVE",
                "@@kepler.gl/UPDATE_MAP",
                "@@kepler.gl/LAYER_HOVER"
            ]
        });

    }

    return composeEnhancers(...enhancers);
};

export function configureStore() {
    console.info("%c                    ", `line-height:43px;font-size:43px;background:no-repeat url('data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0"?>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" xml:space="preserve">
    <path fill="#000000" d="M51.5,22.7c0-6.4,3.9-10.5,10.9-10.5c3.2,0,6.2,0.9,7.9,1.8v5.2h-3.6V16c-1.2-0.4-2.7-0.7-4.2-0.7 c-4.6,0-7.2,2.8-7.2,7.3c0,4.8,3,7.1,7.2,7.1c1.4,0,2.8-0.3,4.1-0.7v-4.2h-4.2v-3h9.4v3h-1.6V31c-1.5,0.9-4.3,1.9-7.9,1.9 C55.8,33,51.5,29.3,51.5,22.7"/>
    <path fill="#000000" d="M77.4,24h6.3c-0.1-1.7-0.8-3.4-3-3.4C78.6,20.7,77.6,22.3,77.4,24 M73.7,25.5c0-4.3,2.5-7.5,7-7.5 c4.5,0,6.5,3.2,6.5,7.1c0,0.5,0,1.1-0.1,1.6h-9.6c0.4,2.2,1.7,3.5,4.3,3.5c1.9,0,3.5-0.7,4.6-1.3v2.9c-1.1,0.6-2.8,1.3-5.1,1.3 C76.1,32.9,73.7,29.8,73.7,25.5"/>
    <path fill="#000000" d="M100.1,25.5c0-2.6-1.1-4.7-3.7-4.7c-2.5,0-3.7,2.1-3.7,4.7c0,2.6,1.1,4.7,3.7,4.7 C99,30.1,100.1,28.1,100.1,25.5 M88.9,25.5c0-4.4,2.7-7.5,7.5-7.5c4.8,0,7.5,3.1,7.5,7.5c0,4.4-2.7,7.5-7.5,7.5 C91.6,32.9,88.9,29.9,88.9,25.5"/>
    <path fill="#000000" d="M106.6,32v-4.1h1.1v3.3c1.5,0.5,3.6,0.8,5.3,0.8c3.9,0,5.8-1.6,5.8-4c0-6.1-11.8-3.9-11.8-10.8 c0-2.7,1.8-5,6.6-5c1.9,0,4,0.4,5.6,0.9v4.1H118v-3.3c-1.2-0.3-2.8-0.6-4.4-0.6c-4.2,0-5.5,1.9-5.5,3.9c0,5.8,11.8,3.7,11.8,10.8 c0,3.3-2.5,5.1-6.9,5.1C110.9,33,108.4,32.6,106.6,32"/>
    <path fill="#000000" d="M125.7,22.1v7.5c1.1,1.2,2.6,2.3,4.8,2.3c3.4,0,5.1-2.8,5.1-6.3c0-3.2-1.5-6.2-4.9-6.2 C128.4,19.4,126.9,20.8,125.7,22.1 M121.8,38.1h2.8V19.7h-2.8v-1h3.9v2.2c1.2-1.4,2.9-2.6,5.2-2.6c3.9,0,5.9,3.5,5.9,7.2 c0,3.9-2.1,7.3-6.2,7.3c-2.2,0-3.8-1-4.9-2.2v7.4h3.2v1h-7.1V38.1z"/>
    <path fill="#000000" d="M151.6,25.7c0-3.9-2.2-6.3-5.4-6.3c-3.3,0-5.4,2.3-5.4,6.3c0,3.9,2.2,6.3,5.4,6.3 C149.4,31.9,151.6,29.6,151.6,25.7 M139.6,25.7c0-4.6,2.9-7.3,6.6-7.3c3.7,0,6.6,2.6,6.6,7.3c0,4.7-2.9,7.3-6.6,7.3 S139.6,30.3,139.6,25.7"/>
    <path fill="#000000" d="M155.6,25.7c0-4.4,2.7-7.3,7-7.3c1.7,0,3.5,0.5,4.6,1V23h-1.1v-3c-0.8-0.3-2.3-0.6-3.6-0.6 c-3.9,0-5.8,2.7-5.8,6.2c0,3.9,2.3,6.3,5.8,6.3c1.7,0,3.4-0.6,4.8-1.5v1.1c-1.3,0.8-2.8,1.4-4.8,1.4 C158.3,32.9,155.6,30,155.6,25.7"/>
    <path fill="#000000" d="M178.5,30.3l-4-4.6v-0.1l5.8-5.9h-2.8v-1h6.4v1h-2.2l-5.7,5.9l3.5,4.1c0.9,1.1,2.1,2.2,3.5,2.2 c0.2,0,0.5,0,0.9-0.2v1.1c-0.4,0.1-0.7,0.2-1.1,0.2C181.1,32.9,179.8,31.7,178.5,30.3 M169,31.6h2.8V10.3H169v-1h3.9v22.3h2.8v1 H169V31.6z"/>
    <path fill="#000000" d="M21.5,0C9.6,0,0,9.6,0,21.5c0,11.8,9.6,21.5,21.5,21.5c11.8,0,21.5-9.6,21.5-21.5C42.9,9.6,33.3,0,21.5,0 z M21.5,38.4c-10.3,0-17-8.7-17-17s6.7-17,17-17c10.8,0,14.7,8.5,14.7,8.5h-2.7c0,0-4.1-7-11.7-7C10.1,6,7.3,17.4,7.3,21.5 c0,4.1,3.3,15.4,14.7,15.4c9.3,0,13.2-8,13.6-10.2c0.6-3-1.2-4.1-3.8-3.9c-4.3,0.3-9.5,3.4-13,3.6c-0.5,0-2.2-0.3-2.2-1.6 c0-1.9,4.5-4.6,4.5-4.6s-4,3.1-2.7,4c2,1.3,10.5-4.7,16.3-4.7c0.5,0,2.6,0.2,3.3,2.2s-0.1,5.1-1.1,7.1 C36.1,30.6,31.9,38.4,21.5,38.4z"/>
    </svg>`)}');`);

    // Customise the initial state of the Kepler UI, mostly to not show the "Add Data" dialog...
    const customizedKeplerGlReducer = keplerGlReducer
        .initialState({
            uiState: {
                currentModal: null,
                mapControls: {
                    ...uiStateUpdaters.DEFAULT_MAP_CONTROLS,
                    splitMap: {
                        show: false
                    }
                },
            },
            visState: {
                layerBlending: "additive",
            }
        });

    // Add all the reducers to the store and the configured middleware...
    return createStore(
        combineReducers({
            keplerGl: customizedKeplerGlReducer,
        }),
        {},
        composeMiddleware()
    );
}
