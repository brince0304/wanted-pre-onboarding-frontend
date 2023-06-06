import {AxiosInstance} from "axios";
import {getTokenFromLocalStorage, removeTokenFromLocalStorage} from "../../../context";
import {interceptorErrorHandler} from "../errorhandler";


export function setInterceptors(instance: AxiosInstance) {

    // 요청 인터셉터 추가
    instance.interceptors.request.use(
        (config) => {
            config.headers["Content-Type"] = "application/json";
            if (getTokenFromLocalStorage) {
                config.headers["Authorization"] = `Bearer ${getTokenFromLocalStorage()}`;
            }
            return config;
        },
        (error) => {
            interceptorErrorHandler(error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(

        (response) => {
            return response;
        },
        (error) => {
            interceptorErrorHandler(error);
            return Promise.reject(error);
        }
    );

    return instance;
}