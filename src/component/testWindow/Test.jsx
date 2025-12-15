import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import TestNavbar from "./TestNavbar";
import TestWindow from "./TestWindow";
import { startQuiz } from "../../api/api";
import { useSearchParams } from "react-router-dom";

const Test = () => {
    const [searchParams] = useSearchParams();
    const quizId = searchParams.get("quizId");

    const [apiData, setApiData] = useState(null);
    const [showLoader, setShowLoader] = useState(true);

    // 🔥 LIFTED STATE
    const [submittedAnswers, setSubmittedAnswers] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(0); // current question
    const [showOverview, setShowOverview] = useState(false); // Home icon modal

    useEffect(() => {
        const init = async () => {
            try {
                const res = await startQuiz(quizId);
                if (res.status) {
                    setApiData(res);
                } else {
                    console.error(res.message);
                }
            } catch (err) {
                console.error("API error:", err);
            }
        };

        init();

        // ⏳ FORCE 2 sec loader
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [quizId]);

    return (
        <Box sx={{ position: "relative", minHeight: "100vh" }}>
            {/* 🔵 FULL SCREEN LOADER */}
            {showLoader && (
                <Box
                    sx={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "white",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <CircularProgress size={70} thickness={4} color="primary" />
                </Box>
            )}

            {/* ✅ NAVBAR WITH LIVE ATTEMPT COUNT + Home Icon Modal */}
            <TestNavbar
                apiData={apiData}
                attemptedCount={Object.keys(submittedAnswers).length}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                showOverview={showOverview}
                setShowOverview={setShowOverview}
                submittedAnswers={submittedAnswers}
            />

            {/* ✅ TEST WINDOW */}
            <TestWindow
                quizAttempt={apiData?.attempt}
                submittedAnswers={submittedAnswers}
                setSubmittedAnswers={setSubmittedAnswers}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
            />
        </Box>
    );
};

export default Test;
