import {SignupData} from "./data/SignupData";
import {axiosInstance, POST_SIGNUP_URL} from "./utils/axios/axiosInstance";

export const postSignup = async (data: SignupData) => {
    try {
        const response = await axiosInstance.post(POST_SIGNUP_URL, data);
        return response.status === 201;
    }
    catch (error) {
        console.log(error);
    }
}
