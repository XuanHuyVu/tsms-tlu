import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/AccountForm.css";

const AccountForm = ({ onClose, editData }) => {
  const [formData, setFormData] = useState({
    username: editData?.tenDangNhap || "",
    password: editData ? "••••••••" : "", // Hiển thị dấu chấm khi sửa
    role: editData?.vaiTro === "Admin" ? "admin" : editData?.vaiTro === "Giảng viên" ? "user" : editData?.vaiTro === "Sinh viên" ? "manager" : "",
  });

  const isEditing = !!editData; // Kiểm tra có phải đang sửa không

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gửi formData lên API hoặc xử lý tiếp
    if (isEditing) {
      console.log("Cập nhật tài khoản:", formData);
    } else {
      console.log("Tạo tài khoản:", formData);
    }
    onClose();
  };

  return (
    <div className="account-form-modal">
      <form className="form-grid no-card" onSubmit={handleSubmit}>
        <div className="form-title">
          <span>{isEditing ? "SỬA TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI"}</span>
          <FaTimes className="close" onClick={onClose} />
        </div>

        <div className="form-group">
          <label>Tên đăng nhập: <span>*</span></label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu: <span>*</span></label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Vai trò: <span>*</span></label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Giảng viên</option>
            <option value="manager">Sinh viên</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">{isEditing ? "Cập nhật" : "Xác nhận"}</button>
          <button type="button" onClick={onClose} className="cancel-btn">Hủy bỏ</button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;