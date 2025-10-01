import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Container, Typography, Avatar } from '@mui/material';
import FullScreenPrompt from './FullScreenPrompt';
import HomeIcon from '@mui/icons-material/Home';
const TestNavbar = () => {
    const [timeLeft, setTimeLeft] = useState(1000); // 1 hour in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getColor = () => {
        if (timeLeft <= 600) return 'red';
        if (timeLeft <= 1200) return 'black';
        return 'black';
    };

    return (
        <>
        {/* <FullScreenPrompt/> */}
        <AppBar position="fixed" style={{ backgroundColor:'white', boxShadow:'0px 2px 10px rgba(0,0,0,0.2)', height:'60px', justifyContent:'center' }}>
            <Container maxWidth="xxl" style={{ backgroundColor:'white', height:'60px', position:'relative' }}>
                <Toolbar disableGutters className='flex' style={{ height:'60px', position:'relative' }}>
                    <Typography style={{ fontSize:'26px', color:getColor(), fontWeight:'bold', position:'absolute', left:'50%', transform:'translateX(-50%)' }}>{formatTime(timeLeft)}</Typography>
                    <Typography className=' text-black cursor-pointer' style={{ position:'absolute', right:'5rem',fontWeight:"bold",top:"22px" }}>DHRUV SETH</Typography>
                    <Typography className='text-blue-700' style={{position:"absolute",right:"12rem",fontSize:"20px",fontWeight:"bold",top:"18px"}}>2/35</Typography>
                    <HomeIcon className="left-[-11px] cursor-pointer text-blue-700" style={{position:"absolute",fontSize:"37px"}}/>
                    <Avatar alt="User" src="https://cdn-icons-png.flaticon.com/512/219/219959.png" style={{ position:'absolute', right:'1rem' }} />
                </Toolbar>
            </Container>
        </AppBar>
        </>
    );
};

export default TestNavbar;
