import React, { useState } from "react";
import "../../../styles/TeacherDashboard.css";
import CreateScheduleModal from "../schedule/CreateScheduleModal";
import ViewScheduleModal from "../schedule/ViewScheduleModal";
import EditScheduleModal from "../schedule/EditScheduleModal";
import {
  FaChalkboardTeacher,
  FaClock,
  FaBook,
  FaCalendarAlt,
  FaPlus,
  FaMapMarkerAlt,
  FaUsers,
  FaPen,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([
    {
      id: 1,
      course: "Lập trình phân tán-2-24",
      courseCode: "CSE423_001",
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
      course: "Công nghệ phần mềm-2-24",
      courseCode: "CSE481_002",
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

  const handleCreateSchedule = (scheduleData) => {
    // Tạo lịch dạy mới
    const newSchedule = {
      id: upcomingClasses.length + 1,
      course:
        scheduleData.course === "CSE423_001"
          ? "Lập trình phân tán-2-24"
          : scheduleData.course === "CSE481_002"
          ? "Công nghệ phần mềm-2-24"
          : scheduleData.course === "CSE350_003"
          ? "Cơ sở dữ liệu-2-24"
          : "Khóa học khác",
      courseCode: scheduleData.course,
      type:
        scheduleData.type === "thuc-hanh"
          ? "Thực hành"
          : scheduleData.type === "ly-thuyet"
          ? "Lý thuyết"
          : scheduleData.type === "bai-tap"
          ? "Bài tập"
          : scheduleData.type,
      day: formatDate(scheduleData.date),
      room: scheduleData.room,
      period:
        scheduleData.period === "1-3"
          ? "Tiết 1 – 3 (7:00 - 9:40)"
          : scheduleData.period === "4-6"
          ? "Tiết 4 – 6 (9:50 - 12:30)"
          : scheduleData.period === "7-9"
          ? "Tiết 7 – 9 (13:30 - 16:10)"
          : scheduleData.period === "10-12"
          ? "Tiết 10 – 12 (16:20 - 19:00)"
          : scheduleData.period,
      content: scheduleData.content || "",
      materials: scheduleData.materials?.name || "",
      department:
        scheduleData.department === "cntt"
          ? "Công nghệ thông tin"
          : scheduleData.department === "ktmt"
          ? "Kỹ thuật máy tính"
          : scheduleData.department === "httt"
          ? "Hệ thống thông tin"
          : "Công nghệ thông tin",
      faculty:
        scheduleData.faculty === "cntt"
          ? "Khoa Công nghệ thông tin"
          : scheduleData.faculty === "ktxd"
          ? "Khoa Kỹ thuật xây dựng"
          : scheduleData.faculty === "ktthuy"
          ? "Khoa Kỹ thuật thủy lợi"
          : "Khoa Công nghệ thông tin",
    };

    // Thêm vào danh sách
    setUpcomingClasses((prev) => [...prev, newSchedule]);

    // Đóng modal
    setIsModalOpen(false);

    // Thông báo thành công
    alert("Tạo lịch dạy thành công!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${dayName}, ngày ${day}/${month}/${year}`;
  };

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleUpdateSchedule = (updatedData) => {
    console.log("Updating schedule with data:", updatedData); // Debug log

    // Cập nhật lịch dạy trong danh sách
    setUpcomingClasses((prev) =>
      prev.map((item) =>
        item.id === updatedData.id
          ? {
              ...item,
              course:
                updatedData.course === "CSE423_001"
                  ? "Lập trình phân tán-2-24"
                  : updatedData.course === "CSE481_002"
                  ? "Công nghệ phần mềm-2-24"
                  : updatedData.course === "CSE350_003"
                  ? "Cơ sở dữ liệu-2-24"
                  : "Khóa học khác",
              courseCode: updatedData.course,
              type:
                updatedData.type === "thuc-hanh"
                  ? "Thực hành"
                  : updatedData.type === "ly-thuyet"
                  ? "Lý thuyết"
                  : updatedData.type === "bai-tap"
                  ? "Bài tập"
                  : updatedData.type,
              day: formatDate(updatedData.date),
              room: updatedData.room.includes("-")
                ? updatedData.room.replace(/-/g, " - ")
                : updatedData.room,
              period:
                updatedData.period === "1-3"
                  ? "Tiết 1 – 3 (7:00 - 9:40)"
                  : updatedData.period === "4-6"
                  ? "Tiết 4 – 6 (9:50 - 12:30)"
                  : updatedData.period === "7-9"
                  ? "Tiết 7 – 9 (13:30 - 16:10)"
                  : updatedData.period === "10-12"
                  ? "Tiết 10 – 12 (16:20 - 19:00)"
                  : updatedData.period,
              content: updatedData.content || item.content,
              materials: updatedData.materials?.name || item.materials,
              department:
                updatedData.department === "cntt"
                  ? "Công nghệ thông tin"
                  : updatedData.department === "ktmt"
                  ? "Kỹ thuật máy tính"
                  : updatedData.department === "httt"
                  ? "Hệ thống thông tin"
                  : "Công nghệ thông tin",
              faculty:
                updatedData.faculty === "cntt"
                  ? "Khoa Công nghệ thông tin"
                  : updatedData.faculty === "ktxd"
                  ? "Khoa Kỹ thuật xây dựng"
                  : updatedData.faculty === "ktthuy"
                  ? "Khoa Kỹ thuật thủy lợi"
                  : "Khoa Công nghệ thông tin",
            }
          : item
      )
    );

    // Đóng modal
    setIsEditModalOpen(false);
    setSelectedSchedule(null);

    // Thông báo thành công
    alert("Cập nhật lịch dạy thành công!");
  };

  const handleDeleteSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (schedule) => {
    // Xóa lịch dạy khỏi danh sách
    setUpcomingClasses((prev) =>
      prev.filter((item) => item.id !== schedule.id)
    );

    // Đóng modal
    setIsDeleteModalOpen(false);
    setSelectedSchedule(null);

    // Thông báo thành công
    alert("Xóa lịch dạy thành công!");
  };

  const dashboardStats = [
    {
      id: 1,
      title: "45h đã dạy",
      icon: FaClock,
      color: "blue",
    },
    {
      id: 2,
      title: "15h sắp dạy",
      icon: FaCalendarAlt,
      color: "green",
    },
    {
      id: 3,
      title: "5h dạy bù",
      icon: FaBook,
      color: "orange",
    },
    {
      id: 4,
      title: "2 lớp đang dạy",
      icon: FaChalkboardTeacher,
      color: "purple",
    },
  ];

  return (
    <>
      <div className={`teaching-dashboard ${isModalOpen ? "modal-open" : ""}`}>
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
          <div className="section-header">
            <h2>Lịch dạy sắp tới</h2>
            <button
              className="btn-secondary"
              onClick={() => setIsModalOpen(true)}
            >
              + Tạo lịch dạy
            </button>
          </div>

          <div className="classes-list">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="class-card">
                <div className="class-header">
                  <div className="class-title">
                    <h3>
                      {classItem.course}
                      <span className="course-code">
                        {classItem.courseCode}
                      </span>
                    </h3>
                  </div>
                  <div className="class-actions">
                    <button
                      className="action-btn"
                      title="Xem chi tiết"
                      onClick={() => handleViewDetails(classItem)}
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      className="action-btn"
                      title="Chỉnh sửa"
                      onClick={() => handleEditSchedule(classItem)}
                    >
                      <FaPen />
                    </button>
                    <button
                      className="action-btn danger"
                      title="Xóa"
                      onClick={() => handleDeleteSchedule(classItem)}
                    >
                      <FaTrash />
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
            ))}
          </div>
        </div>
      </div>

      {/* Create Schedule Modal - Outside dashboard div */}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSchedule}
      />

      {/* View Schedule Modal */}
      <ViewScheduleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        scheduleData={selectedSchedule}
      />

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateSchedule}
        scheduleData={selectedSchedule}
      />

      {/* Delete Schedule Modal */}
      <CreateScheduleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleConfirmDelete}
        mode="delete"
        scheduleData={selectedSchedule}
      />
    </>
  );
};

export default TeacherDashboard;
