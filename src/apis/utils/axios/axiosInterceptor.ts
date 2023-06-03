import { AxiosInstance } from "axios";


export function setInterceptors(instance: AxiosInstance) {
    // 요청 인터셉터 추가
    instance.interceptors.request.use(
        (config) => {
            config.headers["Content-Type"] = "application/json";
            config.headers["Access-Control-Allow-Origin"] = "*";
            config.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";
            config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            config.headers["Access-Control-Allow-Credentials"] = "true";
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