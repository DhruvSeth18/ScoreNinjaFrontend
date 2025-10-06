import React, { useState } from "react";
import * as MUI from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { CreateQuiz as createQuizAPI } from "../api/api"; // your API function

const Transition = React.forwardRef(function Transition(props, ref) {
    return <MUI.Slide direction="down" ref={ref} {...props} />;
});

const CreateQuiz = () => {
    const [formData, setFormData] = useState({
        quizName: "",
        description: "",
        startDate: "",
        startTime: "",
        endTime: "",
        duration: "",
        passingPercentage: 50,
    });

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctIndex, setCorrectIndex] = useState(null);
    const [warningOpen, setWarningOpen] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const val = parseInt(value, 10);
        if (!isNaN(val)) setFormData((prev) => ({ ...prev, [name]: val }));
    };

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

    const handleSubmitQuiz = async () => {
        const { quizName, description, startDate, startTime, endTime, duration, totalQuestions, passingPercentage } = formData;

        if (!quizName || !description || !startDate || !startTime || !endTime || !duration || !totalQuestions || !passingPercentage) {
            setWarningOpen(true);
            return;
        }

        if (passingPercentage < 10 || passingPercentage > 70) {
            alert("Passing percentage must be between 10 and 70!");
            return;
        }

        const payload = {
            quizName,
            description,
            duration,
            totalQuestions,
            passingPercentage,
            quizDate: `${formData.startDate}`+"T00:00:00", // LocalDate expected
            startTime: formData.startTime + ":00", // append seconds
            endTime: formData.endTime + ":00",     // append seconds
        };

        const result = await createQuizAPI(payload);

        if (result.status) {
            setQuizSubmitted(true);
            alert(result.message || "Quiz created successfully!");
        } else {
            alert(result.message || "Failed to create quiz!");
        }
    };

    const passingOptions = [10, 20, 30, 40, 50, 60, 70];

    return (
        <MUI.Box className="w-full scrollbar-none bg-gray-50 md:p-[30px]">
            <MUI.Box className="px-8 py-10 max-w-5xl mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 blur-2xl opacity-60 -z-10" />

                <MUI.Box className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                        <QuizIcon sx={{ fontSize: 34, color: "white" }} />
                    </div>
                    <MUI.Box>
                        <MUI.Typography variant="h4" fontWeight="bold" className="text-blue-700">
                            {quizSubmitted ? formData.quizName : "Create Your Quiz ✨"}
                        </MUI.Typography>
                        {quizSubmitted && (
                            <MUI.Typography variant="subtitle1" className="text-gray-600 mt-1">
                                You can now add questions for this quiz.
                            </MUI.Typography>
                        )}
                    </MUI.Box>
                </MUI.Box>

                {!quizSubmitted && (
                    <>
                        <MUI.Box className="flex flex-col gap-4 mb-6">
                            <MUI.TextField label="Quiz Name" name="quizName" value={formData.quizName} onChange={handleChange} fullWidth />
                            <MUI.TextareaAutosize
                                className="w-full outline-0 p-3 rounded-lg bg-white"
                                minRows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter detailed description for the quiz..."
                            />
                        </MUI.Box>

                        <MUI.Box className="flex flex-col md:flex-row gap-4 mb-6">
                            <MUI.TextField type="date" label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} className="flex-1 w-full" />
                            <MUI.TextField type="time" label="Start Time" name="startTime" value={formData.startTime} onChange={handleChange} InputLabelProps={{ shrink: true }} className="flex-1 w-full" />
                            <MUI.TextField type="time" label="End Time" name="endTime" value={formData.endTime} onChange={handleChange} InputLabelProps={{ shrink: true }} className="flex-1 w-full" />
                        </MUI.Box>

                        <MUI.Box className="flex flex-col md:flex-row gap-4 mb-6">
                            <MUI.TextField type="number" label="Duration (Hours)" name="duration" value={formData.duration} onChange={handleNumberChange} className="flex-1 w-full" />
                            <MUI.TextField type="number" label="Total Questions" name="totalQuestions" value={formData.totalQuestions} onChange={handleNumberChange} className="flex-1 w-full" />
                            <MUI.FormControl className="flex-1 w-full">
                                <MUI.InputLabel>Passing Percentage</MUI.InputLabel>
                                <MUI.Select
                                    name="passingPercentage"
                                    value={formData.passingPercentage}
                                    onChange={handleNumberChange}
                                    displayEmpty
                                    fullWidth
                                >
                                    {passingOptions.map((opt) => (
                                        <MUI.MenuItem key={opt} value={opt}>
                                            {opt}%
                                        </MUI.MenuItem>
                                    ))}
                                </MUI.Select>
                            </MUI.FormControl>
                        </MUI.Box>

                        <MUI.Box className="flex justify-end mb-6">
                            <MUI.Button variant="contained" color="primary" size="large" className="rounded-full px-8 py-3" onClick={handleSubmitQuiz}>
                                Submit Quiz
                            </MUI.Button>
                        </MUI.Box>
                    </>
                )}

                {quizSubmitted && (
                    <>
                        <MUI.Typography className="mb-4 h-[50px] text-gray-700 font-medium">Number of Questions: {questions.length}</MUI.Typography>

                        <MUI.Box className="mb-10 p-6 rounded-2xl backdrop-blur-md bg-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
                            <MUI.Typography variant="subtitle1" fontWeight="600" className="text-gray-700 mb-2">✍️ Question</MUI.Typography>
                            <MUI.TextareaAutosize
                                className="w-full outline-0 p-2 rounded-lg"
                                value={currentQuestion}
                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                placeholder="Type your quiz question here..."
                            />
                            <MUI.Divider className="my-6" />
                            <MUI.Typography variant="subtitle1" fontWeight="600" className="text-gray-700 p-3">📝 Options (Click radio to select correct)</MUI.Typography>

                            <MUI.Box className="flex flex-col gap-2">
                                {options.map((opt, i) => (
                                    <MUI.Card
                                        key={i}
                                        elevation={0}
                                        className={`flex items-center gap-3 p-2 rounded-xl bg-white/70 shadow-md hover:shadow-md ${correctIndex === i ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}
                                    >
                                        <input type="radio" name="correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} className="w-5 h-5 cursor-pointer accent-blue-600" />
                                        <MUI.TextField fullWidth placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} size="small" InputProps={{ className: "bg-transparent" }} />
                                        {options.length > 2 && (
                                            <MUI.IconButton color="error" onClick={() => removeOption(i)}>
                                                <DeleteIcon />
                                            </MUI.IconButton>
                                        )}
                                    </MUI.Card>
                                ))}
                            </MUI.Box>

                            {options.length < 4 && (
                                <MUI.Box className="flex justify-center mt-3">
                                    <MUI.Button startIcon={<AddIcon />} onClick={addOptionField} className="rounded-full px-4" variant="outlined" color="primary">
                                        Add Option
                                    </MUI.Button>
                                </MUI.Box>
                            )}
                        </MUI.Box>

                        <MUI.Box className="flex justify-end mb-6">
                            <MUI.Button onClick={handleAddQuestion} variant="contained" size="large" className="rounded-full px-8 py-2 shadow-lg shadow-blue-300">
                                Add Question
                            </MUI.Button>
                        </MUI.Box>

                        {questions.length > 0 && (
                            <MUI.Box className="mt-14">
                                <MUI.Typography variant="h5" fontWeight="700" className="text-gray-900 text-center mb-6">📚 Added Questions</MUI.Typography>
                                <MUI.Box className="flex flex-col gap-6 mt-6">
                                    {questions.map((q, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                                            <MUI.Box className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all border border-gray-200">
                                                <MUI.Typography style={{ fontSize: "18px" }} fontWeight="700" className="text-gray-900">
                                                    {index + 1}. {q.question}
                                                </MUI.Typography>
                                                <ul className="flex flex-col gap-3 mt-5">
                                                    {q.options.map((opt, i) => (
                                                        <li key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === q.correctIndex ? "bg-green-50 text-green-700 font-semibold ring-1 ring-green-300" : "bg-gray-200 text-gray-800"} transition-all`}>
                                                            {i === q.correctIndex && <CheckCircleIcon fontSize="small" color="success" />}
                                                            <span>{opt}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </MUI.Box>
                                        </motion.div>
                                    ))}
                                </MUI.Box>
                            </MUI.Box>
                        )}
                    </>
                )}

                <MUI.Dialog open={warningOpen} TransitionComponent={Transition} keepMounted onClose={() => setWarningOpen(false)}>
                    <MUI.DialogTitle sx={{ fontWeight: "bold" }}>⚠️ Incomplete Fields</MUI.DialogTitle>
                    <MUI.DialogContent>
                        <MUI.Typography>Please fill in all required fields and options.</MUI.Typography>
                    </MUI.DialogContent>
                    <MUI.DialogActions>
                        <MUI.Button onClick={() => setWarningOpen(false)} variant="contained" color="primary">OK</MUI.Button>
                    </MUI.DialogActions>
                </MUI.Dialog>
            </MUI.Box>
        </MUI.Box>
    );
};

export default CreateQuiz;
