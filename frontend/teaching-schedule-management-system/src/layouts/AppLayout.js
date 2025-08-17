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
import ClassSectionList from '../features/admin/class_sections/ClassSectionList';
import ScheduleChangeList from '../features/admin/schedulechanges/ScheduleChangeList';
import TeachingScheduleList from '../features/admin/teaching_schedules/TeachingScheduleList';
import MajorList from '../features/admin/majors/MajorList';
import StudentClassSectionList from '../features/admin/student-class-sections/StudentClassSectionList';
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
                <Route path="/class-sections" element={<div><ClassSectionList /></div>} />
                <Route path="/schedulechanges" element={<div><ScheduleChangeList /></div>} />
                <Route path="/teaching-schedules" element={<div><TeachingScheduleList /></div>} />
                <Route path="/majors" element={<div><MajorList /></div>} />
                <Route path="/student-class-sections" element={<div><StudentClassSectionList defaultStudentId={null} /></div>} />
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
