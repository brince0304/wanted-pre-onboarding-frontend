import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Router, Routes} from "react-router";
import SignUp from "./pages/SignUp";
import {Container, styled} from "@mui/material";

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
        </Routes>
    </StyledContainer>
  );
}

export default App;
