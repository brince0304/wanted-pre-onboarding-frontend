import {Box, Button, styled} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import React from "react";
import {useNavigate} from "react-router";

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 20px;
    `;

const NotFound = ()  => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    }
    return (
        <StyledBox>
            <ReportProblemIcon sx={{
                fontSize: 100
            }}/>
            <h1>404 Not Found</h1>
            <Button variant={"contained"} onClick={handleClick}>
                홈으로
            </Button>
        </StyledBox>
    )
}

export default NotFound