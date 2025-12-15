import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    IconButton,
    Chip,
    Snackbar,
    Alert as MuiAlert,
    Button,
    Stack,
    LinearProgress
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAttemptedQuizzes } from '../../api/api';

const AttemptedQuizzes = () => {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // Fetch with minimum 1s delay
    const fetchQuizzes = async ({ initial = false } = {}) => {
        if (initial) setLoading(true);
        else setRefreshing(true);

        const minDelay = 1000;
        const startTime = Date.now();

        try {
            const res = await getAttemptedQuizzes();

            const elapsed = Date.now() - startTime;
            const remaining = minDelay - elapsed > 0 ? minDelay - elapsed : 0;
            await new Promise(resolve => setTimeout(resolve, remaining));

            if (res?.status) {
                setQuizzes(res.attempts || []);
                if (!initial)
                    openSnackbar(
                        res.attempts?.length
                            ? `Loaded ${res.attempts.length} quiz${res.attempts.length > 1 ? 'zes' : ''}.`
                            : 'No attempted quizzes found.',
                        'success'
                    );
            } else {
                openSnackbar(res?.message || 'Failed to load quizzes', 'error');
            }
        } catch (err) {
            openSnackbar('Something went wrong while fetching quizzes', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQuizzes({ initial: true });
    }, []);

    const handleRedirect = (attempt) => {
        if (attempt.status === 'REGISTERED' || attempt.status === 'IN_PROGRESS') {
            navigate(`/quiz/${attempt.quizId}/wait`);
        }
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-[80vh]">
                <Typography variant="h6">Loading attempted quizzes...</Typography>
            </Box>
        );
    }

    return (
        <Box
            className="pt-[130px]"
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
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '90%', maxWidth: 900 }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        background: 'linear-gradient(90deg, #4b6cb7, #182848)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    ✅ Attempted Quizzes
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ borderRadius: 2 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => fetchQuizzes({ initial: false })}
                        disabled={refreshing}
                        sx={{ borderRadius: 2 }}
                    >
                        {refreshing ? 'Refreshing…' : 'Refresh'}
                    </Button>
                </Stack>
            </Stack>

            {refreshing && (
                <LinearProgress sx={{ width: '90%', maxWidth: 900, borderRadius: 999 }} />
            )}

            {quizzes.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '60vh',
                        width: '100%',
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        No attempted quizzes found.
                    </Typography>
                </Box>
            ) : (
                quizzes.map((attempt) => (
                    <Card
                        key={attempt.id}
                        sx={{
                            width: '90%',
                            maxWidth: 900,
                            borderRadius: 3,
                            p: 1.5,
                            boxShadow: 4,
                            position: 'relative',
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(6px)',
                            cursor:
                                attempt.status === 'REGISTERED' || attempt.status === 'IN_PROGRESS'
                                    ? 'pointer'
                                    : 'default',
                        }}
                    >
                        <CardContent onClick={() => handleRedirect(attempt)}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    Quiz Attempt
                                </Typography>
                                <Chip
                                    label={attempt.status}
                                    color={attempt.status === 'COMPLETED' ? 'success' : 'warning'}
                                    size="small"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="body2" color="text.secondary">
                                Date: {dayjs(attempt.createdAt).format('DD MMM YYYY')}
                            </Typography>

                            <Typography variant="body2" mt={0.5}>
                                Score: <strong>{attempt.marksObtained}</strong> / {attempt.numberOfQuestion}
                            </Typography>

                            <Typography variant="body2" color="primary">
                                Percentage: <strong>{attempt.percentage}%</strong>
                            </Typography>

                            <Typography
                                variant="body2"
                                mt={0.5}
                                color={attempt.result === 'PASS' ? 'green' : 'error'}
                            >
                                Result: <strong>{attempt.result}</strong>
                            </Typography>

                            {(attempt.status === 'REGISTERED' || attempt.status === 'IN_PROGRESS') && (
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 24,
                                        transform: 'translateY(-50%)',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                    }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <MuiAlert severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMsg}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default AttemptedQuizzes;
