import React, { useState, useEffect } from 'react';
import '../../../styles/StudentForm.css';
import { getFaculties, getAllUsers, getMajors } from '../../../api/ApiDropdown';

const StudentForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    studentCode: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    className: '',
    enrollmentYear: '',
    facultyId: '',
    majorId: '',
  });

  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const loadDropdowns = async () => {
      try {
        // 1. Load faculties
        const facultyList = await getFaculties();
        setFaculties(facultyList);

        // 2. Load majors
        const majorList = await getMajors();
        setMajors(majorList);

        // 3. Load users (lọc STUDENT)
        const userList = await getAllUsers();
        const studentUsers = userList.filter(u => u.role === 'STUDENT');
        setUsersList(studentUsers);

        console.log('User List (STUDENTS only):', studentUsers);

        // Nếu đang sửa → set giá trị ban đầu
        let selectedUserId = '';
        if (initialData) {
          if (initialData.user?.id) {
            const matchedUser = studentUsers.find(u => u.id === initialData.user.id);
            if (matchedUser) selectedUserId = String(matchedUser.id);
          } else if (initialData.userId) {
            selectedUserId = String(initialData.userId);
          }
        }

        setFormData(prev => ({
          ...prev,
          ...initialData,
          userId: selectedUserId,
        }));
      } catch (error) {
        console.error('Lỗi khi tải dropdown:', error);
      }
    };

    loadDropdowns();
  }, [visible, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentDataToSave = {
      studentCode: formData.studentCode,
      fullName: formData.fullName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      className: formData.className,
      enrollmentYear: parseInt(formData.enrollmentYear),
      facultyId: parseInt(formData.facultyId),
      majorId: parseInt(formData.majorId),
      userId: parseInt(formData.userId),
    };

    if (initialData?.id) {
      await onSave(initialData.id, studentDataToSave);
    } else {
      await onSave(null, studentDataToSave);
    }

    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-student-overlay">
      <div className="modal-student-content">
        <div className="modal-student-header">
          <h2>{initialData ? 'CẬP NHẬT SINH VIÊN' : 'THÊM SINH VIÊN MỚI'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* User */}
            <div className="form-group">
              <label>Tài khoản (User): *</label>
              {usersList.length > 0 ? (
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn tài khoản --</option>
                  {usersList.map(user => (
                    <option key={user.id} value={String(user.id)}>
                      {user.username}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Đang tải danh sách tài khoản...</p>
              )}
            </div>

            {/* Student code */}
            <div className="form-group">
              <label>Mã sinh viên: *</label>
              <input name="studentCode" value={formData.studentCode} onChange={handleChange} required />
            </div>

            {/* Full name */}
            <div className="form-group">
              <label>Họ tên: *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Số điện thoại: *</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email: *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Giới tính: *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            {/* Date of birth */}
            <div className="form-group">
              <label>Ngày sinh: *</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>

            {/* Class */}
            <div className="form-group">
              <label>Lớp: *</label>
              <input name="className" value={formData.className} onChange={handleChange} required />
            </div>

            {/* Enrollment year */}
            <div className="form-group">
              <label>Năm nhập học: *</label>
              <input type="number" name="enrollmentYear" value={formData.enrollmentYear} onChange={handleChange} required />
            </div>

            {/* Faculty */}
            <div className="form-group">
              <label>Khoa: *</label>
              <select name="facultyId" value={formData.facultyId} onChange={handleChange} required>
                <option value="">-- Chọn khoa --</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={String(faculty.id)}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Major */}
            <div className="form-group">
              <label>Chuyên ngành: *</label>
              <select name="majorId" value={formData.majorId} onChange={handleChange} required>
                <option value="">-- Chọn chuyên ngành --</option>
                {majors.map(major => (
                  <option key={major.id} value={String(major.id)}>
                    {major.name}
                  </option>
                ))}
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

export default StudentForm;
