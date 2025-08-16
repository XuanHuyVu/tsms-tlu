import React, { useState } from 'react';
import '../../../styles/RegisterLeaveModal.css';

const RegisterLeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    scheduleId: '',
    date: '',
    period: '',
    department: '',
    faculty: '',
    scheduleType: '',
    room: '',
    reason: '',
    evidence: null
  });

  const [schedules] = useState([
    { id: 1, name: "Lập trình phần tán-2-24 (CSE423_001)" },
    { id: 2, name: "Công nghệ phần mềm-2-24 (CSE481_002)" },
    { id: 3, name: "Cơ sở dữ liệu-2-24 (CSE301_001)" }
  ]);

  const periods = [
    { value: "1-3", label: "Tiết 1-3 (7:00-9:40)" },
    { value: "4-6", label: "Tiết 4-6 (9:45-12:25)" },
    { value: "5-6", label: "Tiết 5-6 (10:40-12:25)" },
    { value: "7-9", label: "Tiết 7-9 (13:00-15:35)" },
    { value: "9-10", label: "Tiết 9-10 (15:00-16:30)" },
    { value: "10-12", label: "Tiết 10-12 (15:40-18:20)" }
  ];

  const departments = [
    { value: "CNPM", label: "Công nghệ phần mềm" },
    { value: "HTTT", label: "Hệ thống thông tin" },
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      evidence: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      scheduleId: '',
      date: '',
      period: '',
      department: '',
      faculty: '',
      scheduleType: '',
      room: '',
      reason: '',
      evidence: null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>ĐĂNG KÝ NGHỈ DẠY</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Lớp học phần: <span className="required">*</span></label>
              <select
                name="scheduleId"
                value={formData.scheduleId}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn lớp học phần--</option>
                {schedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày giảng: <span className="required">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                required
              />
            </div>
            <div className="form-group">
              <label>Tiết học: <span className="required">*</span></label>
              <select
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                required
              >
                <option value="">--Chọn tiết học--</option>
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
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
              <label>Lí do đăng ký nghỉ dạy: <span className="required">*</span></label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Nhập lí do đăng ký nghỉ dạy"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Minh chứng: <span className="required">*</span></label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="evidence"
                  name="evidence"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  required
                />
                <label htmlFor="evidence" className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span>Ảnh minh hoạ</span>
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

export default RegisterLeaveModal;
