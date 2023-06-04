import React, { useState} from "react";


export function useFormControl(options: {
    regex: RegExp
}): [((e: React.ChangeEvent<HTMLInputElement>) => void), string, boolean, ((value: (((prevState: boolean) => boolean) | boolean)) => void)] {
    const {
        regex,
    } = options || {};
    const [validation, setValidation] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    const validationFunction =(value: string) => {
           if (regex.test(value)) {
                setValidation(true)
            } else {
                setValidation(false)
            }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValue(value)
        validationFunction(value)
    }


    return [onChange,value,validation,setValidation]
}
