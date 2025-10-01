import React from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';

// Sample attempted quizzes
const attemptedQuizzes = [
    { id: 1, title: "Math Quiz 1", description: "Attempted on 2025-10-01", date: "2025-10-01", startTime: "10:00 AM", endTime: "10:30 AM", totalQuestions: 10, score: "8/10" },
    { id: 2, title: "Science Quiz 2", description: "Attempted on 2025-10-02", date: "2025-10-02", startTime: "11:00 AM", endTime: "11:30 AM", totalQuestions: 8, score: "6/8" },
    { id: 3, title: "History Quiz 3", description: "Attempted on 2025-10-03", date: "2025-10-03", startTime: "12:00 PM", endTime: "12:45 PM", totalQuestions: 12, score: "9/12" },
];

const AttemptedQuizzes = () => {
    const navigate = useNavigate();

    return (
        <Box className="flex flex-col items-center pt-[40px] md:p-[50px] gap-6 bg-gray-50">

            {/* Page Title */}
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 4, textAlign: 'center', background: 'linear-gradient(90deg, #4b6cb7, #182848)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
                ✅ Attempted Quizzes
            </Typography>

            {/* Cards */}
            {attemptedQuizzes.map((quiz) => (
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

                        {/* Horizontal row for Date | Start | End */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', color: 'text.secondary', fontSize: '0.875rem' }}>
                            <Typography>{quiz.date}</Typography>
                            <Typography>|</Typography>
                            <Typography>{quiz.startTime}</Typography>
                            <Typography>|</Typography>
                            <Typography>{quiz.endTime}</Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" mt={1}>Total Questions: {quiz.totalQuestions}</Typography>
                        <Typography variant="body2" color="primary" mt={0.5}>Score: {quiz.score}</Typography>

                        {/* Arrow Button */}
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
            ))}
        </Box>
    );
};

export default AttemptedQuizzes;
