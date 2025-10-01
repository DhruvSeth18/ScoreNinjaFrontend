import React from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton, Chip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const sampleQuizzes = [
    { id: 1, title: "Math Quiz 1", description: "Basic algebra and geometry questions", date: "2025-10-01", startTime: "10:00 AM", endTime: "10:30 AM", duration: "30m", totalQuestions: 10 },
    { id: 2, title: "Science Quiz 2", description: "Physics and Chemistry basics", date: "2025-10-02", startTime: "11:00 AM", endTime: "11:30 AM", duration: "30m", totalQuestions: 8 },
    { id: 3, title: "History Quiz 3", description: "World history questions", date: "2025-10-03", startTime: "12:00 PM", endTime: "12:45 PM", duration: "45m", totalQuestions: 12 },
];

const CreatedQuizzes = () => {
    const navigate = useNavigate();
    const now = dayjs();

    const getQuizStatus = (quiz) => {
        const endDateTime = dayjs(`${quiz.date} ${quiz.endTime}`);
        return endDateTime.isBefore(now) ? 'Over' : 'Upcoming';
    };

    return (
        <Box className="flex flex-col items-center pt-[40px] md:p-[50px] gap-6 bg-gray-50">

            {/* Page Title */}
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ 
                    mb: 4, 
                    textAlign: 'center', 
                    background: 'linear-gradient(90deg, #4b6cb7, #182848)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                }}
            >
                📚 Created Quizzes
            </Typography>

            {/* Cards */}
            {sampleQuizzes.map((quiz) => {
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                
                                {/* Title with responsive truncation */}
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    sx={{
                                        maxWidth: { xs: 150, sm: 'auto' },
                                        whiteSpace: { xs: 'nowrap', sm: 'normal' },
                                        overflow: { xs: 'hidden', sm: 'visible' },
                                        textOverflow: { xs: 'ellipsis', sm: 'clip' },
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

                            {/* Description with responsive truncation */}
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={1}
                                sx={{
                                    maxWidth: { xs: 200, sm: 'auto' },
                                    whiteSpace: { xs: 'nowrap', sm: 'normal' },
                                    overflow: { xs: 'hidden', sm: 'visible' },
                                    textOverflow: { xs: 'ellipsis', sm: 'clip' },
                                }}
                            >
                                {quiz.description}
                            </Typography>

                            <Divider className='hidden md:block' sx={{ my: 1 }} />

                            {/* Horizontal row for Date | Start | End | Duration */}
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap', color: 'text.secondary', fontSize: '0.875rem' }}>
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

                            {/* Arrow Button */}
                            <IconButton
                                onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
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
                );
            })}
        </Box>
    );
};

export default CreatedQuizzes;
