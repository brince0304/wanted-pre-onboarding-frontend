import {Box, styled, TextField, Tooltip} from "@mui/material";
import React, {useEffect} from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ValidationFormControl from "../../interfaces/ValidationFormControl";



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
    bottom: 7px;
  
`;

const ValidationInput =  (props: ValidationFormControl) => {
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
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                variant={"standard"}
                label={label}
                color={value.length > 0 ? (validation ? "success" : "error") : "primary"}
                inputProps={{'data-testid': testId}}
                id={"validation-input"}
            />
            <Tooltip title={
                value.length === 0 ? "" : validation ? validationTrueMessage : validationMessage
            } arrow placement={"top"}>
            <StyledIcon color={value.length>0 ? (validation? "success":"error"):"disabled"} id={"id-"+testId+"-validate"}/>
            </Tooltip>
        </StyledBox>
    );
};

export default ValidationInput;
