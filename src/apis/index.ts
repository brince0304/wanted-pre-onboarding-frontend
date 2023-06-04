import {axiosInstance, POST_SIGNIN_URL, POST_SIGNUP_URL} from "./utils/axios/axiosInstance";
import {SigninData, SignupData} from "./data";
import { AxiosResponse } from "axios";

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
