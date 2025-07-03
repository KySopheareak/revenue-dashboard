import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const AUTH_API_BASE_URL = 'http://localhost:5000/auth';

export const LoginAccount = async (username: string, password: string ) => {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { username: username, password: password });
    return response.data;
}

export const VerifyOTPMail = async ( email?: string, otp?: string) => {
    const response = await axios.post(`${AUTH_API_BASE_URL}/verify-otp`, { email, otp });
    return response.data;
}

export const ResendOTP = async (email: string) => {
    const response = await axios.post(`${AUTH_API_BASE_URL}/resend-otp`, { email });
    return response.data;
}