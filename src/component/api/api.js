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