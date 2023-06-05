import Box from "@mui/material/Box";
import React, {FormEvent, useCallback, useContext, useEffect} from "react";
import {Button, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import {useFormControl} from "../../hooks/useFormControl";
import ValidationInput from "../../components/ValidationInput";
import styled from "@emotion/styled";
import {postSignin} from "../../apis";
import { setToken, useTokenDispatch} from "../../context";

const StyledFormControl = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const StyledInputBox = styled(Box)`
  width: 100%;
  height: 100%;
`;

const StyledSignInButton = styled(Button)`
  width: 100%;
  height: 100%;
`;

const SignIn = () => {
    const dispatch = useTokenDispatch();
    const navigate = useNavigate();
    const emailRegex = /@/;
    const passwordRegex = /.{8,}/;
    const [onChangeEmail, email,setEmail, emailValidation, setEmailValidation] = useFormControl({regex: emailRegex});
    const [onChangePassword, password,setPassword, passwordValidation, setPasswordValidation] = useFormControl({regex: passwordRegex});
    const [emailValidationMessage, setEmailValidationMessage] = React.useState<string>("이메일 형식이 아닙니다.");
    const [passwordValidationMessage, setPasswordValidationMessage] = React.useState<string>("비밀번호는 8자리 이상이어야 합니다.");

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
    };

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
    };

    const handleEmailValidationFalse = () => {
        setEmailValidation(false);
        setEmailValidationMessage("해당 사용자가 존재하지 않습니다.");
    }

    const handlePasswordValidationFalse = () => {
        setPasswordValidation(false);
        setPasswordValidationMessage("비밀번호가 일치하지 않습니다.");
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (emailValidation && passwordValidation) {
            postSignin({email, password}).then((res) => {
                if (res) {
                    setToken(dispatch, res.access_token);
                    navigate("/todo");
                }
            }).catch((err) => {
                    if (err.response.status === 404) {
                        handleEmailValidationFalse();
                    } else if (err.response.status === 401) {
                        handlePasswordValidationFalse();
                    }
                }
            );
        }
    };

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
    );
};

export default SignIn;
