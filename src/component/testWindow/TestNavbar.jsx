import React, { useEffect, useState, useRef } from "react";
import {
    AppBar,
    Toolbar,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Box
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { submitQuiz } from "../../api/api";

const TestNavbar = ({
    apiData,
    attemptedCount,
    selectedIndex,
    setSelectedIndex,
    showOverview,
    setShowOverview,
    submittedAnswers
}) => {
    const navigate = useNavigate();
    const attempt = apiData?.attempt;
    const user = apiData?.user;
    const questions = attempt?.shuffledQuestions || [];
    const totalQuestions = questions.length;

    const [timeLeft, setTimeLeft] = useState(0);
    const [examOver, setExamOver] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const submitOnceRef = useRef(false);

    const isApiEmpty = !apiData || Object.keys(apiData).length === 0;

    /* ================= TIMER LOGIC ================= */
    useEffect(() => {
        if (!attempt?.quizStartTime || !attempt?.duration || !attempt?.endTime) {
            setTimeLeft(0);
            return;
        }

        const quizStart = new Date(attempt.quizStartTime);
        const durationEnd = new Date(quizStart.getTime() + attempt.duration * 60 * 60 * 1000);
        const windowEnd = new Date(quizStart);
        const [eh, em] = attempt.endTime.split(":");
        windowEnd.setHours(parseInt(eh), parseInt(em), 0, 0);

        const finalEndTime = durationEnd < windowEnd ? durationEnd : windowEnd;

        const interval = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((finalEndTime - now) / 1000);

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                setExamOver(true);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [attempt]);

    /* ================= AUTO SUBMIT ================= */
    useEffect(() => {
        if (!examOver) return;
        if (submitOnceRef.current) return;

        submitOnceRef.current = true;

        const autoSubmitQuiz = async () => {
            try {
                console.log("🛑 AUTO SUBMIT STARTED");

                const res = await submitQuiz(attempt.quizId);

                if (res.status) {
                    console.log("✅ QUIZ AUTO SUBMITTED");
                } else {
                    console.error("❌ AUTO SUBMIT FAILED:", res.message);
                }
            } catch (err) {
                console.error("❌ AUTO SUBMIT ERROR:", err);
            }
        };

        autoSubmitQuiz();
    }, [examOver, attempt]);

    const handleSubmitClick = () => {
        setShowConfirmSubmit(true);
    };

    const confirmSubmit = async () => {
        try {
            const res = await submitQuiz(attempt.quizId);
            if (res.status) {
                navigate("/quiz/attempted/quizzes");
            } else {
                console.error("❌ Submit failed:", res.message);
            }
        } catch (err) {
            console.error("❌ Submit error:", err);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    if (isApiEmpty) {
        return (
            <Dialog open disableEscapeKeyDown>
                <DialogContent sx={{ textAlign: "center", p: 3, pl: 6, pr: 6 }}>
                    <Typography fontWeight="bold" fontSize={18}>
                        Quiz data not loaded
                    </Typography>
                    <Typography mt={1}>Please refresh to continue</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/quiz/attempted/quizzes")}
                    >
                        GO BACK
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "white",
                    height: 60,
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.2)"
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ position: "relative", height: 60 }}>
                        <HomeIcon
                            sx={{
                                position: "absolute",
                                left: 10,
                                fontSize: 36,
                                color: "#1976d2",
                                cursor: "pointer"
                            }}
                            onClick={() => setShowOverview(true)}
                        />

                        <Typography
                            sx={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: 26,
                                fontWeight: "bold",
                                color: timeLeft <= 300 ? "red" : "#111"
                            }}
                        >
                            {formatTime(timeLeft)}
                        </Typography>

                        <Typography
                            sx={{
                                position: "absolute",
                                right: "12rem",
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#1976d2"
                            }}
                        >
                            {attemptedCount}/{totalQuestions}
                        </Typography>

                        <Typography
                            sx={{
                                position: "absolute",
                                right: "6rem",
                                fontWeight: 700,
                                fontSize: 15,
                                color: "#000"
                            }}
                        >
                            {user?.username || "User"}
                        </Typography>

                        <Avatar
                            sx={{ position: "absolute", right: "1rem" }}
                            src="https://cdn-icons-png.flaticon.com/512/219/219959.png"
                        />
                    </Toolbar>
                </Container>
            </AppBar>

            {/* ================= EXAM OVER DIALOG ================= */}
            <Dialog open={examOver} disableEscapeKeyDown>
                <DialogContent sx={{ textAlign: "center", p: 5, width: 420 }}>
                    <Typography fontSize={22} fontWeight="bold">
                        Exam Completed
                    </Typography>
                    <Typography mt={2}>
                        Your exam has been automatically submitted.
                    </Typography>
                    <Typography mt={1} color="error" fontWeight="bold">
                        Time is over
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/quiz/attempted/quizzes")}
                    >
                        Exit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ================= QUESTION OVERVIEW MODAL ================= */}
            <Dialog
                open={showOverview}
                onClose={() => setShowOverview(false)}
                fullScreen
                PaperProps={{ sx: { backgroundColor: "#f5f5f5" } }}
            >
                <DialogContent
                    sx={{ p: 4, display: "flex", flexDirection: "column", minHeight: "100vh" }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        mb={4}
                        textAlign="center"
                        color="primary"
                    >
                        Question Overview
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                            gap: 3,
                            flex: 1,
                            overflowY: "auto",
                            pb: 4
                        }}
                    >
                        {questions.map((q, index) => {
                            const attempted = submittedAnswers[index];
                            const isCurrent = index === selectedIndex;
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        width: "100%",
                                        aspectRatio: "1/1",
                                        borderRadius: 3,
                                        bgcolor: isCurrent ? "primary.main" : attempted ? "success.main" : "grey.400",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                                        transition: "all 0.3s ease",
                                        "&:hover": { transform: "scale(1.1)", boxShadow: "0px 6px 20px rgba(0,0,0,0.3)" },
                                        position: "relative"
                                    }}
                                    onClick={() => {
                                        setSelectedIndex(index);
                                        setShowOverview(false);
                                    }}
                                >
                                    {index + 1}
                                    {attempted && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 5,
                                                right: 5,
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                color: "white"
                                            }}
                                        >
                                            ✓
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* ================= LOWER CENTER BUTTONS ================= */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 3 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: "bold",
                                boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
                                "&:hover": { transform: "scale(1.05)" }
                            }}
                            onClick={() => setShowOverview(false)}
                        >
                            Close
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: "bold",
                                boxShadow: "0px 3px 15px rgba(0,0,0,0.3)",
                                "&:hover": { transform: "scale(1.05)", boxShadow: "0px 6px 20px rgba(0,0,0,0.4)" }
                            }}
                            onClick={() => setShowConfirmSubmit(true)}
                        >
                            Submit Quiz
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* ================= CONFIRM SUBMIT DIALOG ================= */}
            <Dialog open={showConfirmSubmit} onClose={() => setShowConfirmSubmit(false)}>
                <DialogContent sx={{ textAlign: "center", p: 4, minWidth: 350 }}>
                    <Typography fontSize={18} fontWeight="bold">
                        Are you sure you want to submit the paper?
                    </Typography>
                    <Typography mt={2}>
                        Attempted: {attemptedCount} / {totalQuestions}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
                    <Button variant="outlined" size="large" onClick={() => setShowConfirmSubmit(false)}>
                        No
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={confirmSubmit}
                    >
                        Yes, Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TestNavbar;
