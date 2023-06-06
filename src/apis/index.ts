import {
    axiosInstance,
    DELETE_TODO_URL,
    GET_TODO_URL,
    POST_SIGNIN_URL,
    POST_SIGNUP_URL,
    POST_TODO_URL,
    PUT_TODO_URL
} from "./utils/axios/axiosInstance";
import {SigninData, SignupData, UpdateTodoData} from "./data";
import {TodoProperties, TodoPropertiesChild} from "../interfaces/TodoProperties";

export const postSignup = async (data: SignupData) => {
    try {
        const response = await axiosInstance.post(POST_SIGNUP_URL, data);
        return response.status === 201;
    }
    catch (error) {
        throw error;
    }
}

export const postSignin = async (data: SigninData) => {
    try {
        const response = await axiosInstance.post(POST_SIGNIN_URL, data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getTodos = async () => {
    try {
        const response = await axiosInstance.get(GET_TODO_URL);
        return response.data as TodoProperties;
    }
    catch (error) {
        throw error;
    }
}

export const createTodo = async (data:{todo:string}) => {
    try {
        const response = await axiosInstance.post(POST_TODO_URL, data);
        return response.data as TodoPropertiesChild;
    }
    catch (error) {
        throw error;
    }
}

export const updateTodo = async (data:UpdateTodoData) => {
    try {
        const response = await axiosInstance.put(PUT_TODO_URL.replace('{id}',data.id), data);
        return response.data as TodoPropertiesChild;
    }
    catch (error) {
        throw error;
    }
}

export const deleteTodo = async (id:string) => {
    try {
        const response = await axiosInstance.delete(DELETE_TODO_URL.replace('{id}',id));
        return response.status===204;
    }
    catch (error) {
        throw error;
    }
}
