import axios from 'axios'
import {setInterceptors} from "./axiosInterceptor";

const BASE_URL = 'https://www.pre-onboarding-selection-task.shop/'

const axiosApi = (url:string, options? : any) => {
    const instance =  axios.create({
        baseURL: BASE_URL,
        ...options
    })
    return setInterceptors(instance)
}

export const axiosInstance = axiosApi(BASE_URL)
