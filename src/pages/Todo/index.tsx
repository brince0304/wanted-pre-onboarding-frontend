import {Box} from "@mui/material";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import {TodoProperties} from "../../interfaces/TodoProperties";
import {getTodos} from "../../apis";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
`;


const Todo = () => {
    const [data, setData] = useState<TodoProperties>([]);
    useEffect(()=>{
        getTodos().then((res)=>{
            setData(res);
        }).catch((err)=>{
            console.log(err);
        })
    },[])
    return (
        <StyledBox>
            투두리스트
        </StyledBox>
    )
}

export default Todo
