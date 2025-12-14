import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Alert
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const TestNavbar = ({ apiData }) => {

    /* ================= API EMPTY CHECK ================= */
    const isApiEmpty = !apiData || Object.keys(apiData).length === 0;

    if (isApiEmpty) {
        return (
            <Dialog
                open
                disableEscapeKeyDown
                onClose={() => {}}
                maxWidth="sm"
                fullWidth
            >
                <Box
                    sx={{
                        p: 4,
                        textAlign: "center"
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                    >
                        Quiz Loading Failed
                    </DialogTitle>

                    <DialogContent sx={{ mt: 1 }}>
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                fontSize: "16px",
                                justifyContent: "center"
                            }}
                        >
                            Unable to fetch quiz data
                        </Alert>

                        <Typography
                            sx={{
                                fontSize: "16px",
                                mb: 1,
                                textAlign: "center"
                            }}
                        >
                            Your quiz session could not be restored.
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "15px",
                                fontWeight: "bold",
                                color: "error.main",
                                textAlign: "center"
                            }}
                        >
                            Please refresh the page to continue safely.
                        </Typography>
                    </DialogContent>

                    <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            sx={{
                                px: 6,
                                py: 1.2,
                                fontSize: "16px",
                                borderRadius: "8px"
                            }}
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        );
    }

    /* ================= NORMAL NAVBAR ================= */

    const attempt = apiData?.attempt;
    const user = apiData?.user;

    const totalQuestions = attempt?.shuffledQuestions?.length || 0;
    const attemptedCount =
        attempt?.attemptedQuestions?.filter(q => q.selectedOption !== null).length || 0;

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!attempt?.quizStartTime || !attempt?.endTime) {
            setTimeLeft(0);
            return;
        }

        const end = new Date(attempt.quizStartTime);
        const [h, m] = attempt.endTime.split(":");
        end.setHours(parseInt(h), parseInt(m), 0);

        const interval = setInterval(() => {
            const diff = Math.max(0, Math.floor((end - new Date()) / 1000));
            setTimeLeft(diff);
        }, 1000);

        return () => clearInterval(interval);
    }, [attempt]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || seconds <= 0) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "white",
                height: "60px",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.2)"
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ position: "relative", height: "60px" }}>

                    <HomeIcon
                        sx={{
                            position: "absolute",
                            left: "10px",
                            fontSize: "36px",
                            color: "#1976d2",
                            cursor: "pointer"
                        }}
                    />

                    <Typography
                        sx={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "26px",
                            fontWeight: "bold",
                            color: timeLeft <= 600 ? "red" : "black"
                        }}
                    >
                        {formatTime(timeLeft)}
                    </Typography>

                    <Typography
                        sx={{
                            position: "absolute",
                            right: "12rem",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#1976d2"
                        }}
                    >
                        {attemptedCount}/{totalQuestions}
                    </Typography>

                    <Typography
                        sx={{
                            position: "absolute",
                            right: "6rem",
                            fontWeight: "bold",
                            color: "black"
                        }}
                    >
                        {user?.username || "User"}
                    </Typography>

                    <Avatar
                        src="https://cdn-icons-png.flaticon.com/512/219/219959.png"
                        sx={{ position: "absolute", right: "1rem" }}
                    />

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TestNavbar;
