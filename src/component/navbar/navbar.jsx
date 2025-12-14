import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Container, Avatar, Menu, MenuItem, Fade, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; 

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username") || "User";

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const Logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <AppBar position="fixed" className='bg-white shadow-md'>
            <Container maxWidth="xxl" className='bg-white'>
                <Toolbar disableGutters className='flex justify-between min-h-[64px]'>

                    {/* Logo */}
                    <Box className='flex-1'>
                        <Typography
                            onClick={() => navigate('/')}
                            variant="h5" // Bigger logo
                            className='tracking-[3px] bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text select-none cursor-pointer transition-transform duration-200 hover:scale-105'
                        >
                            ScoreNinja
                        </Typography>
                    </Box>
                    
                    {/* Desktop View */}
                    <Box className='hidden md:flex items-center gap-4 max-w-[50%]'>
                        {token ? (
                            <>
                                <Box
                                    onClick={handleMenu}
                                    className='flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105 p-1 rounded-md hover:bg-gray-100 max-w-full'
                                >
                                    <Avatar 
                                        alt={username} 
                                        src="https://cdn-icons-png.flaticon.com/512/219/219959.png"
                                        sx={{ width: 36, height: 36 }}
                                    />
                                    <Typography 
                                        className='text-black font-medium truncate max-w-[120px]' // Truncate if username too long
                                        title={username} // Tooltip on hover
                                    >
                                        {username}
                                    </Typography>
                                    <ArrowDropDownIcon className='text-black' />
                                </Box>

                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                                    <MenuItem onClick={() => { handleClose(); Logout(); }}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <button 
                                className="custom-button transition-transform duration-200 hover:scale-105"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        )}
                    </Box>
                    
                    {/* Mobile View */}
                    <Box className='md:hidden'>
                        {token ? (
                            <>
                                <IconButton 
                                    size="large" 
                                    onClick={handleMenu}
                                    className='text-black transition-transform duration-200 hover:scale-110'
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar-mobile"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem className='flex items-center gap-2'>
                                        <Avatar 
                                            alt={username} 
                                            src="https://cdn-icons-png.flaticon.com/512/219/219959.png"
                                            sx={{ width: 28, height: 28 }}
                                        />
                                        <span className='truncate max-w-[120px]' title={username}>{username}</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                                    <MenuItem onClick={() => { handleClose(); Logout(); }}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <button 
                                className="custom-button transition-transform duration-200 hover:scale-105"
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
