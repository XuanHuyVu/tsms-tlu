import React from 'react';
import '../../../styles/DepartmentDetail.css';

const DepartmentDetail = ({ open, department, onClose }) => {
  if (!open || !department) return null;

  return (
    <div className="department-detail-overlay" onClick={onClose}>
      <div className="department-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="department-detail-header">
          <h2>CHI TIẾT BỘ MÔN</h2>
          <button className="department-detail-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="department-detail-content">
          <div className="department-detail-section">
            <h3>Thông tin cơ bản</h3>
            <div className="department-detail-grid">
              <div className="department-detail-item">
                <label>Tên bộ môn:</label>
                <span>{department.name}</span>
              </div>
              <div className="department-detail-item">
                <label>Khoa:</label>
                <span>{department.faculty}</span>
              </div>
              <div className="department-detail-item">
                <label>Số lượng giảng viên:</label>
                <span>{department.teacherCount || 0}</span>
              </div>
              <div className="department-detail-item">
                <label>Số lượng môn học:</label>
                <span>{department.subjectCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="department-detail-section">
            <h3>Danh sách giảng viên</h3>
            <div className="department-teachers-list">
              {department.teachers?.length > 0 ? (
                <table className="department-teachers-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã giảng viên</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.teachers.map((teacher, index) => (
                      <tr key={teacher.id}>
                        <td>{index + 1}</td>
                        <td>{teacher.teacherCode}</td>
                        <td>{teacher.fullName}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.phoneNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">Chưa có giảng viên nào trong bộ môn này</p>
              )}
            </div>
          </div>

          <div className="department-detail-section">
            <h3>Danh sách môn học</h3>
            <div className="department-subjects-list">
              {department.subjects?.length > 0 ? (
                <table className="department-subjects-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã môn học</th>
                      <th>Tên môn học</th>
                      <th>Số tín chỉ</th>
                      <th>Loại môn học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.subjects.map((subject, index) => (
                      <tr key={subject.id}>
                        <td>{index + 1}</td>
                        <td>{subject.subjectCode}</td>
                        <td>{subject.subjectName}</td>
                        <td>{subject.credits}</td>
                        <td>{subject.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">Chưa có môn học nào trong bộ môn này</p>
              )}
            </div>
          </div>
        </div>

        <div className="department-detail-footer">
          <button className="btn-close" onClick={onClose}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
