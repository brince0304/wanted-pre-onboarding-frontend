import SignIn from "../../../pages/SignIn";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import  {TokenProvider} from "../../../context";
import React, {ReactNode} from "react";
import {BrowserRouter} from "react-router-dom";



const apiMethods = require("../../../apis/index.ts");
const context = require("../../../context/index.tsx");

const mockedDispatch = jest.fn();
jest.mock('../../../context', () => ({
    ...jest.requireActual('../../../context') as any,
    useTokenDispatch: () => mockedDispatch,
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockedUsedNavigate
}));


beforeEach(() => {
    mockedUsedNavigate.mockReset();
    mockedDispatch.mockReset();
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});


function customRender(children: ReactNode) {
    return render(
        <TokenProvider>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </TokenProvider>
    );
}

beforeEach(() => {
    mockedDispatch.mockReset();
    mockedUsedNavigate.mockReset();
});

describe("<SignIn/>", () => {
    it("matches snapshot", () => {
        const utils = customRender(<SignIn/>);
        expect(utils.container).toMatchSnapshot();
    });
    it("이메일, 비밀번호가 입력이 안되어있을 때 버튼 disabled", () => {
        customRender(<SignIn/>);
        const signInButton = screen.getByTestId("signin-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: ""}});
        fireEvent.change(passwordInput, {target: {value: ""}});
        expect(signInButton).toBeDisabled();
    });
    it("이메일, 비밀번호가 조건에 맞게 입력이 되어있을 때 버튼 disabled 해제", () => {
        customRender(<SignIn/>);
        const signInButton = screen.getByTestId("signin-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: "emai9090l@email.email"}});
        fireEvent.change(passwordInput, {target: {value: "password"}});
        expect(signInButton).not.toBeDisabled();
    });
    it("이메일이 옳지 않을 때 validation 에 메시지 추가", async () => {
        const postSignIn = jest.spyOn(apiMethods, "postSignin").mockRejectedValue({
            response: {
                status: 404,
                data: {message: "해당 사용자가 존재하지 않습니다."}
            }
        });
        customRender(<SignIn/>);
        const signInButton = screen.getByTestId("signin-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: "email@email.email"}});
        fireEvent.change(passwordInput, {target: {value: "password"}});
        fireEvent.click(signInButton);
        await waitFor(() => {
            const validationIcon = screen.getAllByTestId('CheckCircleIcon')[0];
            expect(validationIcon.getAttribute('aria-label')).toBe('해당 사용자가 존재하지 않습니다.');
        });
    });
    it("비밀번호가 옳지 않을 때 validation 에 메시지 추가", async () => {
        const postSignIn = jest.spyOn(apiMethods, "postSignin").mockRejectedValue({
            response: {
                status: 401,
                data: {message: "Unauthorized"}
            }
        });
        customRender(<SignIn/>);
        const signInButton = screen.getByTestId("signin-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: "mytestemail@email.email"}});
        fireEvent.change(passwordInput, {target: {value: "password0"}});
        fireEvent.click(signInButton);
        await waitFor(() => {
            const validationIcon = screen.getAllByTestId('CheckCircleIcon')[1];
            expect(validationIcon.getAttribute('aria-label')).toBe('비밀번호가 일치하지 않습니다.');
        });
    });
    it("이메일과 비밀번호가 일치할 때 contex에 토큰 저장 후 TODO 로 이동", async () => {
        const postSignIn = jest.spyOn(apiMethods, "postSignin").mockResolvedValue({
            access_token : 'token'
        });
        const mockedSetToken = jest.spyOn(context, "setToken");
        const token = 'token';
        customRender(<SignIn/>);
        const signInButton = screen.getByTestId("signin-button");
        const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
        const passwordInput = screen.getByTestId("password-input") as HTMLInputElement;
        fireEvent.change(emailInput, {target: {value: "mytestemail@email.email"}});
        fireEvent.change(passwordInput, {target: {value: "password"}});
        fireEvent.click(signInButton);
        await waitFor(() => {
            expect(postSignIn).toBeCalledTimes(1);
        });
        await waitFor(()=>{
            expect(postSignIn).toBeCalledWith({
                email: emailInput.value,
                password: passwordInput.value
            });
        })
        expect(mockedSetToken).toBeCalledTimes(1);
        expect(mockedSetToken).toBeCalledWith(mockedDispatch, token);
        expect(mockedUsedNavigate).toBeCalledWith('/todo');
    });
});
