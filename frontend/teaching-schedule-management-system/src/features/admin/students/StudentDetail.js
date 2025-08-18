import React from "react";
import "../../../styles/StudentDetail.css";

const StudentDetail = ({ open, onClose, student }) => {
  if (!open || !student) return null;

  console.log("Đối tượng Student nhận được:", student);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatGender = (gender) => {
    switch (gender) {
      case "MALE":
      case "Nam":
        return "Nam";
      case "FEMALE":
      case "Nữ":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  return (
    <div className="student-detail-modal">
      <div className="student-detail-box">
        <div className="student-detail-header">
          <h2>Chi tiết sinh viên</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="student-detail-row">
          <label>Mã sinh viên:</label>
          <div>{student.studentCode}</div>
        </div>
        <div className="student-detail-row">
          <label>Họ tên:</label>
          <div>{student.fullName}</div>
        </div>
        
        <div className="student-detail-row">
          <label>Số điện thoại:</label>
          {/* kiểm tra cả phoneNumber (camelCase) và phone_number (snake_case) */}
          <div>{student.phoneNumber || student.phone_number || "Chưa có dữ liệu"}</div>
        </div>
        <div className="student-detail-row">
          <label>Email:</label>
          {/* email có thể đúng rồi, thêm fallback cho chắc */}
          <div>{student.email || "Chưa có dữ liệu"}</div>
        </div>

        <div className="student-detail-row">
          <label>Giới tính:</label>
          <div>{formatGender(student.gender)}</div>
        </div>

        <div className="student-detail-row">
          <label>Ngày sinh:</label>
          <div>{formatDate(student.dateOfBirth || student.date_of_birth)}</div>
        </div>
        <div className="student-detail-row">
          <label>Lớp:</label>
          <div>{student.className || student.class_name}</div>
        </div>
        <div className="student-detail-row">
          <label>Năm nhập học:</label>
          <div>{student.enrollmentYear || student.enrollment_year}</div>
        </div>
        <div className="student-detail-row">
          <label>Ngành:</label>
          <div>{student.major?.name || "Chưa có dữ liệu"}</div>
        </div>
        <div className="student-detail-row">
          <label>Khoa:</label>
          <div>{student.faculty?.name || "Chưa có dữ liệu"}</div>
        </div>

        <div className="student-detail-footer">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
