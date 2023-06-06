import {TodoPropertiesChild} from "../../../interfaces/TodoProperties";
import {Box, Checkbox, IconButton, ListItem, TextField, Tooltip, Typography,} from "@mui/material";
import styled from "@emotion/styled";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useFormControl} from "../../../hooks/useFormControl";
import {UpdateTodoData} from "../../../apis/data";
import {deleteTodo, updateTodo} from "../../../apis";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
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

const TodoContent = (props: { data: TodoPropertiesChild, getTodoList: () => void }) => {
    const regex = /^.{1,}$/;
    const { todo, isCompleted, id } = props.data;
    const [onChange, value, setValue, validation] = useFormControl({ regex, initialValue: todo });
    const todoContentRef = useRef<HTMLDivElement>(null);
    const isAuth = useTokenState().accessToken !== null;
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOverflow, setIsOverflow] = useState<boolean>(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isAuth) return;
        handleUpdateTodo({
            id: id.toString(),
            isCompleted: event.target.checked,
            todo: todo,
        });
    };

    const handleUpdateTodo = (data: UpdateTodoData) => {
        if (!isAuth) return;
        updateTodo(data)
            .then(() => {
                props.getTodoList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditClick = useCallback(() => {
        setIsEdit(true);
    }, []);

    const handleCancelClick = () => {
        setIsEdit(false);
        setValue(todo);
    };

    const handleUpdateClick = () => {
        if (value === todo) {
            setIsEdit(false);
            return;
        }
        if (validation && window.confirm("수정하시겠습니까?")) {
            setIsEdit(false);
            handleUpdateTodo({
                id: id.toString(),
                isCompleted: isCompleted,
                todo: value,
            });
        }
    };

    const handleDeleteClick = () => {
        if (!isAuth) return;
        if (window.confirm("삭제하시겠습니까?")) {
            deleteTodo(id.toString())
                .then(() => {
                    props.getTodoList();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    useEffect(() => {
        const contentBox = todoContentRef.current;
        if (contentBox) {
            setIsOverflow(contentBox.offsetWidth < contentBox.scrollWidth);
        }
    }, [todo]);

    if (todo !== "") {
        return (
            <StyledListItem>
                <StyledContentBox>
                    <Checkbox
                        checked={isCompleted}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "todo-checkbox" }}
                    />
                    {!isEdit ? (
                        <StyledTodoContentBox ref={todoContentRef}>
                            {isOverflow ? (
                                <OverFlowTitle variant="h6">{todo}</OverFlowTitle>
                            ) : (
                                <NonOverFlowTitle variant="h6">{todo}</NonOverFlowTitle>
                            )}
                        </StyledTodoContentBox>
                    ) : (
                        <StyledTodoContentBox>
                            <TextField
                                variant="standard"
                                inputProps={{ "data-testid": "modify-input" }}
                                defaultValue={value}
                                value={value}
                                onChange={onChange}
                                fullWidth
                            />
                        </StyledTodoContentBox>
                    )}
                </StyledContentBox>
                {!isEdit ? (
                    <StyledContentBox>
                        <Tooltip title="수정" arrow placement="top">
                            <IconButton data-testid="modify-button" onClick={handleEditClick}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제" arrow placement="top">
                            <IconButton data-testid="delete-button" onClick={handleDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </StyledContentBox>
                ) : (
                    <StyledContentBox>
                        <Tooltip title="제출" arrow placement="top">
                            <IconButton data-testid="submit-button" onClick={handleUpdateClick} disabled={!validation}>
                                <CheckCircleIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="취소" arrow placement="top">
                            <IconButton data-testid="cancel-button" onClick={handleCancelClick}>
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </StyledContentBox>
                )}
            </StyledListItem>
        );
    } else {
        return null;
    }
};

export default TodoContent;