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