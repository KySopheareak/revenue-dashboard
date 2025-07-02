import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
// const AUTH_API_BASE_URL = 'http://localhost:5000/auth';

export const LoginAccount = async (username: string, password: string ) => {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { username: username, password: password });
    return response.data;
}
