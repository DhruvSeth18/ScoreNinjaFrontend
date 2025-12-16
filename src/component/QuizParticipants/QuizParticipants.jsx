import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    LinearProgress,
    Chip,
    Button,
    Stack
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizParticipants } from "../../api/api";

const QuizParticipants = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();

    const [participants, setParticipants] = useState([]);
    const [quizName, setQuizName] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const res = await getQuizParticipants(quizId);
            if (res.status) {
                setParticipants(res.participants);
                setQuizName(res.quizName);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [quizId]);

    return (
        <Box className="w-full min-h-screen bg-gray-50 md:p-[80px]">
            <Box className="max-w-4xl mx-auto px-6 py-8">

                {/* Header */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    mb={4}
                >
                    <Box className="flex items-center gap-3">
                        <EmojiEventsIcon sx={{ fontSize: 34, color: "#2563eb" }} />
                        <Typography variant="h4" fontWeight="bold" className="text-blue-700">
                            {quizName} – Participants
                        </Typography>
                    </Box>

                    {/* SAME BUTTONS AS CREATED QUIZZES */}
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
                            onClick={fetchParticipants}
                            disabled={loading}
                            sx={{ borderRadius: 2 }}
                        >
                            {loading ? "Refreshing…" : "Refresh"}
                        </Button>
                    </Stack>
                </Stack>

                {loading && <LinearProgress sx={{ mb: 3 }} />}

                {/* Participants */}
                {participants.length > 0 && (
                    <Box className="flex flex-col gap-4">
                        {participants.map((p, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="p-5 rounded-2xl shadow-md bg-white/90">
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

                                    <LinearProgress
                                        variant="determinate"
                                        value={p.percentage}
                                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                                    />

                                    <Box className="flex justify-between text-sm text-gray-600">
                                        <Typography>
                                            Marks: <b>{p.marksObtained}</b> / {p.numberOfQuestion}
                                        </Typography>
                                        <Typography>{p.percentage}%</Typography>
                                    </Box>
                                </Card>
                            </motion.div>
                        ))}
                    </Box>
                )}

                {/* Empty State */}
                {participants.length === 0 && !loading && (
                    <Box className="flex justify-center items-center h-[60vh]">
                        <Typography variant="h6" color="text.secondary">
                            No participants yet.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default QuizParticipants;
