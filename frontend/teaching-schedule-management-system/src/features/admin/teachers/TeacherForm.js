import React, { useState, useEffect } from 'react';
import '../../../styles/TeacherForm.css';
import { getFaculties, getDepartmentsByFaculty, getAllUsers } from '../../../api/ApiDropdown';

const TeacherForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    teacherCode: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    facultyId: '',
    departmentId: '',
    status: '',
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
  if (!visible) return;

  const loadDropdowns = async () => {
    try {
      // 1. Load faculties
      const facultyList = await getFaculties();
      setFaculties(facultyList);

      // 2. Load users
      const userList = await getAllUsers();

      // Lọc user có role = TEACHER
      const teacherUsers = userList.filter(u => u.role === 'TEACHER');
      setUsersList(teacherUsers);

      console.log('User List (TEACHERS only):', teacherUsers);

      // Xử lý initialData giống như bạn đang làm
      let selectedUserId = '';
      if (initialData) {
        if (initialData.user?.username) {
          const matchedUser = teacherUsers.find(u => u.username === initialData.user.username);
          if (matchedUser) selectedUserId = String(matchedUser.id);
        } else if (initialData.userId) {
          const idNum = typeof initialData.userId === 'string' ? parseInt(initialData.userId) : initialData.userId;
          const matchedUser = teacherUsers.find(u => u.id === idNum);
          if (matchedUser) selectedUserId = String(matchedUser.id);
        } else if (initialData.user?.id) {
          const matchedUser = teacherUsers.find(u => u.id === initialData.user.id);
          if (matchedUser) selectedUserId = String(matchedUser.id);
        }
      }

      setFormData(prev => ({ ...prev, userId: selectedUserId }));

    } catch (error) {
      console.error('Lỗi khi tải dropdown:', error);
    }
  };

  loadDropdowns();
}, [visible, initialData]);


  // Load lại bộ môn khi thay đổi khoa
  useEffect(() => {
    const loadDepartments = async () => {
      if (formData.facultyId) {
        try {
          const list = await getDepartmentsByFaculty(formData.facultyId);
          setDepartments(list);
        } catch (error) {
          console.error('Lỗi khi load bộ môn:', error);
        }
      } else {
        setDepartments([]);
        setFormData(prev => ({ ...prev, departmentId: '' }));
      }
    };

    loadDepartments();
  }, [formData.facultyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacherDataToSave = {
      teacherCode: formData.teacherCode,
      fullName: formData.fullName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      facultyId: parseInt(formData.facultyId),
      departmentId: parseInt(formData.departmentId),
      userId: parseInt(formData.userId),
      status: formData.status,
    };

    if (initialData?.id) {
      await onSave(initialData.id, teacherDataToSave);
    } else {
      await onSave(null, teacherDataToSave);
    }

    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-teacher-overlay">
      <div className="modal-teacher-content">
        <div className="modal-teacher-header">
          <h2>{initialData ? 'CẬP NHẬT GIẢNG VIÊN' : 'THÊM GIẢNG VIÊN MỚI'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form className="teacher-form" onSubmit={handleSubmit}>
          <div className="form-grid">
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

            <div className="form-group">
              <label>Mã giảng viên: *</label>
              <input name="teacherCode" value={formData.teacherCode} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Họ tên: *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Giới tính: *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh: *</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email: *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Số điện thoại: *</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Khoa quản lý: *</label>
              <select name="facultyId" value={formData.facultyId} onChange={handleChange} required>
                <option value="">-- Chọn khoa phụ trách --</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={String(faculty.id)}>{faculty.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Bộ môn quản lý: *</label>
              <select name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                <option value="">-- Chọn bộ môn --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={String(dept.id)}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái: *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tạm nghỉ</option>
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