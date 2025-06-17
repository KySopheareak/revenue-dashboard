import { GridRowsProp } from '@mui/x-data-grid';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getOrderStatus = async (searchText = ''): Promise<GridRowsProp> => {
  const response = await axios.post(`${API_BASE_URL}/order/list`, { search: searchText });
  return response.data.data;
};