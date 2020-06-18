import {Dialog as BlueprintDialog} from "@blueprintjs/core";
import React from "react";
import {useDialog} from "./useDialog";

export function Dialog(props) {
    let {
        children: [triggerComponent, contentComponent],
        className,
        closable = true,
        forceOpen = false,
        openDialogEventName = "onClick",
        title,
    } = props;

    let {
        isOpen,
        openDialogHandler,
        closeDialogHandler,
    } = useDialog(forceOpen);

    // NOTE: This is important, as otherwise click events on the dialog can propagate to place they really don't need to go…
    const trapClickEventsHandler = (event) => {
        event.stopPropagation();
    };

    let clonedTriggerComponent = React.cloneElement(triggerComponent, {
        ...triggerComponent.props,
        [openDialogEventName]: openDialogHandler,
    });
    let clonedContentComponent = React.cloneElement(contentComponent, {
        ...contentComponent.props,
        closeDialogHandler,
    });

    return (
        <div
            onClick = {trapClickEventsHandler}
            style = {{display: "contents"}}
        >
            {clonedTriggerComponent}
            <BlueprintDialog
                canEscapeKeyClose = {closable}
                canOutsideClickClose = {closable}
                className = {className}
                isCloseButtonShown = {closable}
                isOpen = {isOpen}
                onClose = {closeDialogHandler}
                title = {title}
            >
                {clonedContentComponent}
            </BlueprintDialog>
        </div>
    );
}
