import SignUp from "../../../pages/SignUp";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import React, {ReactNode} from "react";
import {TokenProvider} from "../../../context";
import {BrowserRouter} from "react-router-dom";
import "@testing-library/jest-dom";

const apiMethods = require("../../../apis/index.ts");
const mockedUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockedUsedNavigate
}));

const mockedDispatch = jest.fn();
jest.mock('../../../context', () => ({
    ...jest.requireActual('../../../context') as any,
    useTokenDispatch: () => mockedDispatch,
}));

beforeEach(()=>{
})

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
    mockedUsedNavigate.mockReset();
    mockedDispatch.mockReset();
});

describe("<SignUp/>", () => {
    it("matches snapshot", () => {
        customRender(<SignUp/>);
        const utils = customRender(<SignUp/>);
        expect(utils.container).toMatchSnapshot();
    });
    it("이메일, 비밀번호가 입력이 안되어있을 때 버튼 disabled", () => {
        customRender(<SignUp/>);
        const signupButton = screen.getByTestId("signup-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: ""}});
        fireEvent.change(passwordInput, {target: {value: ""}});
        expect(signupButton).toBeDisabled();
    });
    it("이메일, 비밀번호가 조건에 맞게 입력이 되어있을 때 버튼 disabled 해제", () => {
        customRender(<SignUp/>);
        const signupButton = screen.getByTestId("signup-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: "emai9090l@email.email"}});
        fireEvent.change(passwordInput, {target: {value: "password"}});
        expect(signupButton).not.toBeDisabled();
    });
    it("이메일이 이미 존재할 때 validate error", async () => {
        const confirm = jest.spyOn(window, "confirm").mockReturnValue(true);
        const postSignUp = jest.spyOn(apiMethods, "postSignup").mockRejectedValue({response: {status: 400}})
        customRender(<SignUp/>);
        const signupButton = screen.getByTestId("signup-button");
        const emailInput = screen.getByTestId("email-input");
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(emailInput, {target: {value: "existsemail@email.com"}});
        fireEvent.change(passwordInput, {target: {value: "password"}});
        fireEvent.click(signupButton);
        const validate = screen.getAllByTestId("CheckCircleIcon")[0];
        await waitFor(() => {
            expect(postSignUp).toBeCalledTimes(1);
        });
        await waitFor(()=>{
            expect(validate.getAttribute('aria-label')).toBe('이미 존재하는 이메일입니다.');
        })
    });
    it("이메일, 비밀번호가 조건에 맞고 회원가입이 성공했을때 로그인 페이지로 이동", async () => {
        const postSignUp = jest.spyOn(apiMethods, "postSignup").mockResolvedValue(true);
        const confirm = jest.spyOn(window, "confirm").mockReturnValue(true);
        const alert = jest.spyOn(window, "alert").mockImplementation(() => {
        });
        customRender(<SignUp/>);
        const signupButton = screen.getByTestId("signup-button");
        const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
        const passwordInput = screen.getByTestId("password-input") as HTMLInputElement;
        fireEvent.change(emailInput, {target: {value: "emailemail313121@email.email"}});
        fireEvent.change(passwordInput, {target: {value: "password"}});
        fireEvent.click(signupButton);
        await expect(postSignUp).toBeCalledWith({
            email: emailInput.value,
            password: passwordInput.value
        });
        await expect(mockedUsedNavigate).toBeCalledWith("/signin");
    });

});