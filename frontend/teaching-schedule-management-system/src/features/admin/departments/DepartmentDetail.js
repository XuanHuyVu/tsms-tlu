import React from "react";
import "../../../styles/DepartmentDetail.css";

const DepartmentDetail = ({ open, department, onClose }) => {
  if (!open || !department) return null;

  return (
    <div className="department-detail-overlay" onClick={onClose}>
      <div className="department-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="department-detail-header">
          <h2>CHI TIẾT BỘ MÔN</h2>
          <button className="department-detail-close" onClick={onClose}>×</button>
        </div>

        {/* Thông tin cơ bản */}
        <div className="department-detail-section basic-info">
          <h3>Thông tin cơ bản</h3>
          <div className="basic-info-grid">
            <div className="basic-info-item">
              <label htmlFor="dep-name">Tên bộ môn:</label>
              <input id="dep-name" type="text" value={department.name} disabled />
            </div>
            <div className="basic-info-item">
              <label htmlFor="dep-faculty">Khoa:</label>
              <input
                id="dep-faculty"
                type="text"
                value={department.faculty?.name || ""}
                disabled
              />
            </div>
            <div className="basic-info-item">
              <label htmlFor="dep-teachers">Số lượng giảng viên:</label>
              <input
                id="dep-teachers"
                type="number"
                value={department.teacherCount ?? 0}
                disabled
              />
            </div>
            <div className="basic-info-item">
              <label htmlFor="dep-subjects">Số lượng môn học:</label>
              <input
                id="dep-subjects"
                type="number"
                value={department.subjectCount ?? 0}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Danh sách giảng viên */}
        <div className="department-detail-section">
          <h3>Danh sách giảng viên</h3>
          {department.teachers?.length > 0 ? (
            <table className="department-teachers-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã giảng viên</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                </tr>
              </thead>
              <tbody>
                {department.teachers.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>{t.teacherCode}</td>
                    <td>{t.fullName}</td>
                    <td>{t.email}</td>
                    <td>{t.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">Chưa có giảng viên</p>
          )}
        </div>

        {/* Danh sách môn học */}
        <div className="department-detail-section">
          <h3>Danh sách môn học</h3>
          {department.subjects?.length > 0 ? (
            <table className="department-subjects-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã môn học</th>
                  <th>Tên môn học</th>
                  <th>Tín chỉ</th>
                  <th>Loại MH</th>
                </tr>
              </thead>
              <tbody>
                {department.subjects.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.subjectCode}</td>
                    <td>{s.subjectName}</td>
                    <td>{s.credits}</td>
                    <td>{s.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">Chưa có môn học</p>
          )}
        </div>

        {/* Footer */}
        <div className="department-detail-footer">
          <button className="btn-back" onClick={onClose}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
