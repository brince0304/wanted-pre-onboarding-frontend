import React, {useState} from "react";

export function useFormControl(options: {
    regex: RegExp;
    initialValue?: string;
}): [React.ChangeEventHandler<HTMLInputElement>, string,React.Dispatch<React.SetStateAction<string>>, boolean, React.Dispatch<React.SetStateAction<boolean>>,] {
    const { regex } = options || {};
    const [value, setValue] = useState(options.initialValue || "");
    const [validation, setValidation] = useState(false);

    const validateValue = (value: string) => {
        const isValid = regex.test(value);
        setValidation(isValid);
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;
        setValue(value);
        validateValue(value);
    };

    return [handleChange, value,setValue, validation, setValidation ,];
}
