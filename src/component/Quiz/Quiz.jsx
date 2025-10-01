import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import MenuIcon from '@mui/icons-material/Menu';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateQuiz from '../CreateQuiz/CreateQuiz';
import CreatedQuizzes from '../CreatedQuizzes/CreatedQuizzes';
import AttemptedQuizzes from '../AttemptedQuizzes/AttemptedQuizzes';
import EditQuiz from '../EditQuiz/EditQuiz';

function PreviousQuestions() { return <div>Previous Questions Page</div>; }

const drawerWidth = 240;
const navbarHeight = 64;

function Layout(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const container = window !== undefined ? () => window().document.body : undefined;
    const location = useLocation();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawer = (
        <Box >
            <Divider />
            <Box className="flex justify-center items-center h-[100px] mt-[10px]">
                <Button variant="contained" component={Link} to="/quiz/create" style={{ padding: '10px 30px' }}>
                    Create Quiz
                </Button>
            </Box>
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/quiz/created">
                        <ListItemIcon><QuizIcon /></ListItemIcon>
                        <ListItemText primary="Created Quizzes" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/quiz/previous/quizzes">
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText primary="Attempted Quizzes" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Fab
                color="primary"
                size="medium"
                onClick={handleDrawerToggle}
                sx={{ position: 'fixed', bottom: 20, left: 16, display: { xs: 'flex', sm: 'none' }, boxShadow: 3 }}
            >
                <MenuIcon />
            </Fab>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    open
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, top: `${navbarHeight}px`, height: `calc(100% - ${navbarHeight}px)`, position: 'fixed' } }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, marginTop: `${navbarHeight}px`}}>
                <Routes>
                    <Route path="create" element={<CreateQuiz />} />
                    <Route path="created" element={<CreatedQuizzes />} />
                    <Route path="previous/quizzes" element={<AttemptedQuizzes />} />
                    <Route path=":quizId/edit" element={<EditQuiz />} />
                </Routes>
            </Box>
        </Box>
    );
}

Layout.propTypes = { window: PropTypes.func };

export default function Quiz() {
    return (
        <Box sx={{ height: '100vh', width: '100%' }}>
            <Layout />
        </Box>
    );
}
