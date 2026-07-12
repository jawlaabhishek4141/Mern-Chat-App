import axios from 'axios';
import { getToken, clearSession } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Attach the JWT to every outgoing request, if we have one.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors into a single readable message, and force a logout if
// the token is rejected/expired so the app doesn't sit in a broken state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Could not reach the server. Is the backend running?'));
    }

    if (error.response.status === 401) {
      clearSession();
      // Full reload so all in-memory auth state resets cleanly.
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const message = error.response.data?.error || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
export { API_BASE_URL };
