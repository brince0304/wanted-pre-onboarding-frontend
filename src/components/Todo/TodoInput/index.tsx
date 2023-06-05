import {Button, FormControl} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, {useCallback, useState} from "react";
import {useTokenState} from "../../../context";
import {postTodo} from "../../../apis";
import styled from "@emotion/styled";
import {useFormControl} from "../../../hooks/useFormControl";

const StyledFormControl = styled.form`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 70px;
    background-color: #f5f5f5;
    border-radius: 10px;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 1px 0 0 #e0e0e0;
  padding: 0 20px;
`

interface TodoInputProps {
    todo:string
}
const TodoInput = (props:{getTodoList:()=>void}) => {
    const regex = /^.{1,}$/;
    const [onChange,value,validation] = useFormControl({regex:regex})
    const tokenState = useTokenState();
    const isAuth = tokenState.accessToken !== null;

    const onSubmit = useCallback((e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isAuth){
            postTodo(value).then((res)=>{
                props.getTodoList();
            }).catch((err)=>{
                console.log(err);
            })
        }
    },[])

    return (
        <StyledFormControl onSubmit={onSubmit}>
        <TextField variant={"standard"} label={"TODO"} placeholder={"할일을 적어보세요!"} value={value}
                   onChange={onChange} fullWidth/>
            <Button type={"submit"} disabled={!validation}>제출</Button>
        </StyledFormControl>
    )
}

export default TodoInput;
