import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Router, Routes} from "react-router";
import SignUp from "./pages/SignUp";
import {Container} from "@mui/material";
import SignIn from "./pages/SignIn";
import styled from '@emotion/styled';

const StyledContainer = styled(Container)`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
`

function App() {
  return (
    <StyledContainer>
        <Routes>
      <Route path={"/signup"} Component={SignUp}/>
            <Route path={"/signin"} Component={SignIn}/>
        </Routes>
    </StyledContainer>
  );
}

export default App;
