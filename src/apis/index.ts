import {
    axiosInstance,
    GET_TODO_URL,
    POST_SIGNIN_URL,
    POST_SIGNUP_URL,
    POST_TODO_URL
} from "./utils/axios/axiosInstance";
import {SigninData, SignupData} from "./data";

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
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const postTodo = async (data:{todo:string}) => {
    try {
        const response = await axiosInstance.post(POST_TODO_URL, data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

