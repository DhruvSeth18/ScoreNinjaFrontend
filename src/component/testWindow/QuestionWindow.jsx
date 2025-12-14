import React from "react";
import { Box, Typography, Card, Button } from "@mui/material";

const OptionCard = ({ option, isSelected, onSelect }) => {
    return (
        <Card
            onClick={() => onSelect(option)}
            style={{ borderRadius: "15px" }}
            className={`inline-flex p-6 border-2 shadow-md cursor-pointer transition-all duration-200 items-center min-w-[500px] ${isSelected ? "bg-blue-50 border-blue-500 shadow-lg" : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
        >
            <span className={`w-5 h-5 mr-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"}`} />
            <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-800"}`}>{option}</span>
        </Card>
    );
};

const QuestionCard = ({ number, question, options, selectedAnswer, setSelectedAnswer }) => (
    <Box className="flex flex-col gap-[30px]">
        <Card className="p-6 rounded-xl shadow-xl">
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                Question {number}
            </Typography>
            <Typography className="text-gray-800 text-lg">{question}</Typography>
        </Card>

        <Box className="flex flex-col gap-3">
            {options.map((opt, i) => (
                <OptionCard key={i} option={opt} isSelected={selectedAnswer === opt} onSelect={setSelectedAnswer} />
            ))}
        </Box>
    </Box>
);

const QuestionWindow = ({ question, options, selectedAnswer, setSelectedAnswer, questionNumber, onSubmit, alreadySubmitted }) => {

    const submitDisabled = alreadySubmitted === selectedAnswer && Boolean(alreadySubmitted);

    return (
        <Box className="w-full p-[30px] mt-[55px] overflow-y-auto flex-1" sx={{ position: "relative" }}>
            <QuestionCard number={questionNumber} question={question} options={options} selectedAnswer={selectedAnswer} setSelectedAnswer={setSelectedAnswer} />

            <Button
                variant="contained"
                size="large"
                onClick={onSubmit}
                disabled={submitDisabled}
                sx={{ position: "absolute", bottom: "40px", right: "50px", px: 5, py: 1.5, fontSize: "16px", borderRadius: "12px" }}
            >
                Submit
            </Button>
        </Box>
    );
};

export default QuestionWindow;
