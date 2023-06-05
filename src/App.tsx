import React, {useContext, useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import {Navigate, Route, Router, Routes} from "react-router";
import SignUp from "./pages/SignUp";
import {Container} from "@mui/material";
import SignIn from "./pages/SignIn";
import styled from "@emotion/styled";
import Todo from "./pages/Todo";
import { TokenProvider, useTokenDispatch, useTokenState } from "./context";
import Header from "./components/Header";
import SignOut from "./pages/SignOut";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
`;

function App() {
    const tokenState = useTokenState();

    return (
            <StyledContainer>
                <Header/>
                <Routes>
                    <Route path={"/"} element={tokenState.accessToken ? <Navigate to={"/todo"}/> : <Navigate to={"/signin"}/>}/>
                    <Route path={"/signup"}
                           element={tokenState.accessToken ? <Navigate to={"/todo"}/> : <SignUp/>}/>
                    <Route path={"/signin"}
                           element={tokenState.accessToken ? <Navigate to={"/todo"}/> : <SignIn/>}/>
                    <Route path={"/todo"}
                           element={tokenState.accessToken ? <Todo/> : <Navigate to={"/signin"}/>}/>
                    <Route path={"/signout"}
                           element={tokenState.accessToken ? <SignOut/> : <Navigate to={"/signin"}/>}/>

                </Routes>
            </StyledContainer>
    );
}

export default App;
