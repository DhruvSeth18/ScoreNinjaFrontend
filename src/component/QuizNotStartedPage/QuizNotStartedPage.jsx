import { useEffect, useMemo, useState } from 'react';
import { Box, Container, Card, CardContent, Typography, Stack, Chip, Divider, Button, LinearProgress, Snackbar, Alert as MuiAlert, useMediaQuery, Grid } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useParams, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventIcon from '@mui/icons-material/Event';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getSingleQuiz, CheckQuizExist, registerQuiz, startQuiz } from '../../api/api';

dayjs.extend(utc);

const pad2 = (n) => String(n).padStart(2, '0');

const combineDateTime = (dateISO, timeStr) => {
    if (!dateISO || !timeStr) return null;
    const datePart = dayjs(dateISO).format('YYYY-MM-DD');
    return dayjs(`${datePart}T${timeStr}`);
};

const useCountdown = (targetISO) => {
    const [now, setNow] = useState(dayjs());
    useEffect(() => {
        const t = setInterval(() => setNow(dayjs()), 1000);
        return () => clearInterval(t);
    }, []);
    const target = useMemo(() => (targetISO ? dayjs(targetISO) : dayjs()), [targetISO]);
    const diff = Math.max(0, target.diff(now, 'second'));
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return { diff, days, hours, minutes, seconds, target, now };
};

const QuizNotStartedPage = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const isSmUp = useMediaQuery('(min-width:600px)');

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
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

    const fetchQuiz = async (initial = false) => {
        initial ? setLoading(true) : setRefreshing(true);
        try {
            const res = await getSingleQuiz(quizId);
            if (res?.status) {
                const list = {
                    id: res.quiz.id,
                    title: res.quiz.quizName,
                    description: res.quiz.description,
                    quizDate: res.quiz.quizDate,
                    startTime: res.quiz.startTime,
                    endTime: res.quiz.endTime,
                    duration: `${res.quiz.duration}hr`,
                    totalQuestions: res.quiz.totalMarks,
                    createdBy: res.quiz.createdBy,
                    attemptedUsersId: res.quiz.attemptedUsersId || []
                };
                if (!list) openSnackbar('Quiz not found.', 'error');
                setQuiz(list || null);
            } else openSnackbar(res?.message || 'Failed to load quiz.', 'error');
        } catch (e) {
            openSnackbar(e?.message || 'Something went wrong while loading quiz.', 'error');
        } finally {
            initial ? setLoading(false) : setRefreshing(false);
        }
    };

    const checkQuizStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !quiz) return;
            const res = await CheckQuizExist(token, quizId);
            if (res?.status) {
                setRegistered(res.isRegistered);
                setIsCreator(res.isCreator);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchQuiz(true); }, [quizId]);
    useEffect(() => { if (quiz) checkQuizStatus(); }, [quiz]);

    const startISO = useMemo(() => quiz ? combineDateTime(quiz.quizDate, quiz.startTime)?.toISOString() : null, [quiz]);
    const endISO = useMemo(() => quiz ? combineDateTime(quiz.quizDate, quiz.endTime)?.toISOString() : null, [quiz]);

    const { diff, days, hours, minutes, seconds } = useCountdown(startISO);

    const hasStarted = quiz && dayjs(startISO).isBefore(dayjs());
    const isOver = quiz && dayjs(endISO).isBefore(dayjs());
    const canRegister = quiz && !hasStarted && !isOver;
    const isLive = quiz && dayjs().isAfter(dayjs(startISO)) && dayjs().isBefore(dayjs(endISO));

    const handleRegister = async () => {
        if (!quiz) return;
        setRefreshing(true);
        try {
            const res = await registerQuiz(quiz.id);
            if (res.status) {
                setRegistered(true);
                openSnackbar(res.message || 'Registered successfully!', 'success');
            } else {
                openSnackbar(res.message || 'Failed to register', 'error');
            }
        } catch (e) {
            openSnackbar(e?.message || 'Something went wrong', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    const handleStartQuiz = async () => {
        if (!quiz) return;
        setRefreshing(true);
        try {
            const res = await startQuiz(quizId);
            if (res.status) {
                openSnackbar(res.message || 'Quiz started!', 'success');
                navigate(`/test/?quizId=${quiz.id}`);
            } else {
                openSnackbar(res.message || 'Cannot start quiz', 'error');
            }
        } catch (e) {
            openSnackbar(e?.message || 'Something went wrong', 'error');
        } finally {
            setRefreshing(false);
        }
    };

    const handleEditQuiz = () => { navigate(`/quiz/${quizId}/edit`); };

    if (loading) return (
        <Box sx={{ height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f0f4f8 0%, #d9e2ec 100%)' }}>
            <Typography variant="h6">Loading quiz details…</Typography>
        </Box>
    );

    if (!quiz) return (
        <Box sx={{ height: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, background: 'linear-gradient(180deg, #f0f4f8 0%, #d9e2ec 100%)' }}>
            <Card sx={{ maxWidth: 560, width: '100%', borderRadius: 3, p: 2, boxShadow: 6 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>Quiz not found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>We couldn’t find the quiz you’re looking for.</Typography>
                    <Button variant="contained" onClick={() => navigate(-1)} sx={{ borderRadius: 2 }}>Go Back</Button>
                </CardContent>
            </Card>
        </Box>
    );

    return (
        <Box className='bg-gray-50' sx={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: { xs: 8, md: 4 }, px: { xs: 0, md: 3 } }}>
            <Container maxWidth="md" disableGutters sx={{ width: '100%', display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
                <Card sx={{ width: '100%', height: { xs: '100svh', md: 'auto' }, maxWidth: { xs: '100%', md: 840 }, borderRadius: { xs: 0, md: 4 }, boxShadow: { xs: 'none', md: 8 }, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', overflowY: { xs: 'auto', md: 'visible' }, p: { xs: 2, sm: 3 } }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 2 }}>
                            <Typography variant={isSmUp ? 'h3' : 'h4'} fontWeight="bold" sx={{ textAlign: { xs: 'center', md: 'left' }, background: 'linear-gradient(90deg, #4b6cb7, #182848)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', wordBreak: 'break-word' }}>{quiz.title || 'Quiz'}</Typography>
                            <Chip label={isOver ? 'Over' : isLive ? 'Live' : 'Not started'} color={isOver ? 'error' : isLive ? 'warning' : 'info'} size="medium" variant="outlined" sx={{ fontWeight: 700, alignSelf: { xs: 'center', md: 'flex-start' } }} />
                        </Stack>

                        {/* Creator Message */}
                        {isCreator && (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <Typography variant="body1" fontWeight={600} color="primary">You created this quiz.</Typography>
                                <Button variant="outlined" size="small" onClick={handleEditQuiz} sx={{ ml: 1 }}>Edit Quiz</Button>
                            </Stack>
                        )}

                        {/* Info */}
                        {!isLive && !isOver && !isCreator && (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, justifyContent: 'center', textAlign: 'center' }}>
                                <InfoOutlinedIcon fontSize="small" />
                                <Typography variant="body1" fontWeight={600}>
                                    {registered ? 'You are already registered for this quiz.' : 'This quiz hasn’t started yet. You can register now.'}
                                </Typography>
                            </Stack>
                        )}

                        {/* Countdown */}
                        {!isLive && !isOver && !isCreator && (
                            <Card sx={{ mt: 1.5, borderRadius: 3, p: { xs: 1.5, sm: 2 }, background: 'linear-gradient(90deg, rgba(75,108,183,0.08), rgba(24,40,72,0.08))' }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 2 }} alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <AccessTimeIcon />
                                        <Typography variant="subtitle1" fontWeight={700}>Starts in</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={{ xs: 0.75, sm: 1.25 }} alignItems="center" sx={{ fontVariantNumeric: 'tabular-nums', flexWrap: 'wrap', rowGap: 0.5, justifyContent: 'center' }}>
                                        <TimeBlock label="Days" value={days} compact={!isSmUp} />
                                        <Sep />
                                        <TimeBlock label="Hours" value={pad2(hours)} compact={!isSmUp} />
                                        <Sep />
                                        <TimeBlock label="Minutes" value={pad2(minutes)} compact={!isSmUp} />
                                        <Sep />
                                        <TimeBlock label="Seconds" value={pad2(seconds)} compact={!isSmUp} />
                                    </Stack>
                                </Stack>
                                <LinearProgress variant="determinate" value={targetPercentage(diff)} sx={{ mt: 1.5, height: 10, borderRadius: 999 }} />
                            </Card>
                        )}

                        {/* Facts */}
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={6} md={6}><Fact icon={<EventIcon />} label="Schedule" value={`${dayjs(quiz.quizDate).format('DD MMM YYYY')} • ${quiz.startTime} → ${quiz.endTime}`} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><Fact icon={<AccessTimeIcon />} label="Time Limit" value={quiz.duration || '—'} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><Fact icon={<ListAltIcon />} label="Total Questions" value={quiz.totalQuestions ?? '—'} /></Grid>
                            </Grid>
                        </Box>

                        {/* Description */}
                        {quiz.description && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, textAlign: { xs: 'center', md: 'left' } }}>Description</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', textAlign: { xs: 'center', md: 'left' }, wordBreak: 'break-word' }}>{quiz.description}</Typography>
                            </>
                        )}

                        <Box sx={{ flex: 1 }} />

                        {/* Actions */}
                        {!isCreator && (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3, pb: { xs: 2, md: 0 }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                {isLive && registered ? (
                                    <Button variant="contained" color="success" onClick={handleStartQuiz} startIcon={<PlayArrowIcon />} sx={{ borderRadius: 2, px: 3, py: 1.5 }}>
                                        {refreshing ? 'Starting…' : 'Start Quiz'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleRegister}
                                        disabled={!canRegister || registered || refreshing}
                                        startIcon={<CheckCircleIcon />}
                                        sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                                    >
                                        {refreshing ? 'Registering…' : registered ? 'Registered' : 'Register'}
                                    </Button>
                                )}
                                <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderRadius: 2, px: 3, py: 1.5 }}>Back</Button>
                                {refreshing && !registered ? (
                                    <Button variant="outlined" disabled startIcon={<RefreshIcon />} sx={{ borderRadius: 2, px: 3, py: 1.5 }}>Refreshing…</Button>
                                ) : (
                                    <Button variant="text" startIcon={<RefreshIcon />} onClick={() => fetchQuiz(false)} sx={{ borderRadius: 2, px: 3, py: 1.5 }}>Refresh</Button>
                                )}
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            </Container>

            <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">{snackbarMsg}</MuiAlert>
            </Snackbar>
        </Box>
    );
};

// Helpers
const TimeBlock = ({ label, value, compact = false }) => (
    <Stack alignItems="center" spacing={0.25} sx={{ minWidth: compact ? 56 : 72, px: 0.5, py: 0.5, background: 'rgba(75,108,183,0.06)', borderRadius: 1 }}>
        <Typography variant={compact ? 'h5' : 'h4'} fontWeight={800}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
    </Stack>
);

const Sep = () => <Typography variant="h5" sx={{ opacity: 0.5, mx: 0.25 }}>:</Typography>;

const Fact = ({ icon, label, value }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{
        background: 'rgba(0,0,0,0.03)', px: 2, py: 1.25, borderRadius: 2,
        transition: 'transform .12s ease, boxShadow .12s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{icon}</Box>
        <Stack sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{label}</Typography>
            <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>{value}</Typography>
        </Stack>
    </Stack>
);

const targetPercentage = (diff) => Math.min(100, ((1 - diff / Math.max(1, diff + 1)) * 100));

export default QuizNotStartedPage;
