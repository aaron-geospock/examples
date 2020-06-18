import {
    Button,
    FormGroup,
    InputGroup,
    Intent,
} from "@blueprintjs/core";
import React, {useReducer} from "react";

const UPDATE_FIELD = "UPDATE_FIELD";
const TOGGLE_WORKING = "TOGGLE_WORKING";

const reducer = (state, {type, payload}) => {
    switch (type) {
        case UPDATE_FIELD:
            return {
                ...state,
                [payload.name]: payload.value,
            };

        case TOGGLE_WORKING:
            return {
                ...state,
                working: !state.working,
            };

        default:
            return state;
    }
};

const updateField = (name, value) => ({
    type: UPDATE_FIELD,
    payload: {
        name,
        value,
    },
});

const toggleWorking = () => ({
    type: TOGGLE_WORKING,
});

export function PrestoConfig(props) {
    const {
        cancelable = true,
        closeDialogHandler,
        onCancel,
        onSubmit,
        prestoUri: configPrestoUri,
        prestoUser: configPrestoUser,
        prestoPasswd: configPrestoPasswd,
    } = props;

    const [{
        internalPrestoUri,
        internalPrestoUser,
        internalPrestoPasswd,
        working,
    }, dispatch] = useReducer(reducer, {
        internalPrestoUri: configPrestoUri,
        internalPrestoUser: configPrestoUser,
        internalPrestoPasswd: configPrestoPasswd,
        working: false,
    });

    const onPrestoUriChange = (event) => {
        dispatch(updateField("internalPrestoUri", event.target.value));
    };

    const onPrestoUserChange = (event) => {
        dispatch(updateField("internalPrestoUser", event.target.value));
    };

    const onPrestoPasswdChange = (event) => {
        dispatch(updateField("internalPrestoPasswd", event.target.value));
    };

    const onSubmitClickHandler = () => {
        dispatch(toggleWorking());
        onSubmit({
            prestoUri: internalPrestoUri,
            prestoUser: internalPrestoUser,
            prestoPasswd: internalPrestoPasswd,
        });
        dispatch(toggleWorking());
        closeDialogHandler();
    };

    const onCancelClickHandler = () => {
        onCancel();
    };

    let invalid = !(internalPrestoUri && internalPrestoUser && internalPrestoPasswd);

    return (
        <>
            <div className = {"bp3-dialog-body"}>
                <FormGroup
                    label = {"GeoSpock DB SQL Access URI"}
                    labelFor = {"presto-uri"}
                    labelInfo = {"(required)"}
                >
                    <InputGroup
                        autoFocus = {true}
                        id = {"presto-uri"}
                        onChange = {onPrestoUriChange}
                        placeholder = {"https://sqlaccess.example.com:8446"}
                        required = {true}
                        value = {internalPrestoUri}
                    />
                </FormGroup>
                <FormGroup
                    label = {"Username"}
                    labelFor = {"presto-user"}
                    labelInfo = {"(required)"}
                >
                    <InputGroup
                        id = {"presto-user"}
                        onChange = {onPrestoUserChange}
                        placeholder = {"joe@example.com"}
                        required = {true}
                        value = {internalPrestoUser}
                    />
                </FormGroup>
                <FormGroup
                    label = {"Password"}
                    labelFor = {"presto-passwd"}
                    labelInfo = {"(required)"}
                >
                    <InputGroup
                        id = {"presto-passwd"}
                        onChange = {onPrestoPasswdChange}
                        placeholder = {"password"}
                        required = {true}
                        type = {"password"}
                        value = {internalPrestoPasswd}
                    />
                </FormGroup>
            </div>
            <div className = {"bp3-dialog-footer"}>
                <div className = {"bp3-dialog-footer-actions"}>
                    {cancelable &&
                        <Button
                            disabled = {working}
                            onClick = {onCancelClickHandler}
                            title = {"Cancel updating the Presto server details..."}
                            type = {"submit"}
                        >
                            {"Cancel"}
                        </Button>
                    }
                    <Button
                        disabled = {invalid}
                        intent = {Intent.PRIMARY}
                        loading = {working}
                        onClick = {onSubmitClickHandler}
                        title = {"Confirm the Presto server details..."}
                        type = {"submit"}
                    >
                        {"Submit"}
                    </Button>
                </div>
            </div>
        </>
    );
}
