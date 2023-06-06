import {removeTokenFromLocalStorage} from "../../../context";

export const interceptorErrorHandler = (error: any) => {
    if (error.response) {
        if (error.response.status === 401) {
            removeTokenFromLocalStorage();
        } else {
            window.alert("알수없는 에러가 발생했습니다.");
        }
    } else if (error.request) {
        // 서버 이상할때
        window.alert("서버로부터 응답이 없습니다.");
    } else {
        // 그 외
        window.alert("알수없는 에러가 발생했습니다.");
    }
};

export const todoErrorHandler = () => {
    window.alert("로그인이 필요합니다.")
    window.location.reload();
}
