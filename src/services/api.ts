import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const deployBot = async (token: string, status: any) => {
  const response = await axios.post(`${API_URL}/bots/deploy`, { token, status });
  return response.data;
};

export const updateBotStatus = async (botId: string, status: any) => {
  const response = await axios.put(`${API_URL}/bots/${botId}/status`, { status });
  return response.data;
};

export const getAllBots = async () => {
  const response = await axios.get(`${API_URL}/bots`);
  return response.data;
};