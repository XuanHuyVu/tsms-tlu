import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000, 
});

// Interceptor thêm token vào header nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi toàn cục (nếu cần)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Lỗi API:', error.response || error.message);
    // Có thể redirect đến trang login nếu lỗi 401:
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
