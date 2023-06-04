import { AxiosInstance } from "axios";
import {
    getTokenFromLocalStorage, removeTokenFromLocalStorage
} from "../../../context";


export function setInterceptors(instance: AxiosInstance) {

    // 요청 인터셉터 추가
    instance.interceptors.request.use(
        (config) => {
            config.headers["Content-Type"] = "application/json";
            if (getTokenFromLocalStorage) {
                config.headers["Authorization"] = `Bearer ${getTokenFromLocalStorage()}`;
            }
            // 요청 전처리 로직
            return config;
        },
        (error) => {
            console.log("error: ", error);
            // 요청 에러 처리 로직
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(

        (response) => {
            if(response.status === 401) {
                removeTokenFromLocalStorage();
            }
            // 응답 전처리 로직
            return response;
        },
        (error) => {
            console.log("error: ", error);
            // 응답 에러 처리 로직
            return Promise.reject(error);
        }
    );

    return instance;
}