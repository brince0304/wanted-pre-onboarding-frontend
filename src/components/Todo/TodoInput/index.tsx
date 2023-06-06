import {Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, {useRef} from "react";
import {useTokenState} from "../../../context";
import {createTodo} from "../../../apis";
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
`;

interface TodoInputProps {
    todo: string;
}

const TodoInput = (props: { getTodoList: () => void }) => {
    const regex = /^.{1,}$/;
    const [onChange, value, setValue, validation, setValidation] = useFormControl({ regex });
    const tokenState = useTokenState();
    const isAuth = tokenState.accessToken !== null;
    const ref = useRef<HTMLInputElement>(null);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isAuth && validation) {
            createTodo({ todo: value })
                .then((res) => {
                    props.getTodoList();
                    setValue("");
                    setValidation(false);
                    ref.current?.focus();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <StyledFormControl onSubmit={onSubmit}>
            <TextField
                inputProps={{
                    "data-testid": "new-todo-input",
                }}
                ref={ref}
                variant="standard"
                label="TODO"
                placeholder="할일을 적어보세요!"
                onChange={onChange}
                value={value}
                sx={{ width: "100%" }}
            />
            <Button data-testid="new-todo-add-button" type="submit" disabled={!validation}>
                추가
            </Button>
        </StyledFormControl>
    );
};

export default TodoInput;
