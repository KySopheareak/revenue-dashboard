import { GridRowsProp } from '@mui/x-data-grid';
import axios from 'axios';
import { IOrder } from 'functions/common-interface';

const API_BASE_URL = 'http://localhost:5000/api';

export const getOrderStatus = async (searchText = '', searchDate?: Date | null): Promise<GridRowsProp> => {
    const response = await axios.post(`${API_BASE_URL}/order/list`, { search: searchText, date: searchDate });
    return response.data.data;
};

export const getProductStats = async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/product/stats`);
    return response.data.data;
}

export const getProducts = async () => {
    const response = await axios.post(`${API_BASE_URL}/products`);
    return response.data.data.products;
}

export const getOrderStats = async () => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/order/stats`);
    return response.data.data;
}

export const createOrder = async (orderData: IOrder) => {
    const response = await axios.post(`${API_BASE_URL}/order`, orderData);
    return response.data.data;
}

export const getOrderById = async (orderId: string) => {
    const response = await axios.get(`${API_BASE_URL}/order/${orderId}`);
    return response.data.data;
}

export const deleteOrder = async (orderId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/order/${orderId}/delete`);
    return response.data;
}

export const userList = async (searchText?: string):Promise<GridRowsProp> => {
    const response = await axios.post(`${API_BASE_URL}/user/list`, { search: searchText });
    return response.data.data.users;
}

export const createUser = async (userData: { username: string; email: string; password: string; type: string }) => {
    const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
    return response.data.data;
}