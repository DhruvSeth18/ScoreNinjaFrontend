import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuestionWindow from "./QuestionWindow";

const TestWindow = ({
    quizAttempt,
    selectedIndex,
    setSelectedIndex,
    tempAnswers,
    setTempAnswers,
    submittedAnswers,
    handleSubmitAnswer // ✅ centralized submit handler from parent
}) => {
    const scrollRef = useRef(null);
    const [active, setActive] = useState(null);

    const questions = quizAttempt?.shuffledQuestions || [];

    // 🔹 Handle option select
    const handleSelectAnswer = (val) => {
        setTempAnswers((prev) => ({
            ...prev,
            [selectedIndex]: val
        }));
    };

    // 🔹 Handle question submit
    const handleSubmit = () => {
        handleSubmitAnswer(selectedIndex);
    };

    // 🔹 Scroll sidebar up/down
    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                top: direction === "up" ? -50 : 50,
                behavior: "smooth"
            });
            setActive(direction);
            setTimeout(() => setActive(null), 200);
        }
    };

    if (!questions.length) return null;

    return (
        <Box className="w-full h-screen flex bg-gray-50">
            {/* Sidebar */}
            <Box className="w-[60px] bg-white flex flex-col pt-[59px]">
                {/* Up button */}
                <Box
                    onClick={() => scroll("up")}
                    className={`h-[35px] flex items-center justify-center cursor-pointer ${active === "up" ? "bg-red-500" : "bg-blue-500"
                        } text-white`}
                >
                    <KeyboardArrowUpIcon fontSize="medium" />
                </Box>

                {/* Question numbers */}
                <Box
                    ref={scrollRef}
                    className="flex-1 overflow-auto shadow-lg"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex justify-center items-center h-[45px] m-[4px] rounded-lg cursor-pointer select-none transition-all duration-200 ${selectedIndex === index
                                    ? "bg-blue-500 text-white scale-105 shadow-lg"
                                    : submittedAnswers[index]
                                        ? "bg-green-200 text-gray-800 hover:bg-blue-100"
                                        : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                                }`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </Box>

                {/* Down button */}
                <Box
                    onClick={() => scroll("down")}
                    className={`h-[35px] flex items-center justify-center cursor-pointer ${active === "down" ? "bg-red-500" : "bg-blue-500"
                        } text-white`}
                >
                    <KeyboardArrowDownIcon fontSize="medium" />
                </Box>
            </Box>

            {/* Question Window */}
            <QuestionWindow
                question={questions[selectedIndex]?.questionText}
                options={questions[selectedIndex]?.options}
                selectedAnswer={tempAnswers[selectedIndex] || null}
                setSelectedAnswer={handleSelectAnswer}
                questionNumber={selectedIndex + 1}
                onSubmit={handleSubmit} // ✅ call parent submit
                submittedAnswer={submittedAnswers[selectedIndex]}
            />
        </Box>
    );
};

export default TestWindow;
