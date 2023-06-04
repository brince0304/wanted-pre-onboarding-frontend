import Box from "@mui/material/Box";
import React, {FormEvent, useCallback} from "react";
import {Button, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import {useFormControl} from "../../hooks/useFormControl";
import ValidationInput from "../../components/ValidationInput";
import styled from "@emotion/styled";
import {postSignin, postSignup} from "../../apis";
import {saveAccessToken} from "../../apis/utils/auth";

const StyledFormControl = styled.form`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width : 100%;
     gap : 20px;
`

const StyledInputBox = styled(Box)`
    width: 100%;
    height: 100%;
    `;

const StyledSignInButton = styled(Button)`
    width: 100%;
    height: 100%;
    `;

const SignIn = () => {
    const navigate = useNavigate();
    const emailRegex = /@/;
    const passwordRegex = /.{8,}/;
    const [onChangeEmail,email,emailValidation,setEmailValidation] = useFormControl({regex:emailRegex})
    const [onChangePassword,password,passwordValidation,setPasswordValidation] = useFormControl({regex:passwordRegex})
    const [emailValidationMessage, setEmailValidationMessage] = React.useState<string>("이메일 형식이 아닙니다.")
    const [passwordValidationMessage, setPasswordValidationMessage] = React.useState<string>("비밀번호는 8자리 이상이어야 합니다.")
    const emailInputProps = {
        testId: "email-input",
        validationMessage: emailValidationMessage,
        validationTrueMessage: "이메일 형식이 올바릅니다.",
        placeholder: "이메일을 입력해주세요.",
        type: "email",
        value: email,
        onChange: onChangeEmail,
        validation: emailValidation,
        label: "이메일"
    }

    const passwordInputProps = {
        testId: "password-input",
        validationMessage: passwordValidationMessage,
        validationTrueMessage: "정상적인 비밀번호 입니다.",
        placeholder: "비밀번호를 입력해주세요.",
        type: "password",
        value: password,
        onChange: onChangePassword,
        validation: passwordValidation,
        label: "비밀번호"
    }

    const handleEmailValidationFalse = useCallback(() => {
        setEmailValidation(false);
        setEmailValidationMessage("아이디나 비밀번호가 틀립니다.");
    },[setEmailValidation,setEmailValidationMessage])

    const handlePasswordValidationFalse = useCallback(() => {
        setPasswordValidation(false)
        setPasswordValidationMessage("아이디나 비밀번호가 틀립니다.");
    },[setEmailValidation,setEmailValidationMessage])

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (emailValidation && passwordValidation) {
                postSignin({email,password}).then((res)=>{
                        if(res){
                            saveAccessToken(res.access_token)
                            navigate("/todo");
                        }else{
                            handleEmailValidationFalse();
                            handlePasswordValidationFalse();
                            const inputRef = document.getElementById("validation-input")
                            const emailInput = inputRef?.dataset.testid === "email-input" ? inputRef : null;
                            if (emailInput){
                                emailInput.focus();
                            }
                        }
                    }
                )
        }
    }

    return (
        <StyledFormControl onSubmit={onSubmit}>
            로그인
            <StyledInputBox>
                <ValidationInput {...emailInputProps}/>
            </StyledInputBox>
            <StyledInputBox>
                <ValidationInput {...passwordInputProps}/>
            </StyledInputBox>
            <StyledSignInButton type={"submit"} disabled={!emailValidation || !passwordValidation}
                                variant={"contained"}
                                data-testid={"signin-button"}>
                로그인
            </StyledSignInButton>
        </StyledFormControl>
    )
}

export default SignIn;