import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",          // proxy => http://localhost:8080
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const isAuthPath = (url = "") => {
  // Chuẩn hoá để check path, tránh dính baseURL tuyệt đối
  const u = String(url);
  // chấp cả dạng "/auth/login", "auth/login", "/api/auth/login" (phòng TH gọi full)
  return (
    u.includes("/auth/login") ||
    u.includes("/auth/refresh") ||
    u.includes("/auth/register")
  );
};

// Gắn token trừ các auth endpoints
axiosInstance.interceptors.request.use(
  (config) => {
    if (!isAuthPath(config.url)) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // đảm bảo không lẫn token cũ khi login
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi toàn cục
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.error("Lỗi API:", error.response || error.message);

    // Tránh redirect vòng lặp ở trang login
    if (status === 401 && !isAuthPath(error?.config?.url)) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
