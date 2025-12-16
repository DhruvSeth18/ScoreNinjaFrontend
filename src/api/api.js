import { ConstructionOutlined } from "@mui/icons-material";
import axios from "axios";

const url = "http://localhost:8080/api";

export const LoginUser = async (data) => {
    try {
        const response = await axios.post(`${url}/user/login`, data, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            return {
                status: true,
                token: response.data.token,
                message: response.data.message,
                username: response.data.username
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};

export const CreateUser = async (data) => {
    try {
        const response = await axios.post(`${url}/user/createUser`, data, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200 || response.status === 201) {
            return {
                status: true,
                message: response.data.Message || "User created successfully",
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.Message || "Error creating user",
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};

export const CreateQuiz = async (data) => {
    try {
        const token = localStorage.getItem("token"); // get token from localStorage

        const response = await axios.post(`${url}/quiz/createQuiz`, data, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "", // attach token if available
            },
        });

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                quizId:response.data.quizId
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};


export const GetMyQuizzes = async () => {
    try {
        const token = localStorage.getItem("token"); // get token from localStorage

        const response = await axios.get(`${url}/quiz/myquizzes`, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "", // attach token if available
            },
        });

        if (response.status === 200) {
            return {
                status: true,
                data: response.data, // contains count and quizzes list
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};

export const GetQuizById = async (quizId) => {
    try {
        const token = localStorage.getItem("token"); // get token from localStorage

        const response = await axios.get(`${url}/quiz/myquiz/${quizId}`, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        if (response.status === 200) {
            return {
                status: true,
                data: response.data.quiz, // contains the quiz object
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};


export const addQuestionAPI = async (quizId, questionData) => {
    try {
        const token = localStorage.getItem("token"); // or wherever you store your JWT
        const response = await axios.post(
            `http://localhost:8080/api/quiz/addQues?quizId=${quizId}`,
            questionData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // { Message: "Question added successfully" }
    } catch (error) {
        console.error("Error adding question:", error);
        return { Message: "Failed to add question", error };
    }
};



export const DeleteQuestion = async (quizId, questionText) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `http://localhost:8080/api/quiz/deletequestion?quizId=${quizId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: { questionText }, // ✅ body for DELETE
            }
        );

        return {
            status: response.data?.status ?? true,
            data: response.data,
            message: response.data?.Message || "Question deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting question:", error);
        return {
            status: false,
            message:
                error.response?.data?.Message ||
                error.message ||
                "Failed to delete question",
        };
    }
};


export const UpdateQuiz = async (quizId, quizData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `http://localhost:8080/api/quiz/updatequiz?quizId=${quizId}`,
            quizData, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            status: true,
            data: response.data,
            message: response.data?.Message || "Quiz updated successfully",
        };
    } catch (error) {
        console.error("Error updating quiz:", error);
        return {
            status: false,
            message:
                error.response?.data?.Message ||
                error.message ||
                "Failed to update quiz",
        };
    }
};


export const getAllUserQuizzes = async (userId) => {
    try {
        const response = await axios.get(`${url}/user/allQuizzes`, {
            params: { userId },
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                attemptedQuizzes: response.data.attemptedQuizzes,
                createdQuizzes: response.data.createdQuizzes,
                upcomingQuizzes: response.data.upcomingQuizzes,
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};

export const CheckQuizExist = async (token, quizId) => {
    try {
        const response = await axios.get(`${url}/quiz/check`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            params: { quizId },
            withCredentials: true,
            timeout: 6000,
        });

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                isRegistered: response.data.isRegistered,
                currentStatus: response.data.currentStatus,
                isCreator: response.data.isCreator,
                attemptId: response.data.attemptId || null,
            };
        }
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || "Server error",
            };
        }
        return {
            status: false,
            message: "Network error or server not responding",
        };
    }
};

export const getSingleQuiz = async (quizId) => {
    try {
        const response = await axios.get(`${url}/quiz/test`, {
            params: { quizId },
            headers: {
                'Content-Type': 'application/json',
                // Agar JWT token use kar rahe ho:
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            timeout: 6000
        });

        if (response.status === 200) {
            return {
                status: true,
                quiz: response.data.quiz
            };
        }
        return {
            status: false,
            message: 'Failed to fetch quiz'
        };
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message
            };
        }
        return {
            status: false,
            message: 'Network error or server not responding'
        };
    }
};

export const registerQuiz = async (quizId) => {
    try {
        const token = localStorage.getItem('token'); // JWT token
        if (!token) throw new Error('User not authenticated');

        const response = await axios.post(`${url}/quiz/registerQuiz`, null, {
            params: { quizId },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            timeout: 6000
        });

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                attempt: response.data.attempt,
                quizDetails: response.data.quizDetails
            };
        }
        return {
            status: false,
            message: 'Failed to register for quiz'
        };
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message
            };
        }
        return {
            status: false,
            message: error.message || 'Network error or server not responding'
        };
    }
};

export const startQuiz = async (quizId) => {
    try {
        const token = localStorage.getItem('token'); // JWT token
        console.log(quizId);
        
        const response = await axios.post(
            `${url}/quiz/startquiz`,
            null,
            {
                params: { quizId },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 6000
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                attempt: response.data.attempt,
                shuffledQuestions: response.data.attempt.shuffledQuestions,
                user:response.data.user
            };
        }

        return {
            status: false,
            message: 'Failed to start quiz'
        };
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || 'Server error'
            };
        }
        return {
            status: false,
            message: error.message || 'Network error or server not responding'
        };
    }
};

export const getQuizAttempt = async (userId, quizId) => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${url}/quiz/quizstart`, {
            params: { userId, quizId },
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (e) {
        console.error('getQuizAttempt error:', e.response?.data || e.message);
        return { status: false, message: e.response?.data?.message || e.message };
    }
};

export const getAttemptedQuizzes = async () => {
    try {
        const token = localStorage.getItem('token'); // JWT token

        const response = await axios.get(
            `${url}/quiz/attempted/quizzes`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 6000
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                totalAttempts: response.data.totalAttempts,
                attempts: response.data.attempts
            };
        }

        return {
            status: false,
            message: 'Failed to fetch attempted quizzes'
        };
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || 'Server error'
            };
        }
        return {
            status: false,
            message: error.message || 'Network error or server not responding'
        };
    }
};

export const deleteQuiz = async (quizId) => {
    try {
        const token = localStorage.getItem('token'); // JWT token

        const response = await axios.delete(
            `${url}/quiz/deletequiz`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    quizId, // Query param
                },
                timeout: 6000,
            }
        );

        if (response.status === 200 && response.data.status) {
            return {
                status: true,
                message: response.data.message
            };
        }

        return {
            status: false,
            message: response.data.message || 'Failed to delete quiz'
        };
    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || 'Server error'
            };
        }
        return {
            status: false,
            message: error.message || 'Network error or server not responding'
        };
    }
};

export const getQuizParticipants = async (quizId) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
            `${url}/quiz/participants`,
            {
                params: { quizId },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 6000,
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                quizId: response.data.quizId,
                quizName: response.data.quizName,
                totalParticipants: response.data.totalParticipants,
                participants: response.data.participants,
            };
        }

        return {
            status: false,
            message: 'Failed to fetch quiz participants',
        };

    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || 'Server error',
            };
        }

        return {
            status: false,
            message: error.message || 'Network error or server not responding',
        };
    }
};




export const submitQuiz = async (quizId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${url}/quiz/submitQuiz`,
            null, // body nahi hai, sirf params ja rahe hain
            {
                params: { quizId },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                timeout: 6000,
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                result: response.data.result,
                percentage: response.data.percentage,
                marksObtained: response.data.marksObtained,
                attempt: response.data.attempt,
            };
        }

        return {
            status: false,
            message: "Failed to submit quiz",
        };

    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || error.response.data || "Server error",
            };
        }

        return {
            status: false,
            message: error.message || "Network error or server not responding",
        };
    }
};

export const submitAnswer = async (quizAttemptId, questionId, selectedOption) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${url}/quiz/submit-answer`,
            null, // body nahi hai, params ke through ja rahe
            {
                params: { quizAttemptId, questionId, selectedOption },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                timeout: 6000,
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                attempt: response.data.attempt,
            };
        }

        return {
            status: false,
            message: "Failed to submit answer",
        };

    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || error.response.data || "Server error",
            };
        }

        return {
            status: false,
            message: error.message || "Network error or server not responding",
        };
    }
};

export const addDisturbance = async (attemptId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${url}/quiz/disturbance`,
            null, // body nahi, sirf params
            {
                params: { attemptId },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                timeout: 6000,
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.message,
                totalDisturbance: response.data.totalDisturbance,
                endQuiz: response.data.endQuiz,
                quizStatus: response.data.status,
            };
        }

        return { status: false, message: "Failed to add disturbance" };

    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message: error.response.data.message || "Server error",
            };
        }
        return { status: false, message: error.message || "Network error" };
    }
};



export const addMultipleQuestions = async (quizId, questionList) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${url}/quiz/addMultipleQues`,
            questionList, // array of questions
            {
                params: { quizId },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                timeout: 8000,
            }
        );

        if (response.status === 200) {
            return {
                status: true,
                message: response.data.Message || "Questions added successfully",
                addedQuestions: response.data.AddedQuestions,
                skippedQuestions: response.data.SkippedQuestions,
                totalNow: response.data.TotalNow,
            };
        }

        return {
            status: false,
            message: "Failed to add questions",
        };

    } catch (error) {
        if (error.response) {
            return {
                status: false,
                message:
                    error.response.data.message ||
                    error.response.data ||
                    "Server error",
            };
        }

        return {
            status: false,
            message: error.message || "Network error",
        };
    }
}