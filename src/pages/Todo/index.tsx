import {Box, List, Typography} from "@mui/material";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import {TodoProperties} from "../../interfaces/TodoProperties";
import {getTodos} from "../../apis";
import TodoInput from "../../components/Todo/TodoInput";
import {useTokenState} from "../../context";
import TodoContent from "../../components/Todo/TodoContent";
import {useNavigate} from "react-router";

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
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<TodoProperties>([]);
    const tokenState = useTokenState();
    const isAuth = tokenState.accessToken !== null;
    const navigate = useNavigate();
    useEffect(()=>{
        if(isAuth) {
            getTodos().then((res) => {
                setData(res);
                setIsLoading(false);
            })
        }else{
            window.alert("로그인이 필요합니다.");
            navigate("/signin");
        }
    },[])

    const getTodoList = () => {
        if(!isAuth){
            window.alert("로그인이 필요합니다.");
            navigate("/signin");
            return;
        }
        getTodos().then((res)=>{
            setData(res);
        })
    }
    return (
        <StyledBox>
            <TodoInput getTodoList={getTodoList}/>
            <StyledTodoList>
                {isLoading ? <Typography variant={"h6"}>로딩중..</Typography> : (
                    data && data.length > 0 ?
                        data.map((todo)=>{
                            return <TodoContent key={todo.id} data={todo} getTodoList={getTodoList} />
                        }) : <Typography variant={"h6"}>할 일이 없습니다.</Typography>
                    )}
            </StyledTodoList>
        </StyledBox>
    )
}

export default Todo
