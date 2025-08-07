import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./features/auth/LoginPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { isLoggedIn, isLoading, user } = useAuth();

  // Hiển thị loading screen khi đang khôi phục auth state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Nếu chưa đăng nhập thì chuyển sang /login */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route chính, chỉ vào nếu đã đăng nhập */}
        <Route
          path="/*"
          element={
            isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;
