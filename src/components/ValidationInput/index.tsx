import {Box, styled, TextField, Tooltip} from "@mui/material";
import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ValidationInputProps {
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

const StyledBox = styled(Box)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
 
`;

const StyledTextBox = styled(TextField)`
    width: 100%;
      height: 100%;
  `;

const StyledIcon = styled(CheckCircleIcon)`
    position: absolute;
    right: 0;
    color: ${(props: {validation: boolean,length : number}) => props.length === 0 ? "lightgray" : props.validation ? "green" : "red"};
    bottom: 7px;
  
`;

const validationInput = (props: ValidationInputProps) => {
    const {
        testId,
        validationMessage,
        validationTrueMessage,
        placeholder,
        type,
        value,
        onChange,
        validation,
        label
    } = props;
    return (
        <StyledBox id={"validation-form"}>
            <StyledTextBox
                error={value.length > 0 && !validation}
                data-testid={testId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                variant={"standard"}
                label={label}
                color={value.length > 0 ? (validation ? "success" : "error") : "primary"}
            />
            <Tooltip title={
                value.length === 0 ? "" : validation ? validationTrueMessage : validationMessage
            } arrow placement={"top"}>
            <StyledIcon validation={validation} length={value.length}/>
            </Tooltip>
        </StyledBox>
    );
};

export default validationInput;
