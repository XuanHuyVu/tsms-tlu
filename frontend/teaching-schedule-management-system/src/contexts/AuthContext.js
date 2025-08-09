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
  const [isLoading, setIsLoading] = useState(true); // Thêm loading state

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    // Thiết lập thời gian hết hạn token (6 giờ = 21600 giây)
    const tokenExpiry = Math.floor(Date.now() / 1000) + (6 * 60 * 60); // 6h
    localStorage.setItem('tokenExpiry', tokenExpiry.toString());
    
    // Lưu token vào localStorage nếu cần
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log("Token sẽ hết hạn lúc:", new Date(tokenExpiry * 1000));
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
    if (!token) {
      console.log("No token found");
      return false;
    }
    
    try {
      // Kiểm tra token có đúng format JWT không (3 phần phân cách bởi dấu chấm)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log("Not a JWT token, assuming valid");
        return true; // Không phải JWT, coi như valid
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log("Token payload:", payload);
      
      // Nếu không có exp field, coi như token không hết hạn
      if (!payload.exp) {
        console.log("No expiration time, token assumed valid");
        return true;
      }
      
      const currentTime = Date.now() / 1000;
      console.log("Token exp:", payload.exp, "Current time:", currentTime);
      
      const isValid = payload.exp > currentTime;
      console.log("Token is valid:", isValid);
      return isValid;
    } catch (error) {
      console.log("Token validation error:", error);
      return true; // Lỗi parse thì coi như valid
    }
  };

  // Auto logout khi token hết hạn
  const checkTokenExpiry = () => {
    if (isLoggedIn && !isTokenValid()) {
      console.log("Token expired, auto logout");
      logout();
    }
  };

  // Khôi phục trạng thái đăng nhập khi reload trang
  React.useEffect(() => {
    console.log("=== AUTH CONTEXT DEBUG ===");
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    console.log("savedLoginState:", savedLoginState);
    console.log("savedUser:", savedUser);
    console.log("savedToken:", savedToken ? "exists" : "null");
    
    // Kiểm tra nếu có dữ liệu đăng nhập đã lưu
    if (savedLoginState === 'true' && savedUser) {
      if (savedToken) {
        // Kiểm tra token còn hợp lệ không
        const tokenValid = isTokenValid();
        console.log("Token valid:", tokenValid);
        
        if (tokenValid) {
          setIsLoggedIn(true);
          setUser(JSON.parse(savedUser));
          console.log("✅ Auto login restored from localStorage");
        } else {
          // Token hết hạn, xóa dữ liệu cũ
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          console.log("❌ Token expired, cleared localStorage");
        }
      } else {
        // Không có token, vẫn restore login (có thể backend không dùng JWT)
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
        console.log("✅ Auto login restored without token check");
      }
    } else {
      console.log("❌ No saved login data found");
    }
    
    // Đặt loading = false sau khi check xong
    setIsLoading(false);
    console.log("Auth initialization completed");
  }, []);

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    isTokenValid,
    checkTokenExpiry,
    isLoading // Thêm isLoading vào context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
