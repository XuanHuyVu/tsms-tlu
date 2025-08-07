// src/features/teacher/schedule/ViewScheduleModal.js
import React from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/ViewScheduleModal.css";

const ViewScheduleModal = ({ isOpen, onClose, scheduleData }) => {
  if (!isOpen || !scheduleData) return null;

  return (
    <div className="modal-overlay">
      <div className="view-modal-container">
        <div className="view-modal-header">
          <h2>CHI TIẾT LỊCH DẠY</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="view-modal-content">
          <div className="info-row">
            <div className="info-group full-width">
              <label>
                Lớp học phần: <span className="required">*</span>
              </label>
              <div className="info-display">
                {scheduleData.course} ({scheduleData.courseCode})
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>
                Bộ môn quản lý: <span className="required">*</span>
              </label>
              <div className="info-display">{scheduleData.department || "Công nghệ thông tin"}</div>
            </div>
            <div className="info-group">
              <label>
                Khoa quản lý: <span className="required">*</span>
              </label>
              <div className="info-display">{scheduleData.faculty || "Khoa Công nghệ thông tin"}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>
                Ngày giảng: <span className="required">*</span>
              </label>
              <div className="info-display">{scheduleData.day}</div>
            </div>
            <div className="info-group">
              <label>
                Tiết học: <span className="required">*</span>
              </label>
              <div className="info-display">{scheduleData.period}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>
                Phòng học: <span className="required">*</span>
              </label>
              <div className="info-display">{scheduleData.room}</div>
            </div>
            <div className="info-group">
              <label>
                Loại lịch học: <span className="required">*</span>
              </label>
              <div className="info-display">{scheduleData.type}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group full-width">
              <label>Nội dung bài giảng:</label>
              <div className="content-display">
                {scheduleData.content || "Chưa có nội dung"}
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group full-width">
              <label>Tài liệu:</label>
              <div className="info-display">
                {scheduleData.materials ? "📄 " + scheduleData.materials : "Chưa có tài liệu"}
              </div>
            </div>
          </div>

          <div className="view-modal-footer">
            <button className="btn-close" onClick={onClose}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScheduleModal;
