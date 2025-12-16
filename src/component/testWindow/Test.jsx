import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import TestNavbar from "./TestNavbar";
import TestWindow from "./TestWindow";
import FullScreenPrompt from "./FullScreenPrompt";

import { startQuiz, submitAnswer } from "../../api/api";

const Test = () => {
    const [searchParams] = useSearchParams();
    const quizId = searchParams.get("quizId");

    const [apiData, setApiData] = useState(null);
    const [showLoader, setShowLoader] = useState(true);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tempAnswers, setTempAnswers] = useState({});
    const [submittedAnswers, setSubmittedAnswers] = useState({});
    const [showOverview, setShowOverview] = useState(false);

    /* ---------------- START QUIZ ---------------- */
    useEffect(() => {
        const init = async () => {
            try {
                const res = await startQuiz(quizId);

                if (!res?.status) {
                    console.error(res?.message || "Start quiz failed");
                    return;
                }

                setApiData(res);

                // 🔁 Restore previous answers (refresh safe)
                const temp = {};
                const submitted = {};

                res.attempt.shuffledQuestions.forEach((q, index) => {
                    if (q.selectedOption) {
                        temp[index] = q.selectedOption;
                        submitted[index] = q.selectedOption;
                    }
                });

                setTempAnswers(temp);
                setSubmittedAnswers(submitted);

            } catch (err) {
                console.error("API error:", err);
            }
        };

        init();

        // Loader
        const timer = setTimeout(() => setShowLoader(false), 1500);
        return () => clearTimeout(timer);

    }, [quizId]);

    /* ---------------- SUBMIT SINGLE ANSWER ---------------- */
    const handleSubmitAnswer = async (index) => {
        if (!apiData) return;

        const question = apiData.attempt.shuffledQuestions[index];
        const selected = tempAnswers[index];

        if (!selected) return;

        try {
            const res = await submitAnswer(
                apiData.attempt.id,
                question.id,
                selected
            );

            if (res?.status) {
                setSubmittedAnswers((prev) => ({
                    ...prev,
                    [index]: selected
                }));

                // Auto next question
                if (index < apiData.attempt.shuffledQuestions.length - 1) {
                    setSelectedIndex(index + 1);
                }
            }
        } catch (err) {
            console.error("Submit answer error:", err);
        }
    };

    /* ---------------- LOADER ---------------- */
    if (showLoader || !apiData) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    zIndex: 9999
                }}
            >
                <CircularProgress size={70} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative", minHeight: "100vh" }}>

            {/* 🔒 FULLSCREEN + DISTURBANCE GUARD */}
            <FullScreenPrompt
                quizId={quizId}
                attemptId={apiData.attempt.id}
                initialDisturbance={apiData.attempt.totalDisturbance || 0}
            />

            {/* 🧭 NAVBAR */}
            <TestNavbar
                apiData={apiData}
                attemptedCount={Object.keys(submittedAnswers).length}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                showOverview={showOverview}
                setShowOverview={setShowOverview}
                submittedAnswers={submittedAnswers}
            />

            {/* 📝 TEST WINDOW */}
            <TestWindow
                quizAttempt={apiData.attempt}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                tempAnswers={tempAnswers}
                setTempAnswers={setTempAnswers}
                submittedAnswers={submittedAnswers}
                handleSubmitAnswer={handleSubmitAnswer}
            />
        </Box>
    );
};

export default Test;
