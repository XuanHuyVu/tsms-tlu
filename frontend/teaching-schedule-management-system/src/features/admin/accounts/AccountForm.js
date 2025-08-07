import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/AccountForm.css";
import { useAuth } from "../../../contexts/AuthContext";
import { accountApi } from "../../../api/AccountApi";

const AccountForm = ({ onClose, editData, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: editData?.tenDangNhap || "",
    password: editData ? "••••••••" : "", // Hiển thị dấu chấm khi sửa
    role: editData?.vaiTro === "Admin" ? "Admin" : editData?.vaiTro === "Teacher" ? "Teacher" : editData?.vaiTro === "Student" ? "Student" : "",
    description: editData?.moTa || "", // Thêm description field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isTokenValid, logout } = useAuth();

  const isEditing = !!editData; // Kiểm tra có phải đang sửa không

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (!isTokenValid()) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }

      // Prepare data for API
      const apiData = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        description: formData.description
      };

      console.log('=== ACCOUNT FORM SUBMIT ===');
      console.log('Form data:', formData);
      console.log('Sending data to API:', apiData);
      console.log('Selected role:', formData.role);

      // Sử dụng AccountApi thay vì fetch trực tiếp
      let result;
      if (isEditing) {
        result = await accountApi.update(editData.id, apiData);
      } else {
        result = await accountApi.create(apiData);
      }

      console.log('API Success:', result);

      // Call success callback để refresh list
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Form submit error:', error);
      setError(error.message);
      
      // Nếu token hết hạn, tự động logout
      if (error.message.includes('Token hết hạn') || error.message.includes('không có quyền')) {
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-form-modal">
      <form className="form-grid no-card" onSubmit={handleSubmit}>
        <div className="form-title">
          <span>{isEditing ? "SỬA TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI"}</span>
          <FaTimes className="close" onClick={onClose} />
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger">
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        <div className="form-group">
          <label>Tên đăng nhập: <span>*</span></label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Vai trò: <span>*</span></label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="Admin">Quản trị viên</option>
            <option value="Teacher">Giảng viên</option>
            <option value="Student">Sinh viên</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả (tùy chọn)"
            rows="3"
            disabled={loading}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              isEditing ? "Cập nhật" : "Xác nhận"
            )}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>Hủy bỏ</button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;