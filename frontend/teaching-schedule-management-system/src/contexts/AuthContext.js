import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    // Lưu token vào localStorage nếu cần
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Clear token khi logout
  };

  // Helper function để check token còn hợp lệ không
  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Auto logout khi token hết hạn
  const checkTokenExpiry = () => {
    if (isLoggedIn && !isTokenValid()) {
      console.log("Token expired, auto logout");
      logout();
    }
  };

  // Tạm thời tắt khôi phục tự động để luôn hiển thị login đầu tiên
  // React.useEffect(() => {
  //   const savedLoginState = localStorage.getItem('isLoggedIn');
  //   const savedUser = localStorage.getItem('user');
  //   
  //   if (savedLoginState === 'true' && savedUser) {
  //     setIsLoggedIn(true);
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, []);

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    isTokenValid,
    checkTokenExpiry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
