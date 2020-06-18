import React, {useState} from "react";
import {Dialog} from "./common/Dialog";
import {PrestoConfig} from "./common/PrestoConfig";
import DataLoader from "./DataLoader";

function App() {
    let [authDetails, setAuthDetails] = useState(() => {
        // Check to see if there the credentials exist in the browser session storage...
        let storedConfig = sessionStorage.getItem("auth");
        if (storedConfig) {
            // They do, so use them, which means that the dialog wont be displayed...
            return JSON.parse(atob(sessionStorage.getItem("auth")));
        }

        return undefined;
    });

    const onSubmitHandler = ({prestoUri, prestoUser, prestoPasswd}) => {
        // Store the auth details via the useState hook...
        let configToStore = {prestoUri, prestoUser, prestoPasswd};
        setAuthDetails(configToStore);

        // Also stick the config into the session storage area, so hitting F5 will pick it up and you wont have to
        // re-enter...
        sessionStorage.setItem("auth", btoa(JSON.stringify(configToStore)));
    };

    if (!authDetails) {
        return (
            <Dialog
                className = {"bp3-dark"}
                closable = {false}
                forceOpen = {true}
                title = {"GeoSpock DB SQL Access Config"}
            >
                <i style = {{display: "none"}} />
                <PrestoConfig
                    cancelable = {false}
                    onSubmit = {onSubmitHandler}
                />
            </Dialog>
        );
    }

    return (
        <DataLoader {...authDetails} />
    );
}

export default App;
