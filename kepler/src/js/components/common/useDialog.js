import {useState} from "react";

export const useDialog = (forceOpen = false) => {
    let [isOpen, setIsOpen] = useState(forceOpen);

    const openDialogHandler = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setIsOpen(true);
    };

    const closeDialogHandler = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setIsOpen(false);
    };

    return {
        isOpen,
        openDialogHandler,
        closeDialogHandler,
    };
};
