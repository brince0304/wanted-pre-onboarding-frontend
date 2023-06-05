import {Box, Button} from "@mui/material";
import styled from "@emotion/styled";
import {useNavigate} from "react-router";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {useTokenState} from "../../../context";
import {Login, Logout, TodayOutlined} from "@mui/icons-material";

const StyledButton = styled(Button)`
  display: flex;
  width: 120px;
  height: 50px;
  margin-right: 40px;
  gap: 10px;
  color: black;
`;

interface MenuProps {
    label : string;
    icon : ReactNode;
    link : string;
}

const HeaderMenu = () => {

    const navigate = useNavigate();
    const tokenState = useTokenState();
    const isAuth = tokenState.accessToken !== null;
    const menuData = [
        isAuth ?  {label:"로그아웃",
            icon:<Logout/>,
            link:"/signout"
        }: {label:"로그인",
                icon:<Login/>,
                link:"/signin"},
        isAuth ?  {label:"투두리스트",
                icon:<TodayOutlined/>,
                link:"/todo"} :
            {label:"회원가입",
                icon:<PersonAddAlt1Icon/>,
                link:"/signup"
            },
    ] as MenuProps[]

    return (
        <Box sx={{
            display: "flex",
            flexDirection : "row",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {menuData.map((item, index) => (
                <StyledButton key={index} onClick={(e)=>{
                    navigate(item.link);
                }}>
                    {item.icon}
                    {item.label}
                </StyledButton>
            ))}
        </Box>
    )
}

export default HeaderMenu
