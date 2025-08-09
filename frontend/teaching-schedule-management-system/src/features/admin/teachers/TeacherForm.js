import React, { useState, useEffect } from 'react';
import '../../../styles/TeacherForm.css';
import { getFaculties, getDepartmentsByFaculty } from '../../../api/ApiDropdown';

const TeacherForm = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
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

useEffect(() => {
  if (!visible) return;

  const loadDropdowns = async () => {
    try {
      const facultyList = await getFaculties();
      setFaculties(facultyList);

      let selectedFacultyId = '';
      let selectedDepartmentId = '';
      let departmentList = [];

      if (initialData) {
        // Tìm facultyId từ tên nếu không có ID
        if (initialData.faculty?.id) {
          selectedFacultyId = String(initialData.faculty.id);
        } else if (initialData.faculty?.name) {
          const matchedFaculty = facultyList.find(f => f.name === initialData.faculty.name);
          if (matchedFaculty) {
            selectedFacultyId = String(matchedFaculty.id);
          }
        }

        // Lấy danh sách bộ môn nếu đã có facultyId
        if (selectedFacultyId) {
          departmentList = await getDepartmentsByFaculty(selectedFacultyId);
          setDepartments(departmentList);
        }

        // Tìm departmentId từ tên nếu không có ID
        if (initialData.department?.id) {
          selectedDepartmentId = String(initialData.department.id);
        } else if (initialData.department?.name) {
          const matchedDepartment = departmentList.find(d => d.name === initialData.department.name);
          if (matchedDepartment) {
            selectedDepartmentId = String(matchedDepartment.id);
          }
        }

        // Gán formData
        setFormData({
          teacherCode: initialData.teacherCode || '',
          fullName: initialData.fullName || '',
          gender: initialData.gender || '',
          dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
          email: initialData.email || '',
          phoneNumber: initialData.phoneNumber || '',
          facultyId: selectedFacultyId,
          departmentId: selectedDepartmentId,
          status: initialData.status || '',
        });
      } else {
        // Reset form nếu đang ở chế độ thêm mới
        setFormData({
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
        setDepartments([]);
      }
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
