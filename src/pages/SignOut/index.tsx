import {useEffect} from "react";
import {useTokenDispatch, useTokenState} from "../../context";

const SignOut = () => {
    const tokenState = useTokenState();
    const tokenDispatch = useTokenDispatch();
    useEffect(()=>{
        tokenDispatch({type: "SET_TOKEN", token: null});
    })
    return (
        <></>
    )
}

export default SignOut
