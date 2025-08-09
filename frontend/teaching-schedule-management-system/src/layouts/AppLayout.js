import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../features/admin/dashboard/Dashboard';
// import TeacherDashboard from '../features/teacher/dashboard/TeacherDashboard';
import StudentDashboard from '../features/student/dashboard/StudentDashboard';
import TeacherList from '../features/admin/teachers/TeacherList';
import AccountList from '../features/admin/accounts/AccountList';
import DepartmentList from '../features/admin/departments/DepartmentList';
import FacultyList from '../features/admin/faculties/FacultyList';
import Header from '../components/Header';
import '../styles/AppLayout.css';
import TeacherLayout from "./TeacherLayout";
import SemesterList from '../features/admin/semesters/SemesterList';
import RoomList from '../features/admin/rooms/RoomList';
import SubjectList from '../features/admin/subjects/SubjectList';
function AppLayout() {
  return (
    <Routes>
      <Route path="/teacher-dashboard/*" element={<TeacherLayout />} />
      
      <Route path="/*" element={
        <div className="app-layout" style={{ display: 'flex' }}>
          <Sidebar />

          <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Header />

            <div className="content-area" style={{ flex: 1, padding: '20px' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/accounts" element={<div><AccountList /></div>} />
                <Route path="/departments" element={<div><DepartmentList /></div>} />
                <Route path="/semesters" element={<div><SemesterList /></div>} />
                <Route path="/rooms" element={<div><RoomList /></div>} />
                <Route path="/faculties" element={<div><FacultyList /></div>} />
                <Route path="/subjects" element={<div><SubjectList /></div>} />
                {/* Thêm các route khác tại đây */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default AppLayout;
