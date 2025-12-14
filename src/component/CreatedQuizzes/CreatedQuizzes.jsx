import { useEffect, useState } from 'react';
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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { GetMyQuizzes } from '../../api/api';

// Enable timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const CreatedQuizzes = () => {
    const navigate = useNavigate();
    const now = dayjs();

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

    // ✅ Convert "HH:mm:ss" → "hh:mm A IST"
    const formatTime = (time) => {
        if (!time) return '';
        const parsed = dayjs(`1970-01-01T${time}`).tz('Asia/Kolkata');
        return parsed.isValid() ? parsed.format('hh:mm A') : time;
    };

    // ✅ Fetch quizzes
    const fetchQuizzes = async (opts = { initial: false, showToast: true }) => {
        const { initial, showToast } = { initial: false, showToast: true, ...opts };
        if (initial) setLoading(true); else setRefreshing(true);

        const minDelay = 700;
        const startTime = Date.now();

        try {
            const response = await GetMyQuizzes();
            const elapsed = Date.now() - startTime;
            const remaining = minDelay - elapsed > 0 ? minDelay - elapsed : 0;
            await new Promise(resolve => setTimeout(resolve, remaining));

            if (response?.status) {
                const mapped = (response.data?.quizzes || []).map(q => ({
                    id: q.id,
                    title: q.quizName,
                    description: q.description,
                    date: dayjs(q.quizDate).isValid() ? dayjs(q.quizDate).format('YYYY-MM-DD') : '',
                    startTime: formatTime(q.startTime),
                    endTime: formatTime(q.endTime),
                    duration: `${q.duration}`,
                    totalQuestions: q.totalMarks
                }));
                setQuizzes(mapped);
                if (showToast)
                    mapped.length > 0
                        ? openSnackbar(`Loaded ${mapped.length} quiz${mapped.length > 1 ? 'zes' : ''}.`, 'success')
                        : openSnackbar('No quizzes found.', 'info');
            } else {
                openSnackbar(response?.message || 'Failed to fetch quizzes.', 'error');
            }
        } catch (err) {
            openSnackbar(err?.message || 'Something went wrong while fetching quizzes.', 'error');
        } finally {
            if (initial) setLoading(false); else setRefreshing(false);
        }
    };

    useEffect(() => { fetchQuizzes({ initial: true, showToast: false }); }, []);

    const getQuizStatus = (quiz) => {
        const quizEnd = dayjs(`${quiz.date} ${quiz.endTime}`, 'YYYY-MM-DD hh:mm A [IST]');
        return quizEnd.isBefore(now) ? 'Over' : 'Upcoming';
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-[80vh]">
                <Typography variant="h6">Loading quizzes...</Typography>
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
                alignItems={{ xs: 'center', md: 'center' }}
                justifyContent="space-between"
                sx={{ width: '90%', maxWidth: 900 }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        textAlign: { xs: 'center', md: 'left' },
                        background: 'linear-gradient(90deg, #4b6cb7, #182848)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    📚 Created Quizzes
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
                        onClick={() => fetchQuizzes({ initial: false, showToast: true })}
                        disabled={refreshing}
                        sx={{ borderRadius: 2 }}
                    >
                        {refreshing ? 'Refreshing…' : 'Refresh'}
                    </Button>
                </Stack>
            </Stack>

            {refreshing && <LinearProgress sx={{ width: '90%', maxWidth: 900, borderRadius: 999 }} />}

            {quizzes.length === 0 ? (
                <Box className="flex justify-center items-center h-[60vh]">
                    <Typography variant="h6" color="text.secondary">
                        No quizzes found.
                    </Typography>
                </Box>
            ) : (
                quizzes.map(quiz => {
                    const status = getQuizStatus(quiz);
                    return (
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
                                '&:hover': { transform: 'scale(1.015)', boxShadow: 6 },
                            }}
                        >
                            <CardContent sx={{ pt: 2, pb: 2 }} onClick={() => navigate(`/quiz/${quiz.id}/edit`)}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {quiz.title}
                                    </Typography>
                                    <Chip
                                        label={status}
                                        color={status === 'Over' ? 'error' : 'success'}
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mb={1}
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {quiz.description}
                                </Typography>
                                <Divider className="hidden md:block" sx={{ my: 1 }} />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        mt: 1,
                                        flexWrap: 'wrap',
                                        color: 'text.secondary',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    <Typography>{quiz.date}</Typography>
                                    {quiz.startTime && (
                                        <>
                                            <Typography>|</Typography>
                                            <Typography>{quiz.startTime}</Typography>
                                        </>
                                    )}
                                    {quiz.endTime && (
                                        <>
                                            <Typography>–</Typography>
                                            <Typography>{quiz.endTime}</Typography>
                                        </>
                                    )}
                                    <Typography>| Duration: {quiz.duration}hr</Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    Total Questions: <strong>{quiz.totalQuestions}</strong>
                                </Typography>

                                <IconButton
                                    onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 24,
                                        transform: 'translateY(-50%)',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            transform: 'translateY(-50%) scale(1.05)',
                                        },
                                    }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    );
                })
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMsg}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default CreatedQuizzes;
