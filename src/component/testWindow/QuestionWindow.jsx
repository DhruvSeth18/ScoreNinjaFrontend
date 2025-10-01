import React from "react";
import { Box, Typography, Card, Button } from "@mui/material";


const OptionCard = ({ option, isSelected, onSelect }) => {
    return (
        <Card
            onClick={() => onSelect(option)}
            style={{ borderRadius: "15px" }}
            className={`inline-flex p-6 border-2 shadow-md cursor-pointer transition-all duration-200 items-center min-w-[500px] 
                ${isSelected ? "bg-blue-50 border-blue-500 shadow-lg" : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
        >
            <span className={`w-5 h-5 mr-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"}`}></span>
            <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-800"}`}>{option}</span>
        </Card>
    );
};

const QuestionCard = ({ number, question, options, selectedAnswer, setSelectedAnswer }) => {
    return (
        <Box className="flex flex-col gap-[30px]">
            <Card elevation={3} className="p-6 rounded-lg shadow-2xl transition-all duration-200 hover:shadow-3xl">
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                    Question {number}
                </Typography>
                <Typography variant="body1" className="text-gray-800 text-lg mb-6">
                    {question}
                </Typography>
            </Card>

            <Box className="flex flex-col gap-3">
                {options.map((opt, i) => (
                    <OptionCard
                        key={i}
                        option={opt}
                        isSelected={selectedAnswer === opt}
                        onSelect={setSelectedAnswer}
                    />
                ))}
            </Box>
        </Box>
    );
};

const QuestionWindow = ({ question, options, selectedAnswer, setSelectedAnswer, questionNumber }) => {
    return (
        <Box style={{ position: "relative" }} className="w-[100%] p-[30px] mt-[55px] overflow-y-auto flex-1">
            <QuestionCard
                number={questionNumber}
                question={question}
                options={options}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
            />
            <Button
                style={{ position: "absolute", bottom: "40px", right: "50px", scale: "1.2" }}
                variant="contained"
            >
                Submit
            </Button>
        </Box>
    );
};

export default QuestionWindow;
