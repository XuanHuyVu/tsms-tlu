import React, { useState } from "react";
import "../../../styles/TeacherDashboard.css";
import ViewScheduleModal from "../schedule/ViewScheduleModal";
import {
  FaChalkboardTeacher,
  FaClock,
  FaBook,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";

const TeacherDashboard = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [upcomingClasses] = useState([
    {
      id: 1,
      course: "Lập trình phân tán-2-24 (CSE423_001)",
      type: "Thực hành",
      day: "Thứ 5, ngày 31/7/2025",
      room: "208 - B5",
      period: "Tiết 1 – 3 (7:00 - 9:40)",
      content: "Semaphore & Monitor",
      materials: "Tài liệu tham khảo.pdf",
      department: "Công nghệ thông tin",
      faculty: "Khoa Công nghệ thông tin",
    },
    {
      id: 2,
      course: "Công nghệ phần mềm-2-24 (CSE481_002)",
      type: "Lý thuyết",
      day: "Thứ 6, ngày 1/8/2025",
      room: "209 - B5",
      period: "Tiết 10 – 12 (16:20 - 19:00)",
      content: "Quy trình phát triển phần mềm",
      materials: "Slide bài giảng.pptx",
      department: "Công nghệ thông tin",
      faculty: "Khoa Công nghệ thông tin",
    },
  ]);

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const dashboardStats = [
    { id: 1, title: "45h đã dạy", icon: FaClock, color: "blue" },
    { id: 2, title: "15h sắp dạy", icon: FaCalendarAlt, color: "green" },
    { id: 3, title: "5h dạy bù", icon: FaBook, color: "orange" },
    { id: 4, title: "2 lớp đang dạy", icon: FaChalkboardTeacher, color: "purple" },
  ];

  return (
    <>
      <div className="teaching-dashboard">
        {/* Statistics Cards */}
        <div className="stats-grid">
          {dashboardStats.map((stat) => (
            <div key={stat.id} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-icon">
                <stat.icon />
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Classes */}
        <div className="upcoming-section">
          <div className="schedule-content-wrapper">
            <div className="schedule-content">
              <div className="section-header">
                <h2>Lịch dạy sắp tới</h2>
              </div>

              <div className="classes-list">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="class-card">
                    <div className="card-left-accent"></div>
                    <div className="card-content">
                      <div className="class-header">
                        <div className="class-title">
                          <h3>{classItem.course}</h3>
                        </div>
                        <div className="class-actions">
                          <button
                            className="action-btn"
                            title="Xem chi tiết"
                            onClick={() => handleViewDetails(classItem)}
                          >
                            <FaInfoCircle />
                          </button>
                        </div>
                      </div>

                      <div className="class-info">
                        <div className="info-row">
                          <FaCalendarAlt className="info-icon" />
                          <span>{classItem.day}</span>
                        </div>
                        <div className="info-row">
                          <FaBook className="info-icon" />
                          <span>{classItem.type}</span>
                          <FaMapMarkerAlt
                            className="info-icon"
                            style={{ marginLeft: "12px" }}
                          />
                          <span>{classItem.room}</span>
                        </div>
                        <div className="info-row">
                          <FaClock className="info-icon" />
                          <span>{classItem.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Schedule Modal */}
      <ViewScheduleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        scheduleData={selectedSchedule}
      />
    </>
  );
};

export default TeacherDashboard;