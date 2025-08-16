import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../../../styles/AccountForm.css";
import { useAuth } from "../../../contexts/AuthContext";
import { accountApi } from "../../../api/AccountApi";

// ===== Role mapping =====
const toApiRole = (ui) =>
  ui === "Admin" ? "ROLE_ADMIN"
  : ui === "Teacher" ? "ROLE_TEACHER"
  : ui === "Student" ? "ROLE_STUDENT"
  : ui;

const fromApiRole = (api) =>
  api === "ROLE_ADMIN" ? "Admin"
  : api === "ROLE_TEACHER" ? "Teacher"
  : api === "ROLE_STUDENT" ? "Student"
  : api;

const AccountForm = ({ onClose, editData, onSuccess }) => {
  const isEditing = !!editData;

  // Chấp cả key tiếng Việt (tenDangNhap, vaiTro) lẫn tiếng Anh (username, role)
  const [formData, setFormData] = useState({
    username: editData?.tenDangNhap || editData?.username || "",
    password: "", // để trống khi sửa
    role: fromApiRole(editData?.vaiTro || editData?.role || ""),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Payload gửi API
      const payload = {
        username: formData.username.trim(),
        tenDangNhap: formData.username.trim(), // mirror nếu BE dùng key VN
        role: toApiRole(formData.role),
        vaiTro: toApiRole(formData.role),
      };

      const pass = formData.password.trim();
      if (!isEditing) {
        if (!pass) throw new Error("Mật khẩu không được để trống khi tạo mới");
        payload.password = pass;
      } else if (pass && pass !== "••••••••") {
        payload.password = pass; // chỉ update password nếu nhập mới
      }

      let result;
      if (isEditing) {
        result = await accountApi.update(editData.id, payload);
      } else {
        result = await accountApi.create(payload);
      }

      console.log("API Success:", result);

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Form submit error:", error);
      setError(error.message);

      // Nếu BE trả 401 thì logout
      if (
        error?.response?.status === 401 ||
        error.message.includes("hết hạn") ||
        error.message.includes("không có quyền")
      ) {
        setTimeout(() => logout(), 1500);
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
          <label>Mật khẩu: <span>{isEditing ? "(chỉ nhập nếu đổi)" : "*"}</span></label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required={!isEditing} // bắt buộc khi thêm mới
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
            <option value="ADMIN">Quản trị viên</option>
            <option value="TEACHER">Giảng viên</option>
            <option value="STUDENT">Sinh viên</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              isEditing ? "Cập nhật" : "Xác nhận"
            )}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
