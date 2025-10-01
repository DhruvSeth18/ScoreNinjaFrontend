import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuestionWindow from "./QuestionWindow";
import questions from "../Utils/Questions"; // 35 questions array

const TestWindow = () => {
    const scrollRef = useRef(null);
    const [active, setActive] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ top: direction === "up" ? -50 : 50, behavior: "smooth" });
            setActive(direction);
            setTimeout(() => setActive(null), 200);
        }
    };

    return (
        <Box className="w-full h-screen flex bg-gray-50">
            {/* Sidebar Number Navigator */}
            <Box className="w-[60px] bg-white flex flex-col pt-[59px]">
                <Box
                    onClick={() => scroll("up")}
                    className={`h-[35px] flex items-center justify-center cursor-pointer transition-all duration-200 ${active === "up" ? "bg-red-500" : "bg-blue-500"} text-white`}
                >
                    <KeyboardArrowUpIcon style={{ fontSize: 24 }} />
                </Box>

                <Box
                    ref={scrollRef}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className="flex-1 overflow-auto shadow-lg"
                >
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex justify-center items-center h-[45px] m-[4px] rounded-lg cursor-pointer select-none transition-all duration-200 outline-none ${selectedIndex === index ? "bg-blue-500 text-white scale-105 shadow-lg" : "bg-gray-100 text-gray-800 hover:bg-blue-100"}`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </Box>

                <Box
                    onClick={() => scroll("down")}
                    className={`h-[35px] flex items-center justify-center cursor-pointer transition-all duration-200 ${active === "down" ? "bg-red-500" : "bg-blue-500"} text-white`}
                >
                    <KeyboardArrowDownIcon style={{ fontSize: 24 }} />
                </Box>
            </Box>

            {/* QuestionWindow */}
            <QuestionWindow
                question={questions[selectedIndex].question}
                options={questions[selectedIndex].options}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                questionNumber={selectedIndex + 1}
            />
        </Box>
    );
};

export default TestWindow;
