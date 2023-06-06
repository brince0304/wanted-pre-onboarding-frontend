import axios from "axios";
import {setInterceptors} from "./axiosInterceptor";

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosApi = (url:string | undefined, options? : any) => {
    const instance =  axios.create({
        baseURL: url,
        ...options
    })
    return setInterceptors(instance)
}

export const axiosInstance = axiosApi(BASE_URL)
export const POST_SIGNUP_URL = '/auth/signup'
export const POST_SIGNIN_URL = '/auth/signin'
export const POST_TODO_URL = '/todos'
export const GET_TODO_URL = '/todos'
export const PUT_TODO_URL = '/todos/{id}'
export const DELETE_TODO_URL = '/todos/{id}'