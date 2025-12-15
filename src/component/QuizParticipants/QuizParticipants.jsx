import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    LinearProgress,
    Chip,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizParticipants } from "../../api/api";

const QuizParticipants = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();

    const [participants, setParticipants] = useState([]);
    const [quizName, setQuizName] = useState("");

    useEffect(() => {
        const fetchParticipants = async () => {
            const res = await getQuizParticipants(quizId);
            if (res.status) {
                setParticipants(res.participants);
                setQuizName(res.quizName);
            }
        };
        fetchParticipants();
    }, [quizId]);

    return (
        <Box className="w-full min-h-screen bg-gray-50 md:p-[80px]">
            <Box className="max-w-4xl mx-auto px-6 py-8">

                {/* Header */}
                <Box className="flex items-center gap-3 mb-8">
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <EmojiEventsIcon sx={{ fontSize: 34, color: "#2563eb" }} />
                    <Typography variant="h4" fontWeight="bold" className="text-blue-700">
                        {quizName} – Participants
                    </Typography>
                </Box>

                {/* Participants List */}
                <Box className="flex flex-col gap-4">
                    {participants.map((p, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-5 rounded-2xl shadow-md bg-white/90">

                                {/* Top Row */}
                                <Box className="flex justify-between items-center mb-3">
                                    <Box>
                                        <Typography fontWeight="700">{p.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {p.email}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={p.result}
                                        color={p.result === "PASS" ? "success" : "error"}
                                        variant="outlined"
                                    />
                                </Box>

                                {/* Progress Bar */}
                                <Box className="mb-2">
                                    <LinearProgress
                                        variant="determinate"
                                        value={p.percentage}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                        }}
                                    />
                                </Box>

                                {/* Bottom Row */}
                                <Box className="flex justify-between items-center text-sm text-gray-600 mt-2">
                                    <Typography>
                                        Marks: <b>{p.marksObtained}</b> / {p.numberOfQuestion}
                                    </Typography>
                                    <Typography>
                                        {p.percentage}%
                                    </Typography>
                                </Box>

                            </Card>
                        </motion.div>
                    ))}

                    {participants.length === 0 && (
                        <Typography textAlign="center" color="text.secondary">
                            No participants yet.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default QuizParticipants;
