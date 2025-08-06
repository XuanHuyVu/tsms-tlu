import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/TeacherList.css';
import TeacherForm from './TeacherForm';
import axiosInstance from '../../../api/axiosInstance'; // dùng instance

const TeacherList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const handleAddTeacher = (newTeacher) => {
    setTeachers([...teachers, { ...newTeacher, id: teachers.length + 1 }]);
    setOpenForm(false);
  };

useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/admin/teachers');
      console.log('✅ Danh sách giảng viên được lấy thành công:', response.data); 
      setTeachers(response.data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách giảng viên:', error); 
    }
  };

  fetchTeachers();
}, []);


  return (
    <div className="teacher-container">
      <div className="teacher-header">
        <button className="add-button" onClick={() => setOpenForm(true)}>
          Thêm giảng viên
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <table className="teacher-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã giảng viên</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Khoa quản lý</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr key={teacher.id}>
              <td>{index + 1}</td>
              <td>{teacher.maGV}</td>
              <td>{teacher.hoTen}</td>
              <td>{teacher.ngaySinh}</td>
              <td>{teacher.email}</td>
              <td>{teacher.soDienThoai}</td>
              <td>{teacher.khoa}</td>
              <td className="actions">
                <FaInfoCircle className="icon info" title="Chi tiết" />
                <FaEdit className="icon edit" title="Chỉnh sửa" />
                <FaTrashAlt className="icon delete" title="Xóa" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {teachers.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến 10 bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>

      <TeacherForm
        visible={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAddTeacher}
      />
    </div>
  );
};

export default TeacherList;
