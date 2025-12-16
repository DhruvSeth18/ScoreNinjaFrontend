import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { submitQuiz, addDisturbance } from "../../api/api";

const MAX_DISTURBANCE = 3;

const FullScreenPrompt = ({ quizId, attemptId, initialDisturbance = 0 }) => {
    const [open, setOpen] = useState(false);
    const [warningOpen, setWarningOpen] = useState(false);
    const [timer, setTimer] = useState(20);
    const [disturbanceCount, setDisturbanceCount] = useState(initialDisturbance);
    const [lastViolation, setLastViolation] = useState("");

    const navigate = useNavigate();
    const isSubmittingRef = useRef(false);

    /* ---------------- HELPER: RECORD DISTURBANCE ---------------- */
    const recordDisturbance = async (violationText) => {
        setLastViolation(violationText);
        setWarningOpen(true);

        // ⚡ Optimistic UI update
        setDisturbanceCount(prev => prev + 1);

        try {
            const res = await addDisturbance(attemptId);

            if (res.status) {
                setDisturbanceCount(res.totalDisturbance); // sync backend count
                if (res.endQuiz && !isSubmittingRef.current) {
                    isSubmittingRef.current = true;
                    await submitQuiz(quizId);
                    navigate("/quiz/attempted/quizzes", { replace: true });
                }
            }
        } catch (err) {
            console.error("Disturbance API error:", err);
            // optional: revert UI if API failed
            setDisturbanceCount(prev => prev - 1);
        }
    };

    /* ---------------- FULLSCREEN DETECTION ---------------- */
    useEffect(() => {
        let firstCheck = true; // 👈 skip initial fullscreen check

        const checkFullScreen = () => {
            if (!document.fullscreenElement) {
                if (!firstCheck) {
                    recordDisturbance("Exited fullscreen!");
                } else {
                    firstCheck = false;
                }
                setOpen(true);
                setTimer(20);
            }
        };

        document.addEventListener("fullscreenchange", checkFullScreen);
        checkFullScreen();

        return () =>
            document.removeEventListener("fullscreenchange", checkFullScreen);
    }, []);

    /* ---------------- TIMER ---------------- */
    useEffect(() => {
        if (!open || timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [open, timer]);

    /* ---------------- WINDOW BLUR ---------------- */
    useEffect(() => {
        const handleBlur = () => {
            recordDisturbance("Switching windows is not allowed!");
        };

        window.addEventListener("blur", handleBlur);
        return () => window.removeEventListener("blur", handleBlur);
    }, []);

    /* ---------------- KEYBOARD DETECTION ---------------- */
    const detectSuspiciousKeys = (event) => {
        const forbidden = {
            "Control+c": "Copy is not allowed",
            "Control+v": "Paste is not allowed",
            "Control+x": "Cut is not allowed",
            "Alt+Tab": "Switching tabs is not allowed",
            "Control+Shift+I": "DevTools not allowed",
            "Control+Shift+J": "DevTools not allowed",
            "F12": "DevTools not allowed"
        };

        let combo = event.key;
        if (event.ctrlKey) combo = `Control+${combo}`;
        if (event.altKey) combo = `Alt+${combo}`;
        if (event.shiftKey) combo = `Shift+${combo}`;

        if (forbidden[combo]) {
            event.preventDefault();
            recordDisturbance(forbidden[combo]);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", detectSuspiciousKeys);
        return () =>
            document.removeEventListener("keydown", detectSuspiciousKeys);
    }, []);

    /* ---------------- AUTO SUBMIT ON MAX DISTURBANCE OR TIMER ---------------- */
    useEffect(() => {
        if ((disturbanceCount >= MAX_DISTURBANCE || timer <= 0) && !isSubmittingRef.current) {
            isSubmittingRef.current = true;

            (async () => {
                try {
                    await submitQuiz(quizId);
                } finally {
                    setOpen(false);
                    setWarningOpen(false);
                    navigate("/quiz/attempted/quizzes", { replace: true });
                }
            })();
        }
    }, [disturbanceCount, timer, quizId, navigate]);

    /* ---------------- ENTER FULLSCREEN ---------------- */
    const requestFullScreen = () => {
        document.documentElement.requestFullscreen();
        setOpen(false);
    };

    return (
        <>
            {/* FULLSCREEN DIALOG */}
            <Dialog open={open} disableEscapeKeyDown>
                <Box sx={{ width: 420, p: 3, textAlign: "center" }}>
                    <DialogTitle sx={{ fontWeight: "bold" }}>Full Screen Required</DialogTitle>

                    <DialogContent>
                        <Typography sx={{ mb: 2 }}>
                            Exam will be <b>auto submitted</b> in
                        </Typography>

                        <Typography
                            variant="h4"
                            color="error"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                        >
                            {timer}s
                        </Typography>

                        <Typography color="error" fontWeight="bold">
                            Disturbances: {disturbanceCount}/{MAX_DISTURBANCE}
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" size="large" onClick={requestFullScreen}>
                                Enter Full Screen
                            </Button>
                        </Box>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* WARNING DIALOG */}
            <Dialog open={warningOpen}>
                <Box sx={{ width: 420, p: 3, textAlign: "center" }}>
                    <DialogTitle color="error" sx={{ fontWeight: "bold" }}>
                        Suspicious Activity Detected
                    </DialogTitle>

                    <DialogContent>
                        <Typography color="error" sx={{ mb: 2 }}>
                            {lastViolation}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            This exam is monitored strictly.
                        </Typography>

                        <Typography color="error" fontWeight="bold">
                            Disturbances: {disturbanceCount}/{MAX_DISTURBANCE}
                        </Typography>

                        {disturbanceCount === MAX_DISTURBANCE - 1 && (
                            <Typography color="error" fontWeight="bold" sx={{ mt: 1 }}>
                                ⚠️ Last Warning! Next violation will submit the exam.
                            </Typography>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setWarningOpen(false)}
                            >
                                Understood
                            </Button>
                        </Box>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
};

export default FullScreenPrompt;
