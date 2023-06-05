import {Box} from "@mui/material";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import {TodoProperties} from "../../interfaces/TodoProperties";
import {getTodos} from "../../apis";
import TodoInput from "../../components/Todo/TodoInput";
import {useTokenState} from "../../context";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 20px;
`;


const Todo = () => {
    const [data, setData] = useState<TodoProperties>([]);
    const tokenState = useTokenState();
    const isAuth = tokenState.accessToken !== null;
    useEffect(()=>{
        if(isAuth) {
            getTodos().then((res) => {
                setData(res);
            }).catch((err) => {
                console.log(err);
            })
        }
    },[])

    const getTodoList = () => {
        getTodos().then((res)=>{
            setData(res);
        }).catch((err)=>{
            console.log(err);
        })
    }
    return (
        <StyledBox>
            <TodoInput getTodoList={getTodoList}/>
        </StyledBox>
    )
}

export default Todo
