import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle } from 'react-icons/fa';
import '../../../styles/TeacherList.css';
import TeacherForm from './TeacherForm';

const TeacherList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      maGV: '2251172378',
      hoTen: 'ThS. Nguyễn Văn A',
      ngaySinh: '20/10/1990',
      email: 'nva@tlu.com',
      soDienThoai: '0123456789',
      khoa: 'Công Nghệ Thông Tin',
    },
        {
      id: 2,
      maGV: '2251172378',
      hoTen: 'ThS. Nguyễn Văn A',
      ngaySinh: '20/10/1990',
      email: 'nva@tlu.com',
      soDienThoai: '0123456789',
      khoa: 'Công Nghệ Thông Tin',
    },
  ]);

  const handleAddTeacher = (newTeacher) => {
    setTeachers([...teachers, { ...newTeacher, id: teachers.length + 1 }]);
    setOpenForm(false);
  };

  return (
    <div className="teacher-container">
      <div className="teacher-header">
        <button className="add-button" onClick={() => setOpenForm(true)}>
          Thêm giảng viên
        </button>
        <input type="text" className="search-input" placeholder="Tìm kiếm" />
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

      {/* Form thêm giảng viên */}
      <TeacherForm
        visible={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAddTeacher}
      />
    </div>
  );
};

export default TeacherList;
