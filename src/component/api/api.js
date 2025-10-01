import axios from "axios";

const url = "http://localhost:8080/api";

export const LoginUser = async (data) => {
    try {
        const response = await axios.post(`${url}/user/login`, data, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
                code: localStorage.getItem("code"),
            },
        });

        if (response.status === 200) {
            return {
                status: true,
                token: response.data.token,
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

export const SignupUser = async (data) => {
    try {
        const response = await axios.post(`${url}/signup`, data, {
            withCredentials: true,
            timeout: 6000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201) {
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
            message: "Network issue or server not responding",
        };
    }
};
