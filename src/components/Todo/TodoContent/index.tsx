import {TodoProperties, TodoPropertiesChild} from "../../../interfaces/TodoProperties";
import {
    Box,
    Button,
    Checkbox, FormControl,
    Grow,
    IconButton,
    ListItem, TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef } from "react";
import { useFormControl } from "../../../hooks/useFormControl";
import {UpdateTodoData} from "../../../apis/data";
import {deleteTodo, getTodos, updateTodo} from "../../../apis";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {useTokenState} from "../../../context";

const StyledListItem = styled(ListItem)`
  display: flex;
  @keyframes marquee {
    0% { transform: translateX(-10%); }
    100% { transform: translateX(-60%); }
  }
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const StyledContentBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 400px;
  gap: 10px;
`;

const StyledTodoFormControl = styled(FormControl)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 400px;
  gap: 10px;
`;

const StyledTodoContentBox = styled(Box)`
    display: block;
  white-space: nowrap;
  overflow: hidden;
    width: 260px;
`;

const OverFlowTitle = styled(Typography)`
  display: inline-block;
  animation: marquee 10s linear infinite;
`

const NonOverFlowTitle = styled(Typography)`
    display: inline-block;
`

const TodoContent = (props: {data:TodoPropertiesChild, getTodoList:()=>void}) => {
    const regex = /^.{1,}$/;
    const [onChange,value,setValue,validation,setValidation] = useFormControl({regex: regex,
    initialValue: props.data.todo,});
    const todoContentRef = useRef<HTMLDivElement>(null)
    const [isChecked, setIsChecked] = useState<boolean>(props.data.isCompleted);
    const [content, setContent] = useState<string>(props.data.todo);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOverFlow, setIsOverFlow] = useState<boolean>(false);
    const isAuth = useTokenState().accessToken!==null;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(!isAuth) return;
        handleUpdateTodo({
            id: props.data.id.toString(),
            isCompleted: event.target.checked,
            todo: content
        })
    }

    const handleUpdateTodo = (data :UpdateTodoData) => {
        if(!isAuth) return;
       updateTodo(data).then((res) => {
           setContent(res.todo);
           setIsChecked(res.isCompleted);
           props.getTodoList();
       }).catch((err) => {
           console.log(err);
       })
    }

    const handleEditClick = useCallback(() => {
        setIsEdit(true);
    }, []);

    const handleCancelClick = () => {
        setIsEdit(false);
        setValue(content);
    }

    const handleUpdateClick = () => {
        if(value===content){
            setIsEdit(false);
            return;
        }
        if(validation && window.confirm("수정하시겠습니까?")) {
            setIsEdit(false);
            handleUpdateTodo({
                id: props.data.id.toString(),
                isCompleted: isChecked,
                todo: value
            })
        }
    }

    const handleDeleteClick = () => {
        if(!isAuth) return;
        if(window.confirm("삭제하시겠습니까?")) {
            deleteTodo(props.data.id.toString()).then((res) => {
                if(res){
                    setContent("");
                    setIsChecked(false);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        props.getTodoList();

    }

    useEffect(() => {
        const contentBox = todoContentRef.current;
        if (contentBox) {
            const isOverflowed = contentBox.offsetWidth < contentBox.scrollWidth;
            if(isOverflowed) {
                setIsOverFlow(true)
            }else{
                setIsOverFlow(false)
            }
        }
    }, [content])

    if(content!==""){
    return (
    <StyledListItem>
        <StyledContentBox>
            <Checkbox
                checked={isChecked}
                onChange={handleChange}
                inputProps={{"aria-label": "todo-checkbox"}}
            />
            {!isEdit &&
                <StyledTodoContentBox ref={todoContentRef}>
                    {isOverFlow ? <OverFlowTitle variant={"h6"}>{content}</OverFlowTitle> :
                        <NonOverFlowTitle variant={"h6"}>{content}</NonOverFlowTitle>}
                </StyledTodoContentBox>}
            {isEdit &&
                <StyledTodoContentBox>
                    <TextField variant={"standard"} inputProps={{"data-testid": "modify-input"}} defaultValue={value}
                               value={value} onChange={onChange}
                               fullWidth/>
                </StyledTodoContentBox>
            }

        </StyledContentBox>
        {!isEdit &&
            <StyledContentBox>
                <Tooltip title={"수정"} arrow placement={"top"}>
                    <IconButton data-testid={"modify-button"} onClick={handleEditClick}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"삭제"} arrow placement={"top"}>
                    <IconButton data-testid={"delete-button"} onClick={handleDeleteClick}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </StyledContentBox>}
        {isEdit &&
            <StyledContentBox>
                <Tooltip title={"제출"} arrow placement={"top"}>
                    <IconButton data-testid={"submit-button"} onClick={handleUpdateClick} disabled={!validation}>
                        <CheckCircleIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"취소"} arrow placement={"top"}>
                    <IconButton data-testid={"cancel-button"} onClick={handleCancelClick}>
                        <CancelIcon/>
                    </IconButton>
                </Tooltip>
            </StyledContentBox>}


    </StyledListItem>
    );}else{
        return null;
    }
};

export default TodoContent;
