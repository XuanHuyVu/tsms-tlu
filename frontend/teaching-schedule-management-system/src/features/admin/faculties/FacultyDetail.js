import React from "react";

const FacultyDetail = ({ open, faculty, onClose }) => {
  if (!open) return null;

  const departments = faculty?.departments ?? [];
  const teachers = faculty?.teachers ?? [];

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>Chi tiết khoa</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="detail-grid">
          <div>
            <p><b>Mã khoa:</b> {faculty?.code}</p>
            <p><b>Tên khoa:</b> {faculty?.name}</p>
            <p><b>Trưởng khoa:</b> {faculty?.deanName || "Chưa cập nhật"}</p>
            <p><b>Mô tả:</b> {faculty?.description || "-"}</p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">{faculty?.teacherCount ?? 0}</div>
              <div className="stat-label">Giảng viên</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{faculty?.departmentCount ?? 0}</div>
              <div className="stat-label">Ngành/Bộ môn</div>
            </div>
          </div>
        </div>

        <div className="split">
          <div className="panel">
            <h4>Danh sách ngành/bộ môn</h4>
            <table className="account-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã</th>
                  <th>Tên</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.code}</td>
                    <td>{d.name}</td>
                  </tr>
                ))}
                {!departments.length && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h4>Danh sách giảng viên</h4>
            <table className="account-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>{t.fullName || `${t.firstName ?? ""} ${t.lastName ?? ""}`}</td>
                    <td>{t.email}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
                {!teachers.length && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyDetail;
