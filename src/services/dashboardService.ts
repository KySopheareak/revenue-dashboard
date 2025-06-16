import axios from 'axios';

// Fetch dashboard summary data
export const getDashboardSummary = () => {
  return axios.get('/api/dashboard/summary');
};

// Fetch dashboard statistics
export const getDashboardStats = () => {
  return axios.get('/api/dashboard/stats');
};

// Fetch recent activities for the dashboard
export const getRecentActivities = () => {
  return axios.get('/api/dashboard/activities');
};