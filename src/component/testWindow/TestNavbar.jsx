import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const TestNavbar = ({ apiData }) => {

    /* ================= API EMPTY BLOCK ================= */
    const isApiEmpty = !apiData || Object.keys(apiData).length === 0;

    if (isApiEmpty) {
        return (
            <Dialog open disableEscapeKeyDown>
                <DialogContent sx={{ textAlign: "center", p: 4 }}>
                    <Typography fontWeight="bold" fontSize={18}>
                        Quiz data not loaded
                    </Typography>
                    <Typography mt={1}>
                        Please refresh to continue
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    /* ================= DATA ================= */
    const attempt = apiData.attempt;
    const user = apiData.user;

    const totalQuestions = attempt?.shuffledQuestions?.length || 0;
    const attemptedCount =
        attempt?.attemptedQuestions?.filter(q => q.selectedOption !== null).length || 0;

    const [timeLeft, setTimeLeft] = useState(0);
    const [examOver, setExamOver] = useState(false);

    /* ================= TIMER LOGIC ================= */
    useEffect(() => {
        if (!attempt?.quizStartTime || !attempt?.duration || !attempt?.endTime) {
            setTimeLeft(0);
            return;
        }

        const quizStart = new Date(attempt.quizStartTime);

        // ⏱ duration based end
        const durationEnd = new Date(
            quizStart.getTime() + attempt.duration * 60 * 60 * 1000
        );

        // ⏰ window endTime (like 07:00)
        const windowEnd = new Date(quizStart);
        const [eh, em] = attempt.endTime.split(":");
        windowEnd.setHours(parseInt(eh), parseInt(em), 0, 0);

        // 🔥 final end time
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

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    /* ================= AUTO SUBMIT (FAKE) ================= */
    useEffect(() => {
        if (examOver) {
            console.log("🛑 EXAM AUTO SUBMITTED");
            console.log("User:", user?.username);
            console.log("Attempt ID:", attempt?.id);
        }
    }, [examOver]);

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
                        
                        {/* HOME */}
                        <HomeIcon
                            sx={{
                                position: "absolute",
                                left: 10,
                                fontSize: 36,
                                color: "#1976d2",
                                cursor: "pointer"
                            }}
                        />

                        {/* TIMER */}
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

                        {/* QUESTION COUNT */}
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

                        {/* ✅ USERNAME — FIXED */}
                        <Typography
                            sx={{
                                position: "absolute",
                                right: "6rem",
                                fontWeight: 700,
                                fontSize: 15,
                                color: "#000",       // 🔥 PURE BLACK
                                letterSpacing: "0.3px"
                            }}
                        >
                            {user?.username || "User"}
                        </Typography>

                        {/* AVATAR */}
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
                        onClick={() => window.location.reload()}
                    >
                        Exit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TestNavbar;
