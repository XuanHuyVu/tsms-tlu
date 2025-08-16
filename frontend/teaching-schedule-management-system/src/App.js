import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/LoginPage';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isLoggedIn, isLoading } = useAuth();

  // loading spinner khi AuthContext đang khởi tạo
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* mặc định chuyển về /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* mọi route còn lại – chỉ vào được khi đã login */}
        <Route
          path="/*"
          element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
