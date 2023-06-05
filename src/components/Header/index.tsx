import styled from "@emotion/styled";
import {Box} from "@mui/material";
import HeaderMenu from "./HeaderMenu";

const StyledBox = styled(Box)`
    display: flex;
  flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 70px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 1px 0 0 #e0e0e0;
    position: fixed;
    top: 0;
    left: 0;
  padding: 0 20px;
  z-index: 100;
  
  
`;


const Header = () => {
    return (
        <StyledBox component={"header"}>
            <h1>Todo</h1>
            <HeaderMenu/>
        </StyledBox>
    )
}

export default Header;
