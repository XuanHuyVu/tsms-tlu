import React, { useState } from "react";
import "../../../styles/RegisterMakeupModal.css";

const RegisterMakeupModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    originalScheduleId: "",
    makeupDate: "",
    makeupTime: "",
    department: "",
    faculty: "",
    scheduleType: "",
    room: "",
    makeupScheduleDate: "",
    content: "",
    attachments: null
  });

  const [missedSchedules] = useState([
    {
      id: 1,
      name: "Lập trình phần tán-2-24 (CSE423_001) - Nghỉ ngày 31/7/2025",
    },
    {
      id: 2,
      name: "Công nghệ phần mềm-2-24 (CSE481_002) - Nghỉ ngày 29/7/2025",
    },
  ]);

  const timeSlots = [
    { value: "1-3", label: "Tiết 1-3 (7:00 - 9:40)" },
    { value: "4-6", label: "Tiết 4-6 (9:50 - 12:30)" },
    { value: "7-9", label: "Tiết 7-9 (12:55 - 15:35)" },
    { value: "10-12", label: "Tiết 10-12 (15:40 - 18:20)" },
  ];

  const departments = [
    { value: "CNTT", label: "Công nghệ thông tin" },
    { value: "DTVT", label: "Điện tử viễn thông" },
    { value: "KTXD", label: "Kỹ thuật xây dựng" }
  ];

  const faculties = [
    { value: "CNTT", label: "Khoa Công nghệ thông tin" },
    { value: "KT", label: "Khoa Kỹ thuật" }
  ];

  const scheduleTypes = [
    { value: "LT", label: "Lý thuyết" },
    { value: "TH", label: "Thực hành" },
    { value: "BT", label: "Bài tập" }
  ];

  const rooms = [
    { value: "B5-208", label: "B5-208" },
    { value: "B5-209", label: "B5-209" },
    { value: "A1-301", label: "A1-301" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      originalScheduleId: "",
      makeupDate: "",
      makeupTime: "",
      department: "",
      faculty: "",
      scheduleType: "",
      room: "",
      makeupScheduleDate: "",
      content: "",
      attachments: null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>ĐĂNG KÝ DẠY BÙ</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group full-width">
              <label>
                Lớp học phần: <span className="required">*</span>
              </label>
              <select
                name="originalScheduleId"
                value={formData.originalScheduleId}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn lớp học phần--</option>
                {missedSchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Ngày giảng: <span className="required">*</span>
              </label>
              <input
                type="date"
                name="makeupDate"
                value={formData.makeupDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                required
              />
            </div>
            <div className="form-group">
              <label>
                Tiết học: <span className="required">*</span>
              </label>
              <select
                name="makeupTime"
                value={formData.makeupTime}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn tiết học--</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bộ môn quản lý: <span className="required">*</span></label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn bộ môn quản lý--</option>
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Khoa quản lý: <span className="required">*</span></label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn khoa quản lý--</option>
                {faculties.map(faculty => (
                  <option key={faculty.value} value={faculty.value}>
                    {faculty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Loại lịch học: <span className="required">*</span></label>
              <select
                name="scheduleType"
                value={formData.scheduleType}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn loại lịch học--</option>
                {scheduleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Phòng học: <span className="required">*</span></label>
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn phòng học--</option>
                {rooms.map(room => (
                  <option key={room.value} value={room.value}>
                    {room.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>
                Ngày cần dạy bù: <span className="required">*</span>
              </label>
              <input
                type="date"
                name="makeupScheduleDate"
                value={formData.makeupScheduleDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Nội dung bài giảng:</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Nhập nội dung bài giảng"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Tài liệu:</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  style={{ display: 'none' }}
                />
                <label htmlFor="attachments" className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span>Tải file tài liệu</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-confirm">
              Xác nhận
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMakeupModal;
