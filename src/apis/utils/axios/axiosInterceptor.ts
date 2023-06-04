import { AxiosInstance } from "axios";
import {deleteAccessToken, getAccessToken, isAuthorized} from "../auth";


export function setInterceptors(instance: AxiosInstance) {
    const isAuth =  isAuthorized();
    // 요청 인터셉터 추가
    instance.interceptors.request.use(
        (config) => {
            config.headers["Content-Type"] = "application/json";
            if (isAuth) {
                config.headers["Authorization"] = `Bearer ${getAccessToken()}`;
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
                deleteAccessToken();
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