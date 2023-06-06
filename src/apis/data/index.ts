export interface SigninData {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
}

export interface UpdateTodoData {
    id: string;
    todo: string;
    isCompleted: boolean;
}
