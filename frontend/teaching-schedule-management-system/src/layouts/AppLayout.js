import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../features/admin/dashboard/Dashboard';
import TeacherList from '../features/admin/teachers/TeacherList';
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
            <Route path="/teachers" element={<TeacherList />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default AppLayout;
