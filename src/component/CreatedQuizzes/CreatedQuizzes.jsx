import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton, Chip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { GetMyQuizzes } from '../api/api'; // import the API function

const CreatedQuizzes = () => {
    const navigate = useNavigate();
    const now = dayjs();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            const response = await GetMyQuizzes();
            if (response.status) {
                const mappedQuizzes = response.data.quizzes.map((quiz) => ({
                    id: quiz.id,
                    title: quiz.quizName,
                    description: quiz.description,
                    date: dayjs(quiz.quizDate).format('YYYY-MM-DD'),
                    startTime: quiz.startTime,
                    endTime: quiz.endTime,
                    duration: `${quiz.duration}m`,
                    totalQuestions: quiz.totalMarks, // assuming totalMarks is total questions
                }));
                setQuizzes(mappedQuizzes);
            } else {
                console.error(response.message);
            }
            setLoading(false);
        };

        fetchQuizzes();
    }, []);

    const getQuizStatus = (quiz) => {
        const endDateTime = dayjs(`${quiz.date} ${quiz.endTime}`);
        return endDateTime.isBefore(now) ? 'Over' : 'Upcoming';
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-[80vh]">
                <Typography variant="h6">Loading quizzes...</Typography>
            </Box>
        );
    }

    return (
        <Box className="flex flex-col items-center pt-[40px] md:p-[50px] gap-6 bg-gray-50">
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                    mb: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(90deg, #4b6cb7, #182848)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                📚 Created Quizzes
            </Typography>

            {quizzes.length === 0 ? (
                <Typography>No quizzes found.</Typography>
            ) : (
                quizzes.map((quiz) => {
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
                                '&:hover': {
                                    transform: 'scale(1.015)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardContent sx={{ pt: 2, pb: 2 }} onClick={() => navigate(`/quiz/${quiz.id}/edit`)}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
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
                                    <Typography>|</Typography>
                                    <Typography>{quiz.startTime}</Typography>
                                    <Typography>|</Typography>
                                    <Typography>{quiz.endTime}</Typography>
                                    <Typography>|</Typography>
                                    <Typography>Duration: {quiz.duration}</Typography>
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
        </Box>
    );
};

export default CreatedQuizzes;
