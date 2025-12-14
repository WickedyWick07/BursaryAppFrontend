import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < (currentTime + 60);
  } catch {
    return true;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      if (isTokenExpired(token)) {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, { refresh: refreshToken });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          config.headers.Authorization = `Bearer ${access}`;
        } catch {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/signup';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
