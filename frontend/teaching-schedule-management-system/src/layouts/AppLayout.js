import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../features/admin/dashboard/Dashboard';
import TeacherDashboard from '../features/teacher/dashboard/TeacherDashboard';
import StudentDashboard from '../features/student/dashboard/StudentDashboard';
import TeacherList from '../features/admin/teachers/TeacherList';
import AccountList from '../features/admin/accounts/AccountList';
import Header from '../components/Header';
import '../styles/AppLayout.css'; // Assuming you have a CSS file for layout styles

function AppLayout() {
  return (
    <div className="app-layout" style={{ display: 'flex' }}>
      <Sidebar />

      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <div className="content-area" style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/accounts" element={<div><AccountList /></div>} />
            {/* Tất cả routes khác tạm thời chuyển về Dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default AppLayout;
