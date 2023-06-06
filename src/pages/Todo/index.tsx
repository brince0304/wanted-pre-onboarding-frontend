import {Box, List, Typography} from "@mui/material";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import {TodoProperties} from "../../interfaces/TodoProperties";
import {getTodos} from "../../apis";
import TodoInput from "../../components/Todo/TodoInput";
import {useTokenState} from "../../context";
import TodoContent from "../../components/Todo/TodoContent";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 20px;
`;


const StyledTodoList = styled(List)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 450px;
  background-color: #f5f5f5;
  border-radius: 10px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 0 0 #e0e0e0;
`;


const Todo = () => {
    const [data, setData] = useState<TodoProperties>([]);
    const tokenState = useTokenState();
    const isAuth = tokenState.accessToken !== null;
    useEffect(()=>{
        if(isAuth) {
            getTodos().then((res) => {
                setData(res);
            })
        }else{
            setData([]);
        }
    },[isAuth])

    const getTodoList = () => {
        getTodos().then((res)=>{
            setData(res);
        })
    }
    return (
        <StyledBox>
            <TodoInput getTodoList={getTodoList}/>
            {data.length > 0 &&
                <StyledTodoList>
                {data.map((todo)=>{
                    return <TodoContent key={todo.id} data={todo} getTodoList={getTodoList} />
                })
                }
            </StyledTodoList>}
            {data && data.length === 0 &&
                <StyledTodoList>
                    <Typography variant="h6" component="h6" sx={{color: "#9e9e9e"}}>
                        할 일이 없습니다.
                    </Typography>
                </StyledTodoList>}

        </StyledBox>
    )
}

export default Todo
