import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton, Button, Stack, LinearProgress, Snackbar, Alert as MuiAlert } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { getAllUserQuizzes } from '../../api/api';

const AttemptedQuizzes = ({ userId }) => { 
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const openSnackbar = (msg, severity = 'info') => {
        setSnackbarMsg(msg);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (_e, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Fetch quizzes with fake delay
    const fetchQuizzes = async () => {
        setRefreshing(true);
        try {
            const res = await getAllUserQuizzes(userId);

            // Fake delay of 1 second
            setTimeout(() => {
                if (res.status) {
                    setQuizzes(res.attemptedQuizzes);
                    openSnackbar('Quizzes loaded successfully', 'success');
                } else {
                    openSnackbar(res.message || 'Failed to load quizzes', 'error');
                }
                setRefreshing(false);
            }, 1000); // 1000ms = 1 second delay

        } catch (err) {
            setTimeout(() => {
                openSnackbar('Something went wrong while fetching quizzes', 'error');
                setRefreshing(false);
            }, 1000);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [userId]);

    return (
        <Box className='pt-[130px]'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pb: 5,
                gap: 3,
                minHeight: '100vh',
                width: '100%',
                backgroundColor: '#f9fafb',
            }}
        >
            {/* Header */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ width: '90%', maxWidth: 900 }}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ 
                        textAlign: { xs: 'center', md: 'left' },
                        background: 'linear-gradient(90deg, #4b6cb7, #182848)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    ✅ Attempted Quizzes
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ borderRadius: 2 }}>
                        Back
                    </Button>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchQuizzes} disabled={refreshing} sx={{ borderRadius: 2 }}>
                        {refreshing ? 'Refreshing…' : 'Refresh'}
                    </Button>
                </Stack>
            </Stack>

            {/* Loading Indicator */}
            {refreshing && <LinearProgress sx={{ width: '90%', maxWidth: 900, borderRadius: 999 }} />}

            {/* Cards or No quizzes message */}
            {quizzes.length === 0 && !refreshing ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '200px' }}>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
                        No attempted quizzes found.
                    </Typography>
                </Box>
            ) : (
                quizzes.map((quiz) => (
                    <Card
                        key={quiz.id}
                        sx={{
                            width: '90%',
                            maxWidth: 900,
                            borderRadius: 3,
                            p: 1.5,
                            boxShadow: 4,
                            position: 'relative',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(6px)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'scale(1.015)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent sx={{ pt: 2, pb: 2 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>{quiz.title}</Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>{quiz.description}</Typography>
                            <Divider className='hidden md:block' sx={{ my: 1 }} />

                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', color: 'text.secondary', fontSize: '0.875rem' }}>
                                <Typography>{quiz.date}</Typography>
                                <Typography>|</Typography>
                                <Typography>{quiz.startTime}</Typography>
                                <Typography>|</Typography>
                                <Typography>{quiz.endTime}</Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary" mt={1}>Total Questions: {quiz.totalQuestions}</Typography>
                            <Typography variant="body2" color="primary" mt={0.5}>Score: {quiz.score}</Typography>

                            <IconButton
                                onClick={() => navigate(`/quiz/${quiz.id}/view`)}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 24,
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-50%) scale(1.05)' },
                                }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))
            )}

            {/* Snackbar */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMsg}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default AttemptedQuizzes;
