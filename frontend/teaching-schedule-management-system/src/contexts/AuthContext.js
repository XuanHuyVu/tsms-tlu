// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/axiosInstance"; // ✅ import helper bạn đã viết

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // ✅ login nhận { token, user } và set vào axiosInstance
  const login = (data, rememberMe = false) => {
    if (!data?.token || !data?.user) {
      console.error("login() needs shape: { token, user }");
      return;
    }
    setIsLoggedIn(true);
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setAuthToken(data.token); // ✅ gắn Authorization mặc định

    if (rememberMe) localStorage.setItem("rememberMe", "true");
    else localStorage.removeItem("rememberMe");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);

    // ✅ clear hết và tháo Authorization mặc định
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    setAuthToken(null);
  };

  // ✅ Hydrate: khôi phục state + gắn token vào axiosInstance
  useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn");
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    try {
      if (savedLoginState === "true" && savedUser && savedToken) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setAuthToken(savedToken); // ✅ gắn lại cho axiosInstance
      } else {
        setAuthToken(null);
      }
    } catch {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthToken(null);
    } finally {
      setReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
