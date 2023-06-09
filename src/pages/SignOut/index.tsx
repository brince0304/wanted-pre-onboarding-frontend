import {useEffect} from "react";
import {useTokenDispatch} from "../../context";

const SignOut = () => {
    const tokenDispatch = useTokenDispatch();
    useEffect(()=>{
        tokenDispatch({type: "SET_TOKEN", token: null});
        alert("로그아웃 되었습니다.");
    })
    return (
        <></>
    )
}

export default SignOut
