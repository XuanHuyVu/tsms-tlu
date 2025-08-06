import React, { useState } from 'react';
import '../../../styles/TeacherForm.css';

const TeacherForm = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    maGV: '',
    hoTen: '',
    gioiTinh: '',
    ngaySinh: '',
    email: '',
    sdt: '',
    khoa: '',
    boMon: '',
    trangThai: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-teacher-overlay">
      <div className="modal-teacher-content">
        <div className="modal-teacher-header">
          <h2>THÊM GIẢNG VIÊN MỚI</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="teacher-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã giảng viên: *</label>
              <input name="maGV" value={formData.maGV} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Họ tên: *</label>
              <input name="hoTen" value={formData.hoTen} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Giới tính: *</label>
              <select name="gioiTinh" value={formData.gioiTinh} onChange={handleChange} required>
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh: *</label>
              <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email: *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Số điện thoại: *</label>
              <input name="sdt" value={formData.sdt} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Khoa quản lý: *</label>
              <select name="khoa" value={formData.khoa} onChange={handleChange} required>
                <option value="">-- Chọn khoa phụ trách --</option>
                <option value="CNTT">Công nghệ thông tin</option>
                <option value="KT">Kinh tế</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bộ môn quản lý: *</label>
              <select name="boMon" value={formData.boMon} onChange={handleChange} required>
                <option value="">-- Chọn bộ môn --</option>
                <option value="HTTT">Hệ thống thông tin</option>
                <option value="CNPM">Công nghệ phần mềm</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái: *</label>
              <select name="trangThai" value={formData.trangThai} onChange={handleChange} required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Xác nhận</button>
            <button type="button" className="cancel-button" onClick={onClose}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
