import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuestionWindow from "./QuestionWindow";

const TestWindow = ({ quizAttempt }) => {
    const scrollRef = useRef(null);
    const [active, setActive] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const questions = quizAttempt?.shuffledQuestions || [];

    // tempAnswers = currently selected answers (before submit)
    const [tempAnswers, setTempAnswers] = useState({});

    // submittedAnswers = answers already submitted (to disable submit button)
    const [submittedAnswers, setSubmittedAnswers] = useState({});

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ top: direction === "up" ? -50 : 50, behavior: "smooth" });
            setActive(direction);
            setTimeout(() => setActive(null), 200);
        }
    };

    if (!questions.length) return null;

    const handleSelectAnswer = (val) => {
        setTempAnswers(prev => ({ ...prev, [selectedIndex]: val }));
    };

    const handleSubmit = () => {
        const answer = tempAnswers[selectedIndex];
        if (!answer) return;

        console.log("✅ SUBMIT CLICKED", {
            questionNumber: selectedIndex + 1,
            question: questions[selectedIndex].questionText,
            selectedOption: answer
        });

        setSubmittedAnswers(prev => ({ ...prev, [selectedIndex]: answer }));

        // auto next
        if (selectedIndex < questions.length - 1) {
            setSelectedIndex(prev => prev + 1);
        }
    };

    return (
        <Box className="w-full h-screen flex bg-gray-50">

            {/* Sidebar */}
            <Box className="w-[60px] bg-white flex flex-col pt-[59px]">
                <Box onClick={() => scroll("up")} className={`h-[35px] flex items-center justify-center cursor-pointer ${active === "up" ? "bg-red-500" : "bg-blue-500"} text-white`}>
                    <KeyboardArrowUpIcon fontSize="medium" />
                </Box>

                <Box ref={scrollRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className="flex-1 overflow-auto shadow-lg">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex justify-center items-center h-[45px] m-[4px] rounded-lg cursor-pointer select-none transition-all duration-200 ${selectedIndex === index ? "bg-blue-500 text-white scale-105 shadow-lg" : "bg-gray-100 text-gray-800 hover:bg-blue-100"}`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </Box>

                <Box onClick={() => scroll("down")} className={`h-[35px] flex items-center justify-center cursor-pointer ${active === "down" ? "bg-red-500" : "bg-blue-500"} text-white`}>
                    <KeyboardArrowDownIcon fontSize="medium" />
                </Box>
            </Box>

            {/* Question Window */}
            <QuestionWindow
                question={questions[selectedIndex]?.questionText}
                options={questions[selectedIndex]?.options}
                selectedAnswer={tempAnswers[selectedIndex] || questions[selectedIndex]?.selectedOption || null}
                setSelectedAnswer={handleSelectAnswer}
                questionNumber={selectedIndex + 1}
                onSubmit={handleSubmit}
                alreadySubmitted={submittedAnswers[selectedIndex]}
            />
        </Box>
    );
};

export default TestWindow;
