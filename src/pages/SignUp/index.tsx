import {Box, Button, Typography} from "@mui/material";
import ValidationInput from "../../components/ValidationInput";
import React, {FormEvent, useCallback, useEffect} from "react";
import {useFormControl} from "../../hooks/useFormControl";
import {useNavigate} from "react-router";
import {postSignup} from "../../apis";
import styled from "@emotion/styled";
import {isAuthorized} from "../../apis/utils/auth";

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

const StyledSignupButton = styled(Button)`
  width: 100%;
  height: 100%;
`;

const SignUp = () => {
    const navigate = useNavigate();
    const emailRegex = /@/;
    const passwordRegex = /.{8,}/;
    const [onChangeEmail, email, emailValidation, setEmailValidation] = useFormControl({regex: emailRegex});
    const [onChangePassword, password, passwordValidation] = useFormControl({regex: passwordRegex});
    const [emailValidationMessage, setEmailValidationMessage] = React.useState<string>("이메일 형식이 아닙니다.");
    const [passwordValidationMessage, setPasswordValidationMessage] = React.useState<string>("비밀번호는 8자리 이상이어야 합니다.");

    const isAuth = isAuthorized();
    useEffect(() => {
        if (isAuth) {
            navigate("/todo");
        }
    });

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
        validationTrueMessage: "사용 가능한 비밀번호입니다.",
        placeholder: "비밀번호를 입력해주세요.",
        type: "password",
        value: password,
        onChange: onChangePassword,
        validation: passwordValidation,
        label: "비밀번호"
    };

    const handleEmailValidationFalse = useCallback(() => {
        setEmailValidation(false);
        setEmailValidationMessage("이미 존재하는 이메일입니다.");
    }, [setEmailValidation, setEmailValidationMessage]);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (emailValidation && passwordValidation) {
            if (window.confirm("회원가입을 진행하시겠습니까?")) {
                postSignup({email, password}).then((res) => {
                    if (res) {
                        navigate("/signin");
                    }
                }).catch((err) => {
                    if (err.response.status === 400) {
                        alert("이미 존재하는 이메일입니다.");
                        handleEmailValidationFalse();
                        const inputRef = document.getElementById("validation-input");
                        const emailInput = inputRef?.dataset.testid === "email-input" ? inputRef : null;
                        if (emailInput) {
                            emailInput.focus();
                        }
                    }
                });
            }
        }
    };

    return (
        <StyledFormControl onSubmit={onSubmit}>
            <Typography>
                회원가입
            </Typography>
            <StyledInputBox>
                <ValidationInput {...emailInputProps}/>
            </StyledInputBox>
            <StyledInputBox>
                <ValidationInput {...passwordInputProps}/>
            </StyledInputBox>
            <StyledSignupButton data-textid={"signup-button"} disabled={!emailValidation || !passwordValidation}
                                variant={"contained"} type="submit">
                회원가입
            </StyledSignupButton>
        </StyledFormControl>
    );
};

export default SignUp;
