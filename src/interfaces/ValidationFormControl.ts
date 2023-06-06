import React from "react";

interface ValidationFormControl {
    testId: string,
        validationMessage: string,
        validationTrueMessage : string,
        placeholder: string,
        type: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        validation: boolean,
        label: string,
}

export default ValidationFormControl;
