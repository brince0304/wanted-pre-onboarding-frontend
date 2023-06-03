import ValidationFormControl from "../interfaces/ValidationFormControl";
import React, {useCallback, useState} from "react";


export function useFormControl(options: {
    regex: RegExp
}): [((e: React.ChangeEvent<HTMLInputElement>) => void), string, boolean, ((value: (((prevState: boolean) => boolean) | boolean)) => void)] {
    const {
        regex,
    } = options || {};
    const [validation, setValidation] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    const validationFunction = useCallback((value: string) => {
           if (regex.test(value)) {
                setValidation(true)
            } else {
                setValidation(false)
            }
    }, [regex])

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        validationFunction(e.target.value)
    }, [validationFunction])


    return [onChange,value,validation,setValidation]
}
