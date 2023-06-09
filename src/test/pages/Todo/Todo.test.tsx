import {TodoPropertiesChild} from "../../../interfaces/TodoProperties";
import SignUp from "../../../pages/SignUp";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import Todo from "../../../pages/Todo";
import React, {ReactNode} from "react";
import  {TokenProvider} from "../../../context";
import {BrowserRouter} from "react-router-dom";
import * as router from "react-router-dom";


const apiMethods = require("../../../apis/index.ts");
const mockedUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockedUsedNavigate
}));

beforeEach(() => {
    mockedUsedNavigate.mockReset();
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

const todoList: TodoPropertiesChild[] = [
    {
        id: 1,
        todo: "투두입니다.",
        isCompleted: false,
        userId: 1
    }];

const updatedTodoList: TodoPropertiesChild[] = [
    {
        id: 1,
        todo: "수정된 투두입니다.",
        isCompleted: false,
        userId: 1
    }];

const giveTokenProvider = () => {
    const context = require("../../../context/index.tsx");
    context.useTokenState = jest.fn().mockReturnValue("token");
};

const giveEmptyArray = () => {
    giveTokenProvider();
    const getTodos = jest.spyOn(apiMethods, "getTodos").mockResolvedValue([]);
};

const giveTodoList = () => {
    giveTokenProvider();
    // 목록 - 수정 - 삭제
    const getTodos = jest.spyOn(apiMethods, "getTodos").mockResolvedValueOnce(todoList)
        .mockResolvedValueOnce(updatedTodoList);
};

function giveEmptyTokenProvider() {
    const context = require("../../../context/index.tsx");
    context.useTokenState = jest.fn().mockReturnValue({accessToken:null});
}

describe("<Todo/>", () => {
    it("matches snapshot", () => {
        customRender(<Todo/>);
        const utils = customRender(<Todo/>);
        expect(utils.container).toMatchSnapshot();
    });
    it("토큰이 없으면 로그인 페이지로 이동", async () => {
        giveEmptyTokenProvider();
        customRender(<Todo/>);
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/signin");
    });
    it("처음 투두를 랜더링할 시에 로딩중 문구 출력, 로딩 후 할일이 없습니다 출력", async () => {
        giveEmptyArray();
        customRender(<Todo/>);
        expect(screen.getByText("로딩중..")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText("로딩중..")).toBeNull();
        });
    });
    it("투두가 존재하면 투두 리스트 출력", async () => {
        giveTodoList();
        customRender(<Todo/>);
        await waitFor(() => {
            expect(screen.getAllByText("투두입니다.")).toHaveLength(1);
        });
    });
    it("투두가 존재하지 않으면 할일이 없습니다 출력", async () => {
        giveEmptyArray();
        customRender(<Todo/>);
        await waitFor(() => {
            expect(screen.getByText("할 일이 없습니다.")).toBeInTheDocument();
        });
    });
    it("투두 입력 안되어있을 때 버튼 disabled", () => {
        giveEmptyArray();
        customRender(<Todo/>);
        const inputButton = screen.getByTestId("new-todo-add-button");
        const todoInput = screen.getByTestId("new-todo-input");
        fireEvent.change(todoInput, {target: {value: ""}});
        expect(inputButton).toBeDisabled();
    });
    it("투두 조건에 맞게 입력이 되어있을 때 버튼 disabled 해제", () => {
        giveEmptyArray();
        customRender(<Todo/>);
        const inputButton = screen.getByTestId("new-todo-add-button");
        const todoInput = screen.getByTestId("new-todo-input");
        fireEvent.change(todoInput, {target: {value: "투두입니다."}});
        expect(inputButton).not.toBeDisabled();
    });
    it("투두 입력 후 추가 버튼 클릭시 createTodo 호출 후 value 값 초기화 ", async () => {
        giveEmptyArray();
        const createTodo = jest.spyOn(apiMethods, "createTodo").mockResolvedValue({});
        customRender(<Todo/>);
        const inputButton = screen.getByTestId("new-todo-add-button");
        const todoInput = screen.getByTestId("new-todo-input");
        fireEvent.change(todoInput, {target: {value: "투두입니다."}});
        fireEvent.click(inputButton);
        await waitFor(() => {
            expect(createTodo).toHaveBeenCalled();
        });
        await waitFor(()=> {
            expect(createTodo).toHaveBeenCalledWith({todo: "투두입니다."});
        })
        await waitFor(() => {
            expect(todoInput).toHaveValue("");
        });
    });
    it("수정 버튼 클릭했을시 수정 컴포넌트 랜더링", async () => {
        giveTodoList();
        customRender(<Todo/>);
        await waitFor(() => {
            expect(screen.getByTestId("modify-button")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("modify-button"));
        await waitFor(() => {
            expect(screen.getByTestId("modify-input")).toBeInTheDocument();
        });
    });
    it("수정 버튼 클릭했을시 수정 컴포넌트 랜더링 후 수정 버튼 사라짐", async () => {
        giveTodoList();
        customRender(<Todo/>);
        await waitFor(() => {
            const modifyButton1 = screen.getByTestId("modify-button") as HTMLButtonElement;
            expect(modifyButton1).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("modify-button"));
        await waitFor(() => {
            expect(screen.queryByTestId("modify-button")).not.toBeInTheDocument();
        });
    });
    it("투두가 공백일시에 제출 버튼 비활성화", async () => {
        giveTodoList();
        customRender(<Todo/>);
        await waitFor(() => {
            const modifyButton1 = screen.getByTestId("modify-button") as HTMLButtonElement;
            expect(modifyButton1).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("modify-button"));
        await waitFor(() => {
            expect(screen.getByTestId("modify-input")).toBeInTheDocument();
        });
        const modifyInput = screen.getByTestId("modify-input");
        const modifyButton = screen.getByTestId("submit-button");
        fireEvent.change(modifyInput, {target: {value: ""}});
        expect(modifyButton).toBeDisabled();
    });
    it("취소 버튼 클릭했을시 수정 컴포넌트 사라지고 투두 출력", async () => {
        giveTodoList();
        customRender(<Todo/>);
        await waitFor(() => {
            const modifyButton1 = screen.getByTestId("modify-button") as HTMLButtonElement;
            expect(modifyButton1).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("modify-button"));
        await waitFor(() => {
            expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("cancel-button"));
        await waitFor(() => {
            expect(screen.getByText("투두입니다.")).toBeInTheDocument();
        });
    });
    it("수정내용 입력하고 수정버튼 클릭하면 api 호출 후 반영", async () => {
        giveTodoList();
        jest.spyOn(window,'confirm').mockImplementation(() => true);
        const updateTodo = jest.spyOn(apiMethods, "updateTodo").mockResolvedValue({});
        customRender(<Todo/>);
        await waitFor(() => {
            const modifyButton1 = screen.getByTestId("modify-button") as HTMLButtonElement;
            expect(modifyButton1).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("modify-button"));
        const submitButton = screen.getByTestId("submit-button");
        const modifyInput = screen.getByTestId("modify-input");
        expect(submitButton).toBeInTheDocument();
        expect(modifyInput).toBeInTheDocument();
        fireEvent.change(modifyInput, {target: {value: "수정된 투두입니다."}});
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(updateTodo).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(screen.getByText("수정된 투두입니다.")).toBeInTheDocument();
        });
    });
    it("삭제 버튼 클릭하면 확인 후 빈 배열 반환", async () => {
        giveTokenProvider();
        // 목록 - 수정 - 삭제
        jest.spyOn(apiMethods, "getTodos").mockResolvedValueOnce(todoList)
            .mockResolvedValueOnce([]);
        jest.spyOn(window,'confirm').mockImplementation(() => true);
        const deleteTodo = jest.spyOn(apiMethods, "deleteTodo").mockResolvedValue({response:{
            data: [],
            status: 204
            }});
        customRender(<Todo/>);
        await waitFor(() => {
            const deleteButton = screen.getByTestId("delete-button") as HTMLButtonElement;
            expect(deleteButton).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId("delete-button"));
        await waitFor(() => {
            expect(deleteTodo).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(screen.getByText("할 일이 없습니다.")).toBeInTheDocument();
        });
    });
    it("토큰 없는 상황에서 삭제 시도하면 로그인 페이지로 이동", async () => {
        giveEmptyTokenProvider();
        const getTodos = jest.spyOn(apiMethods, "getTodos").mockResolvedValueOnce(todoList)
            .mockResolvedValueOnce(updatedTodoList);
        jest.spyOn(window,'confirm').mockImplementation(() => true);
        jest.spyOn(window,'alert').mockImplementation(() => {});
        const deleteTodo = jest.spyOn(apiMethods, "deleteTodo").mockRejectedValue({response:{
                data: [],
                status: 401
            }});
        customRender(<Todo/>);
        await expect(mockedUsedNavigate).toHaveBeenCalledWith("/signin");
    });
    it("토큰 없는 상황에서 수정 시도하면 로그인 페이지로 이동", async () => {
        giveEmptyTokenProvider();
        const getTodos = jest.spyOn(apiMethods, "getTodos").mockResolvedValueOnce(todoList)
            .mockResolvedValueOnce(updatedTodoList);
        const updateTodo = jest.spyOn(apiMethods, "updateTodo").mockRejectedValue({response:{
                data: [],
                status: 401
            }});
        jest.spyOn(window,'confirm').mockImplementation(() => true);
        jest.spyOn(window,'alert').mockImplementation(() => {});
        customRender(<Todo/>);
        await expect(mockedUsedNavigate).toHaveBeenCalledWith("/signin");
    });
    it("토큰 없는 상황에서 추가 시도하면 로그인 페이지로 이동", async () => {
        giveEmptyTokenProvider();
        const getTodos = jest.spyOn(apiMethods, "getTodos").mockResolvedValueOnce(todoList)
            .mockResolvedValueOnce(updatedTodoList);
        const createTodo = jest.spyOn(apiMethods, "createTodo").mockRejectedValue({response:{
                data: [],
                status: 401
            }});
        jest.spyOn(window,'confirm').mockImplementation(() => true);
        jest.spyOn(window,'alert').mockImplementation(() => {});
        customRender(<Todo/>);
        await expect(mockedUsedNavigate).toHaveBeenCalledWith("/signin");
    });
});