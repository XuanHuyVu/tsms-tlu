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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
