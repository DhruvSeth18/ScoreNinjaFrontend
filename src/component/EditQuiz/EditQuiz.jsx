import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  Divider,
  Slide,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert as MuiAlert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShareIcon from "@mui/icons-material/Share";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { GetQuizById, addQuestionAPI, DeleteQuestion, UpdateQuiz } from "../../api/api";
import { useParams } from "react-router-dom";
import { deleteQuiz } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { addMultipleQuestions } from "../../api/api";
import * as XLSX from "xlsx";

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
    passingPercentage: 50,
  });

  const [duration, setDuration] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState("0");
  const [manualTotal, setManualTotal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareLink = `${window.location.origin}/quiz/${quizId}/wait`;
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);
  const openExcelDialog = () => setExcelDialogOpen(true);
  const closeExcelDialog = () => setExcelDialogOpen(false);
  const passingOptions = [10, 20, 30, 40, 50, 60, 70];


  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");


  const navigate = useNavigate();

  const openSnackbar = (msg, severity = "info") => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_e, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Fetch quiz
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    if (!quizId) return;

    const result = await GetQuizById(quizId);
    if (result.status) {
      const quiz = result.data;

      setFormData({
        quizName: quiz.quizName || "",
        description: quiz.description || "",
        startDate: quiz.quizDate ? quiz.quizDate.split("T")[0] : "",
        startTime: quiz.startTime || "",
        endTime: quiz.endTime || "",
        passingPercentage: quiz.passingPercentage || 50,
      });

      setDuration(quiz.duration || 1);
      setTotalQuestions(String(quiz.totalQuestions || 0));
      setQuestions(quiz.questions || []);
    }
  };



  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      rows.shift(); // remove header

      const parsedQuestions = [];
      let skippedRows = 0;

      rows.forEach((row) => {
        const r = [...row];
        while (r.length < 6) r.push("");

        const [questionText, opt1, opt2, opt3, opt4, correctOption] = r;
        const options = [opt1, opt2, opt3, opt4].map(o => o?.toString().trim() || "");
        const correct = correctOption?.toString().trim() || "";

        if (!questionText?.trim() || options.filter(Boolean).length < 2 || !options.includes(correct)) {
          skippedRows++;
          return;
        }

        parsedQuestions.push({
          questionText: questionText.trim(),
          options,
          correctOption: correct,
          timeLimit: 30,
          selectedOption: null
        });
      });

      try {
        const result = await addMultipleQuestions(quizId, parsedQuestions);

        if (result.status) {
          const added = (result.addedQuestions || []).map(q => ({
            questionText: q.questionText || "",
            options: q.options || [],
            correctOption: q.correctOption || "",
            timeLimit: q.timeLimit || 30,
            selectedOption: null
          }));

          setQuestions(prev => [...prev, ...added]); // ✅ Merge into existing questions immediately
          if (!manualTotal) setTotalQuestions(prev => String(prev.length + added.length));
          fetchQuiz();

          openSnackbar(`📦 Questions imported! Added: ${added.length}, Skipped: ${result.skippedQuestions?.length || skippedRows}`, "success");
        } else {
          openSnackbar(result.message || "Failed to import questions", "error");
        }
      } catch (err) {
        console.error(err);
        openSnackbar("Error importing questions", "error");
      }

      e.target.value = ""; // reset file input
    };
    
    reader.readAsArrayBuffer(file);
  };


  const handleDeleteQuiz = async () => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) return;

    try {
      const result = await deleteQuiz(quizId);
      if (result.status) {
        openSnackbar(result.message, "success");
        // Optionally, redirect after deletion
        setTimeout(() => {
          window.location.href = "/quiz/created"; // redirect to home or quiz list
        }, 1000);
      } else {
        openSnackbar(result.message || "Failed to delete quiz", "error");
      }
    } catch (error) {
      openSnackbar("Error deleting quiz", "error");
    }
  };


  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleDurationChange = (e) => {
    const val = Number(e.target.value);
    if (/^\d*$/.test(val)) setDuration(val);
  };

  const handleTotalQuestionsChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setTotalQuestions(val);
      setManualTotal(true);
    }
  };

  const addOptionField = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };

  const handleOptionChange = (i, v) => {
    const n = [...options];
    n[i] = v;
    setOptions(n);
  };
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
  };


  const removeOption = (i) => {
    const n = options.filter((_, idx) => idx !== i);
    setOptions(n);
    if (correctIndex === i) setCorrectIndex(null);
  };

  const handleAddQuestion = async () => {
    if (!currentQuestion.trim() || options.some((o) => !o.trim()) || correctIndex === null) {
      setWarningOpen(true);
      return;
    }
    const questionData = {
      questionText: currentQuestion,
      options: [...options],
      correctOption: options[correctIndex],
      timeLimit: 30,
    };
    try {
      const result = await addQuestionAPI(quizId, questionData);
      if (result.Message === "Question added successfully") {
        const newQ = { ...questionData, correctIndex };
        const updated = [...questions, newQ];
        setQuestions(updated);
        if (!manualTotal) setTotalQuestions(String(updated.length));
        setCurrentQuestion("");
        setOptions(["", ""]);
        setCorrectIndex(null);
        openSnackbar("✅ Question added successfully", "success");
      } else openSnackbar(result.Message || "Failed to add question", "error");
    } catch (error) {
      openSnackbar("Error adding question", "error");
    }
  };

  const handleRemoveQuestion = async (index) => {
    try {
      await DeleteQuestion(quizId, questions[index].questionText);
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
      if (!manualTotal) setTotalQuestions(String(updated.length));
      openSnackbar("Question removed successfully", "success");
    } catch (error) {
      openSnackbar("Error removing question", "error");
    }
  };

  const handleEditQuiz = async () => {
    const payload = {
      quizName: formData.quizName,
      description: formData.description,
      duration: duration,
      totalQuestions: totalQuestions,
      passingPercentage: formData.passingPercentage,
      quizDate: `${formData.startDate}T00:00:00`,
      startTime: `${formData.startTime}:00`.slice(0, 8),
      endTime: `${formData.endTime}:00`.slice(0, 8),
    };
    const result = await UpdateQuiz(quizId, payload);
    if (result.status) openSnackbar("✅ Quiz Updated Successfully", "success");
    else openSnackbar(result.message || "Failed to update quiz", "error");
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

  const handleViewParticipants = () => {
    navigate(`/quiz/${quizId}/participants`);
  }

  return (
    <Box className="w-full min-h-screen scrollbar-none bg-gray-50 md:p-[100px]">
      <Box className="px-8 py-10 max-w-5xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 blur-2xl opacity-60 -z-10" />
        <Box className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <QuizIcon sx={{ fontSize: 34, color: "white" }} />
          </div>
          <Typography variant="h4" fontWeight="bold" className="text-blue-700">
            Edit Your Quiz ✨
          </Typography>
        </Box>

        {/* Form Section */}
        <Box className="flex flex-col gap-4 mb-6">
          <TextField label="Quiz Name" name="quizName" value={formData.quizName} onChange={handleChange} fullWidth />
          <TextareaAutosize className="w-full outline-0 p-3 rounded-lg bg-white" minRows={4} value={formData.description} onChange={handleChange} name="description" placeholder="Enter detailed description..." />
        </Box>

        <Box className="flex flex-col md:flex-row gap-4 mb-6">
          <TextField type="date" label="Quiz Date" name="startDate" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} className="flex-1 w-full" />
          <TextField type="time" label="Start Time" name="startTime" value={formData.startTime} onChange={handleChange} InputLabelProps={{ shrink: true }} className="flex-1 w-full" />
          <TextField type="time" label="End Time" name="endTime" value={formData.endTime} onChange={handleChange} InputLabelProps={{ shrink: true }} className="flex-1 w-full" />
        </Box>

        <Box className="flex flex-col md:flex-row gap-4 mb-6">
          <TextField type="text" label="Duration (Hours)" value={duration} onChange={handleDurationChange} className="flex-1 w-full" />
          <TextField type="text" label="Total Questions" value={totalQuestions} onChange={handleTotalQuestionsChange} className="flex-1 w-full" />
          <FormControl className="flex-1 w-full">
            <InputLabel>Passing %</InputLabel>
            <Select name="passingPercentage" value={formData.passingPercentage} onChange={handleChange} fullWidth>
              {passingOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}%
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Buttons */}
        {/* Buttons */}
        <Box className="flex gap-4 mb-6">
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="rounded-full px-8 py-3"
            onClick={handleEditQuiz}
          >
            Submit Quiz
          </Button>

          {/* Share Button */}
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<ShareIcon />}
            onClick={openShareDialog}
          >
            Share
          </Button>

          {/* Delete Quiz Button */}
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={handleDeleteQuiz}
          >
            Delete
          </Button>

          {/* View Participants Button */}
          <Button
            variant="outlined"
            color="success"
            size="large"
            onClick={handleViewParticipants} // 👈 add this function
          >
            View Participants
          </Button>

          {/* Excel Import Button */}
          <Button
            variant="outlined"
            color="info"
            size="large"
            onClick={openExcelDialog}
          >
            Import Excel
          </Button>

          {/* Hidden File Input */}
          <input
            type="file"
            id="excelInput"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            onChange={handleExcelImport}
          />
        </Box>



        {/* Questions Section */}
        <Typography className="mb-4 h-[50px] text-gray-700 font-medium">
          Questions Added: {questions.length}
        </Typography>

        <Box className="mb-10 p-6 rounded-2xl backdrop-blur-md bg-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <Typography variant="subtitle1" fontWeight="600" className="text-gray-700 mb-2">
            ✍️ Question
          </Typography>
          <TextareaAutosize className="w-full outline-0 p-2 rounded-lg" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} placeholder="Type your quiz question here..." />
          <Divider className="my-6" />
          <Typography variant="subtitle1" fontWeight="600" className="text-gray-700 p-3">
            📝 Options (Click radio to select correct)
          </Typography>
          <Box className="flex flex-col gap-2">
            {options.map((opt, i) => (
              <Card
                key={i}
                elevation={0}
                className={`flex items-center gap-3 p-2 rounded-xl bg-white/70 shadow-md hover:shadow-md ${correctIndex === i ? "ring-2 ring-blue-400 bg-blue-50" : ""
                  }`}
              >
                <input type="radio" name="correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} className="w-5 h-5 cursor-pointer accent-blue-600" />
                <TextField fullWidth placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} size="small" />
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
              <Button startIcon={<AddIcon />} onClick={addOptionField} className="rounded-full px-4" variant="outlined" color="primary">
                Add Option
              </Button>
            </Box>
          )}
        </Box>

        <Box className="flex justify-end mb-6">
          <Button onClick={handleAddQuestion} variant="contained" size="large" className="rounded-full px-8 py-2 shadow-lg shadow-blue-300">
            Add Question
          </Button>
        </Box>

        {/* Added Questions List */}
        {questions.length > 0 && (
          <Box className="mt-14">
            <Typography variant="h5" fontWeight="700" className="text-gray-900 text-center mb-6">
              📚 Added Questions
            </Typography>
            <Box className="flex flex-col gap-6 mt-6">
              {questions.map((q, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <Box className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all border border-gray-200">
                    <Box className="flex justify-between items-center">
                      <Typography style={{ fontSize: "18px" }} fontWeight="700" className="text-gray-900">
                        {index + 1}. {q.questionText}
                      </Typography>
                      <Button size="small" color="error" onClick={() => handleRemoveQuestion(index)}>
                        Remove
                      </Button>
                    </Box>
                    <ul className="flex flex-col gap-3 mt-5">
                      {(q.options || []).map((opt, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl ${opt === q.correctOption ? "bg-green-50 text-green-700 font-semibold ring-1 ring-green-300" : "bg-gray-200 text-gray-800"
                            }`}
                        >
                          {opt === q.correctOption && <CheckCircleIcon fontSize="small" color="success" />}
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

        {/* Share Dialog */}
        <Dialog open={shareOpen} TransitionComponent={Transition} keepMounted onClose={closeShareDialog}>
          <DialogTitle sx={{ fontWeight: "bold" }}>🔗 Share Quiz</DialogTitle>

          <DialogContent className="flex flex-col items-center gap-4">
            <QRCode value={shareLink} size={200} />

            {/* COPY LINK FIELD (ADDED) */}
            <TextField
              fullWidth
              value={shareLink}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopyIcon />
                  </IconButton>
                ),
              }}
            />

            <Box className="flex gap-3 mt-4">
              <Button variant="contained" color="success" onClick={() => shareTo("whatsapp")}>
                WhatsApp
              </Button>
              <Button variant="contained" color="info" onClick={() => shareTo("twitter")}>
                Twitter
              </Button>
              <Button variant="contained" color="primary" onClick={() => shareTo("facebook")}>
                Facebook
              </Button>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeShareDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>


        {/* Warning Dialog */}
        <Dialog open={warningOpen} TransitionComponent={Transition} keepMounted onClose={() => setWarningOpen(false)}>
          <DialogTitle sx={{ fontWeight: "bold" }}>⚠️ Incomplete Fields</DialogTitle>
          <DialogContent>
            <Typography>Please fill in all fields and select a correct answer.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWarningOpen(false)} variant="contained" color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={excelDialogOpen} onClose={closeExcelDialog} maxWidth="sm" fullWidth>
          <DialogTitle>📑 Excel Import Rules</DialogTitle>
          <DialogContent>
            <Typography mb={2}>
              Please format your Excel file as follows:
            </Typography>
            <ul>
              <li>1st Column → Question</li>
              <li>Next 2–4 Columns → Options (at least 2 options must be filled)</li>
              <li>5th Column → Correct Answer (must match one of the options)</li>
            </ul>
            <Typography color="textSecondary" mt={2}>
              Example:
            </Typography>
            <Box component="pre" sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
              Question | Option1 | Option2 | Option3 | Option4 | CorrectOption
              {"\n"}What is 2+2? | 3 | 4 | 5 |  | 4
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => {
              closeExcelDialog();
              document.getElementById("excelInput").click(); // open file selector after closing dialog
            }}>
              OK, Got it
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
            {snackbarMsg}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default EditQuiz;
