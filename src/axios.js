// src/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://mobile-backend-omega.vercel.app/', // ou a URL do seu backend hospedado
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
