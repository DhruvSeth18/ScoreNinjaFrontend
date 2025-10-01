import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Card, Typography, TextField, IconButton, Divider, Slide, TextareaAutosize } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const CreateQuiz = () => {
    const [labName, setLabName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [durationHours, setDurationHours] = useState(1);

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctIndex, setCorrectIndex] = useState(null);

    const [warningOpen, setWarningOpen] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const addOptionField = () => {
        if (options.length < 4) setOptions([...options, ""]);
    };

    const handleOptionChange = (i, value) => {
        const newOptions = [...options];
        newOptions[i] = value;
        setOptions(newOptions);
    };

    const removeOption = (i) => {
        const newOptions = options.filter((_, idx) => idx !== i);
        setOptions(newOptions);
        if (correctIndex === i) setCorrectIndex(null);
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.trim() || options.some((o) => !o.trim()) || correctIndex === null) {
            setWarningOpen(true);
            return;
        }
        const newQ = { question: currentQuestion, options: [...options], correctIndex };
        setQuestions([...questions, newQ]);
        setCurrentQuestion("");
        setOptions(["", ""]);
        setCorrectIndex(null);
    };

    const handleSubmitQuiz = () => {
        if (!labName || !description || !startDate || !startTime || !endTime || !durationHours) {
            setWarningOpen(true);
            return;
        }
        setQuizSubmitted(true);
        alert(`Quiz info submitted!\nLab: ${labName}\nDescription: ${description}\nDate: ${startDate}\nStart: ${startTime}\nEnd: ${endTime}\nDuration: ${durationHours}h`);
    };

    return (
        <Box className="w-full scrollbar-none bg-gray-50 pt-[40px] md:p-[30px]">
            <Box className="px-8 py-10 max-w-5xl mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 blur-2xl opacity-60 -z-10" />

                {/* Header */}
                <Box className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                        <QuizIcon sx={{ fontSize: 34, color: "white" }} />
                    </div>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" className="text-blue-700">
                            {quizSubmitted ? labName : "Create Your Quiz ✨"}
                        </Typography>
                        {quizSubmitted && (
                            <Typography variant="subtitle1" className="text-gray-600 mt-1">
                                You can now add questions for this quiz.
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Quiz Info Form (only show if not submitted) */}
                {!quizSubmitted && (
                    <>
                        {/* Lab Name and Description */}
                        <Box className="flex flex-col gap-4 mb-6">
                            <TextField 
                                type="text" 
                                label="Quiz Name" 
                                value={labName} 
                                onChange={(e) => setLabName(e.target.value)} 
                                fullWidth
                            />
                            <TextareaAutosize
                                className="w-full outline-0 p-3 rounded-lg bg-white"
                                minRows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter detailed description for the quiz..."
                            />
                        </Box>

                        {/* Date, Time, Duration */}
                        <Box className="flex flex-col md:flex-row gap-4 mb-6">
                            <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} className="flex-1 w-full"/>
                            <TextField type="time" label="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} InputLabelProps={{ shrink: true }} className="flex-1 w-full"/>
                            <TextField type="time" label="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)} InputLabelProps={{ shrink: true }} className="flex-1 w-full"/>
                            <TextField type="number" label="Duration (Hours)" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} className="flex-1 w-full"/>
                        </Box>

                        {/* Submit Quiz Info */}
                        <Box className="flex justify-end mb-6">
                            <Button variant="contained" color="primary" size="large" className="rounded-full px-8 py-3" onClick={handleSubmitQuiz}>
                                Submit Quiz
                            </Button>
                        </Box>
                    </>
                )}

                {/* Number of Questions */}
                {quizSubmitted && (
                    <Typography className="mb-4 h-[50px] text-gray-700 font-medium">
                        Number of Questions: {questions.length}
                    </Typography>
                )}

                {/* Question Box */}
                {quizSubmitted && (
                    <Box className="mb-10 p-6 rounded-2xl backdrop-blur-md bg-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
                        <Typography variant="subtitle1" fontWeight="600" className="text-gray-700 mb-2">
                            ✍️ Question
                        </Typography>
                        <TextareaAutosize
                            className="w-full outline-0 p-2 rounded-lg"
                            value={currentQuestion}
                            onChange={(e) => setCurrentQuestion(e.target.value)}
                            placeholder="Type your quiz question here..."
                        />
                        <Divider className="my-6" />
                        <Typography variant="subtitle1" fontWeight="600" className="text-gray-700 p-3">
                            📝 Options (Click radio to select correct)
                        </Typography>

                        <Box className="flex flex-col gap-2">
                            {options.map((opt, i) => (
                                <Card
                                    key={i}
                                    elevation={0}
                                    className={`flex items-center gap-3 p-2 rounded-xl bg-white/70 shadow-md hover:shadow-md ${correctIndex === i ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="correct"
                                        checked={correctIndex === i}
                                        onChange={() => setCorrectIndex(i)}
                                        className="w-5 h-5 cursor-pointer accent-blue-600"
                                    />
                                    <TextField
                                        fullWidth
                                        placeholder={`Option ${i + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                        size="small"
                                        InputProps={{ className: "bg-transparent" }}
                                    />
                                    {options.length > 2 && (
                                        <IconButton color="error" onClick={() => removeOption(i)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Card>
                            ))}
                        </Box>

                        {options.length < 4 && (
                            <Box className="flex justify-center mt-3">
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={addOptionField}
                                    className="rounded-full px-4"
                                    variant="outlined"
                                    color="primary"
                                >
                                    Add Option
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Add Question Button */}
                {quizSubmitted && (
                    <Box className="flex justify-end mb-6">
                        <Button onClick={handleAddQuestion} variant="contained" size="large" className="rounded-full px-8 py-2 shadow-lg shadow-blue-300">
                            Add Question
                        </Button>
                    </Box>
                )}

                {/* Added Questions */}
                {quizSubmitted && questions.length > 0 && (
                    <Box className="mt-14">
                        <Typography variant="h5" fontWeight="700" className="text-gray-900 text-center mb-6">
                            📚 Added Questions
                        </Typography>
                        <Box className="flex flex-col gap-6 mt-6">
                            {questions.map((q, index) => (
                                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                                    <Box className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all border border-gray-200">
                                        <Typography style={{ fontSize: "18px" }} fontWeight="700" className="text-gray-900">
                                            {index + 1}. {q.question}
                                        </Typography>
                                        <ul className="flex flex-col gap-3 mt-5">
                                            {q.options.map((opt, i) => (
                                                <li
                                                    key={i}
                                                    className={`flex items-center gap-3 p-3 rounded-xl ${i === q.correctIndex ? "bg-green-50 text-green-700 font-semibold ring-1 ring-green-300" : "bg-gray-200 text-gray-800"} transition-all`}
                                                >
                                                    {i === q.correctIndex && <CheckCircleIcon fontSize="small" color="success" />}
                                                    <span>{opt}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Warning Dialog */}
                <Dialog open={warningOpen} TransitionComponent={Transition} keepMounted onClose={() => setWarningOpen(false)}>
                    <DialogTitle sx={{ fontWeight: "bold" }}>⚠️ Incomplete Fields</DialogTitle>
                    <DialogContent>
                        <Typography>Please fill in all fields, including question, options, lab name, description, date, time, duration, and correct answer.</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setWarningOpen(false)} variant="contained" color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default CreateQuiz;
