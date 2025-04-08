import axios from 'axios';
import { config } from '../config/index';

export const apiUser = axios.create({
  baseURL: `${config.BACK_URL}/users`,
  withCredentials: true,
});

apiUser.interceptors.request.use((request) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});
