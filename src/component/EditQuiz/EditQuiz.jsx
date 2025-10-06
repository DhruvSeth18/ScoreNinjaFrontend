import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Card, Typography, TextField, IconButton, Divider, Slide, TextareaAutosize, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShareIcon from "@mui/icons-material/Share";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { GetQuizById, addQuestionAPI } from "../api/api";
import { useParams } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditQuiz = () => {
  const { quizId } = useParams();
  const [formData, setFormData] = useState({
    quizName: "",
    description: "",
    startDate: "",
    startTime: "",
    endTime: "",
    durationHours: 1,
    passingPercentage: 50,
  });

  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState("0"); 
  const [manualTotal, setManualTotal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const shareLink = window.location.href;
  const passingOptions = [10, 20, 30, 40, 50, 60, 70];

  // Fetch quiz by ID
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      const result = await GetQuizById(quizId);
      if (result.status) {
        const quiz = result.data;
        setFormData({
          quizName: quiz.quizName || "",
          description: quiz.description || "",
          startDate: quiz.startDate || "",
          startTime: quiz.startTime || "",
          endTime: quiz.endTime || "",
          durationHours: quiz.durationHours || 1,
          passingPercentage: quiz.passingPercentage || 50,
        });
        setQuestions(quiz.questions || []);
        setTotalQuestions(String(quiz.totalQuestion || (quiz.questions?.length || 0)));
      } else {
        alert(result.message || "Failed to fetch quiz");
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10);
    if (!isNaN(val)) setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleTotalQuestionsChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setTotalQuestions(val);
      setManualTotal(true);
    }
  };

  const addOptionField = () => { if (options.length < 4) setOptions([...options, ""]); };
  const handleOptionChange = (i, value) => { const newOptions = [...options]; newOptions[i] = value; setOptions(newOptions); };
  const removeOption = (i) => {
    const newOptions = options.filter((_, idx) => idx !== i);
    setOptions(newOptions);
    if (correctIndex === i) setCorrectIndex(null);
  };

  // Add question & call API
  const handleAddQuestion = async () => {
    if (!currentQuestion.trim() || options.some((o) => !o.trim()) || correctIndex === null) {
      setWarningOpen(true); 
      return;
    }

    const questionData = {
      questionText: currentQuestion,
      options: [...options],
      correctOption: options[correctIndex],
      timeLimit: 30 // adjust as needed
    };

    try {
      const result = await addQuestionAPI(quizId, questionData);
      if (result.Message === "Question added successfully") {
        const newQ = { ...questionData, correctIndex };
        const updatedQuestions = [...questions, newQ];
        setQuestions(updatedQuestions);
        if (!manualTotal) setTotalQuestions(String(updatedQuestions.length));
        setCurrentQuestion("");
        setOptions(["", ""]);
        setCorrectIndex(null);
        alert(result.Message);
      } else {
        alert(result.Message || "Failed to add question");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding question. Try again.");
    }
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (!manualTotal) setTotalQuestions(String(updatedQuestions.length));
  };

  const handleSubmitQuiz = () => {
    const { quizName, description, startDate, startTime, endTime, durationHours, passingPercentage } = formData;
    const totalQ = parseInt(totalQuestions, 10) || 0;
    if (!quizName || !description || !startDate || !startTime || !endTime || !durationHours || !totalQ || !passingPercentage || questions.length === 0) {
      setWarningOpen(true); 
      return;
    }
    alert(`Quiz submitted!\nLab: ${quizName}\nDescription: ${description}\nDate: ${startDate}\nStart: ${startTime}\nEnd: ${endTime}\nDuration: ${durationHours}h\nTotal Questions: ${totalQ}\nPassing: ${passingPercentage}%\nQuestions Added: ${questions.length}`);
  };

  const openShareDialog = () => setShareOpen(true);
  const closeShareDialog = () => setShareOpen(false);
  const shareTo = (platform) => {
    let url = "";
    const shareUrl = shareLink.replace(/\/edit$/, "");
    const text = encodeURIComponent(`Join my quiz: ${shareUrl}`);
    if (platform === "whatsapp") url = `https://wa.me/?text=${text}`;
    if (platform === "twitter") url = `https://twitter.com/intent/tweet?text=${text}`;
    if (platform === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(url, "_blank");
  };

  return (
    <Box className="w-full min-h-screen scrollbar-none bg-gray-50 p-[30px]">
      <Box className="px-8 py-10 max-w-5xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 blur-2xl opacity-60 -z-10" />
        <Box className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg"><QuizIcon sx={{ fontSize: 34, color: "white" }} /></div>
          <Typography variant="h4" fontWeight="bold" className="text-blue-700">{formData.quizName || "Edit Your Quiz ✨"}</Typography>
        </Box>

        {/* Quiz Name & Description */}
        <Box className="flex flex-col gap-4 mb-6">
          <TextField label="Quiz Name" name="quizName" value={formData.quizName} onChange={handleChange} fullWidth />
          <TextareaAutosize className="w-full outline-0 p-3 rounded-lg bg-white" minRows={4} value={formData.description} onChange={(e)=>handleChange(e)} placeholder="Enter detailed description..." name="description" />
        </Box>

        {/* Start Date, Start Time, End Time */}
        <Box className="flex flex-col md:flex-row gap-4 mb-6">
          <TextField type="date" label="Start Date" name="startDate" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink:true }} className="flex-1 w-full" />
          <TextField type="time" label="Start Time" name="startTime" value={formData.startTime} onChange={handleChange} InputLabelProps={{ shrink:true }} className="flex-1 w-full" />
          <TextField type="time" label="End Time" name="endTime" value={formData.endTime} onChange={handleChange} InputLabelProps={{ shrink:true }} className="flex-1 w-full" />
        </Box>

        {/* Duration, Total Questions, Passing % */}
        <Box className="flex flex-col md:flex-row gap-4 mb-6">
          <TextField type="number" label="Duration (Hours)" name="durationHours" value={formData.durationHours} onChange={handleNumberChange} className="flex-1 w-full" />
          <TextField type="text" label="Total Questions" value={totalQuestions} onChange={handleTotalQuestionsChange} className="flex-1 w-full" />
          <FormControl className="flex-1 w-full">
            <InputLabel>Passing %</InputLabel>
            <Select name="passingPercentage" value={formData.passingPercentage} onChange={handleNumberChange} fullWidth>
              {passingOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}%</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Buttons */}
        <Box className="flex gap-4 mb-6">
          <Button variant="contained" color="primary" size="large" className="rounded-full px-8 py-3" onClick={handleSubmitQuiz}>Submit Quiz</Button>
          <Button variant="outlined" color="secondary" size="large" startIcon={<ShareIcon />} onClick={openShareDialog}>Share</Button>
        </Box>

        {/* Questions list */}
        <Typography className="mb-4 h-[50px] text-gray-700 font-medium">Questions Added: {questions.length}</Typography>

        {/* Question Box */}
        <Box className="mb-10 p-6 rounded-2xl backdrop-blur-md bg-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <Typography variant="subtitle1" fontWeight="600" className="text-gray-700 mb-2">✍️ Question</Typography>
          <TextareaAutosize className="w-full outline-0 p-2 rounded-lg" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} placeholder="Type your quiz question here..." />
          <Divider className="my-6" />
          <Typography variant="subtitle1" fontWeight="600" className="text-gray-700 p-3">📝 Options (Click radio to select correct)</Typography>
          <Box className="flex flex-col gap-2">
            {options.map((opt, i) => (
              <Card key={i} elevation={0} className={`flex items-center gap-3 p-2 rounded-xl bg-white/70 shadow-md hover:shadow-md ${correctIndex === i ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}>
                <input type="radio" name="correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} className="w-5 h-5 cursor-pointer accent-blue-600" />
                <TextField fullWidth placeholder={`Option ${i+1}`} value={opt} onChange={(e)=>handleOptionChange(i,e.target.value)} size="small" InputProps={{ className:"bg-transparent" }} />
                {options.length>2 && <IconButton color="error" onClick={()=>removeOption(i)}><DeleteIcon /></IconButton>}
              </Card>
            ))}
          </Box>
          {options.length<4 && <Box className="flex justify-center mt-3"><Button startIcon={<AddIcon />} onClick={addOptionField} className="rounded-full px-4" variant="outlined" color="primary">Add Option</Button></Box>}
        </Box>

        {/* Add Question Button */}
        <Box className="flex justify-end mb-6">
          <Button onClick={handleAddQuestion} variant="contained" size="large" className="rounded-full px-8 py-2 shadow-lg shadow-blue-300">Add Question</Button>
        </Box>

        {/* Added Questions */}
        {questions.length>0 && <Box className="mt-14">
          <Typography variant="h5" fontWeight="700" className="text-gray-900 text-center mb-6">📚 Added Questions</Typography>
          <Box className="flex flex-col gap-6 mt-6">
            {questions.map((q,index)=>(
              <motion.div key={index} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
                <Box className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all border border-gray-200">
                  <Box className="flex justify-between items-center">
                    <Typography style={{fontSize:"18px"}} fontWeight="700" className="text-gray-900">{index+1}. {q.questionText}</Typography>
                    <Button size="small" color="error" onClick={()=>handleRemoveQuestion(index)}>Remove</Button>
                  </Box>
                  <ul className="flex flex-col gap-3 mt-5">
                    {q.options.map((opt,i)=>(
                      <li key={i} className={`flex items-center gap-3 p-3 rounded-xl ${opt===q.correctOption?"bg-green-50 text-green-700 font-semibold ring-1 ring-green-300":"bg-gray-200 text-gray-800"} transition-all`}>
                        {opt===q.correctOption && <CheckCircleIcon fontSize="small" color="success"/>}<span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>}

        {/* Share Dialog */}
        <Dialog open={shareOpen} TransitionComponent={Transition} keepMounted onClose={closeShareDialog}>
          <DialogTitle sx={{ fontWeight:"bold" }}>🔗 Share Quiz</DialogTitle>
          <DialogContent className="flex flex-col items-center gap-4">
            <QRCode value={shareLink} size={200} />
            <Box className="flex gap-3 mt-4">
              <Button variant="contained" color="success" onClick={()=>shareTo("whatsapp")}>WhatsApp</Button>
              <Button variant="contained" color="info" onClick={()=>shareTo("twitter")}>Twitter</Button>
              <Button variant="contained" color="primary" onClick={()=>shareTo("facebook")}>Facebook</Button>
            </Box>
          </DialogContent>
          <DialogActions><Button onClick={closeShareDialog} variant="contained">Close</Button></DialogActions>
        </Dialog>

        {/* Warning Dialog */}
        <Dialog open={warningOpen} TransitionComponent={Transition} keepMounted onClose={()=>setWarningOpen(false)}>
          <DialogTitle sx={{ fontWeight:"bold" }}>⚠️ Incomplete Fields</DialogTitle>
          <DialogContent><Typography>Please fill in all fields, including question, options, quiz name, description, date, time, duration, total questions, passing %, and correct answer.</Typography></DialogContent>
          <DialogActions><Button onClick={()=>setWarningOpen(false)} variant="contained" color="primary">OK</Button></DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default EditQuiz;
