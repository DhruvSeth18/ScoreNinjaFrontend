import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Container, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; 

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const isLoggedIn = false; 

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed" className='bg-white'>
            <Container maxWidth="xxl" className='bg-white'>
                <Toolbar disableGutters className='flex justify-between min-h-[64px]'>  {/* Added min-h-[64px] */}
                    {/* Logo */}
                    <Box className='flex-1'>
                        <p 
                            onClick={() => navigate('/')} 
                            className='text-[25px] tracking-[3px] font-bold text-black bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text select-none cursor-pointer'
                        >
                            ScoreNinja
                        </p>
                    </Box>
                    
                    {/* Desktop View */}
                    <Box className='hidden md:flex items-center gap-3'>
                        {isLoggedIn ? (
                            <>
                                <p className='text-[20px] text-black'>User Name</p>
                                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                    <Avatar 
                                        alt="User" 
                                        src="https://cdn-icons-png.flaticon.com/512/219/219959.png"
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        navigate('/profile');
                                    }}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        // Add logout logic here
                                        navigate('/login');
                                    }}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <button 
                                className="custom-button"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        )}
                    </Box>
                    
                    {/* Mobile View */}
                    <Box className='md:hidden'>
                        {isLoggedIn ? (
                            <>
                                <IconButton 
                                    size="large" 
                                    onClick={handleMenu}
                                    className='text-black'
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar-mobile"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem className='flex items-center gap-2'>
                                        <Avatar 
                                            alt="User" 
                                            src="https://cdn-icons-png.flaticon.com/512/219/219959.png"
                                            sx={{ width: 24, height: 24 }}
                                        />
                                        <span>User Name</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        navigate('/profile');
                                    }}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        // Add logout logic here
                                        navigate('/login');
                                    }}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <button 
                                className="custom-button"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
