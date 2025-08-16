import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Cho phép truyền rememberMe để giữ đăng nhập lâu hơn (tuỳ bạn xử lý thêm)
  const login = (userData, rememberMe = false) => {
    setIsLoggedIn(true);
    setUser(userData);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));

    // Token đã được đặt ở LoginPage (nếu muốn, có thể set ở đây)
    // Nếu cần rememberMe nâng cao → có thể set thêm thời gian hết hạn, cookie...
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
  };

  // Khôi phục trạng thái đăng nhập từ localStorage khi khởi động
  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    const savedUser = localStorage.getItem("user");

    if (savedLoginState === "true" && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUser(parsed);
      } catch {
        // nếu lỗi parse thì xoá để tránh crash
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
