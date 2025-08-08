import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../styles/DepartmentForm.css";

const DepartmentForm = ({ onClose, editData, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: editData?.code || "",
    name: editData?.name || "",
    facultyId: editData?.facultyId || "",
    description: editData?.description || "",
  });

  const faculties = [
    { id: 1, name: "Khoa học máy tính" },
    { id: 2, name: "Công nghệ thông tin" },
    { id: 3, name: "Khoa học tự nhiên" },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isTokenValid, logout } = useAuth();
  const isEditing = !!editData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isTokenValid()) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }

      if (onSuccess) onSuccess(formData);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);

      if (
        err.message.includes("Token hết hạn") ||
        err.message.includes("không có quyền")
      ) {
        setTimeout(() => logout(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="department-form-modal">
      <form className="form-grid no-card" onSubmit={handleSubmit}>
        <div className="form-title">
          <span>{isEditing ? "SỬA BỘ MÔN" : "THÊM BỘ MÔN MỚI"}</span>
          <FaTimes className="close" onClick={onClose} />
        </div>

        {error && <div className="alert alert-danger">Lỗi: {error}</div>}

        <div className="form-group">
          <label>Mã bộ môn: <span>*</span></label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Nhập mã bộ môn"
          />
        </div>

        <div className="form-group">
          <label>Tên bộ môn: <span>*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Nhập tên bộ môn"
          />
        </div>

        <div className="form-group">
          <label>Khoa: <span>*</span></label>
          <select
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">-- Chọn Khoa quản lý --</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? isEditing
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : isEditing
              ? "Cập nhật"
              : "Xác nhận"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
