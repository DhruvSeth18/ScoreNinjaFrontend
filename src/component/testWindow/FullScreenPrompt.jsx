import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Alert } from "@mui/material";

const FullScreenPrompt = () => {
    const [open, setOpen] = useState(false);
    const [warningOpen, setWarningOpen] = useState(false);
    const [timer, setTimer] = useState(20);
    const [disturbanceCount, setDisturbanceCount] = useState(-1);
    const [lastViolation, setLastViolation] = useState("");

    useEffect(() => {
        const checkFullScreen = () => {
            if (!document.fullscreenElement) {
                setOpen(true);
                setTimer(20);
                setDisturbanceCount((prev) => prev + 1);
            }
        };

        document.addEventListener("fullscreenchange", checkFullScreen);
        checkFullScreen();

        return () => document.removeEventListener("fullscreenchange", checkFullScreen);
    }, []);

    useEffect(() => {
        let interval;
        if (open && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            requestFullScreen();
        }

        return () => clearInterval(interval);
    }, [open, timer]);

    // Detect Window Focus Loss (User switching tabs or clicking outside)
    useEffect(() => {
        const handleFocusLoss = () => {
            setDisturbanceCount((prev) => prev + 1);
            setLastViolation("Switching windows is not allowed!");
            setWarningOpen(true);
        };
        window.addEventListener("blur", handleFocusLoss);
        return () => window.removeEventListener("blur", handleFocusLoss);
    }, []);

    // Detect Suspicious Keyboard Shortcuts
    const detectSuspiciousKeys = (event) => {
        const forbiddenKeys = {
            "Control+c": "Copying is not allowed!",
            "Control+v": "Pasting is not allowed!",
            "Control+x": "Cutting is not allowed!",
            "Alt+Tab": "Switching tabs is not allowed!",
            "Control+Shift+I": "Inspecting elements is not allowed!",
            "Control+Shift+J": "Opening DevTools is not allowed!",
            "F12": "Using Developer Tools is not allowed!"
        };

        let keyCombo = event.key;
        if (event.ctrlKey) keyCombo = `Control+${keyCombo}`;
        if (event.altKey) keyCombo = `Alt+${keyCombo}`;
        if (event.shiftKey) keyCombo = `Shift+${keyCombo}`;

        if (forbiddenKeys[keyCombo]) {
            event.preventDefault();
            setDisturbanceCount((prev) => prev + 1);
            setLastViolation(forbiddenKeys[keyCombo]);
            setWarningOpen(true);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", detectSuspiciousKeys);
        return () => document.removeEventListener("keydown", detectSuspiciousKeys);
    }, []);

    const requestFullScreen = () => {
        document.documentElement.requestFullscreen();
        setOpen(false);
    };

    return (
        <>
            {/* Fullscreen Prompt Dialog */}
            <Dialog open={open} disableEscapeKeyDown>
                <Box sx={{ width: 400, p: 3, textAlign: "center" }}>
                    <DialogTitle>Full Screen Required</DialogTitle>
                    <DialogContent>
                        <Alert className="flex justify-center items-center" severity="warning" sx={{ mb: 2 }}>
                            <p>Exam will be Auto Submitted in <strong>{timer} </strong></p>
                        </Alert>
                        <Typography variant="body1" color="error" sx={{ fontWeight: "bold" }}>
                            Disturbances detected: {disturbanceCount}/5
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
                            <Button variant="contained" size="large" onClick={requestFullScreen}>
                                Enter Full Screen
                            </Button>
                        </Box>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Warning Dialog for Suspicious Activity */}
            <Dialog open={warningOpen}>
                <Box sx={{ width: 400, p: 3, textAlign: "center" }}>
                    <DialogTitle>Suspicious Activity Detected</DialogTitle>
                    <DialogContent>
                        <Alert className="flex justify-center items-center" severity="error" sx={{ mb: 2 }}>
                            <p>{lastViolation}</p>
                        </Alert>

                        <Typography variant="body1" color="error">
                            Your actions are being monitored. Please focus on the exam.
                        </Typography>
                        <Typography variant="body1" color="error" sx={{ fontWeight: "bold",mt:1 }}>
                            Disturbances detected: {disturbanceCount}/5
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" color="error" size="large" onClick={() => setWarningOpen(false)}>
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
