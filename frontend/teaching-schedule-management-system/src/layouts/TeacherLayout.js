// src/layouts/TeacherLayout.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import SidebarTeacher from "../components/SidebarTeacher";
import HeaderTeacher from "../components/HeaderTeacher";
import TeacherDashboard from "../features/teacher/dashboard/TeacherDashboard";

import "../styles/TeacherLayout.css";

function TeacherLayout() {
  return (
    <div className="teacher-layout">
      <SidebarTeacher />

      <div className="teacher-main-content">
        <HeaderTeacher />

        <div className="teacher-content-area">
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default TeacherLayout;
