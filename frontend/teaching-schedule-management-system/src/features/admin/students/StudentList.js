import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/StudentList.css';
import StudentDetail from './StudentDetail';
import StudentForm from './StudentForm';
import { 
  getAllStudents, 
  createStudent, 
  getStudentById, 
  deleteStudent, 
  updateStudent 
} from '../../../api/StudentApi';

const StudentList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [students, setStudents] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [editingStudent, setEditingStudent] = useState(null); 

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách sinh viên:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm mới hoặc cập nhật sinh viên
  const handleSaveStudent = async (id, studentData) => {
    try {
      if (id) {
        await updateStudent(id, studentData);
        alert("Cập nhật sinh viên thành công!");
      } else {
        await createStudent(studentData);
        alert("Thêm sinh viên thành công!");
      }
      await fetchStudents(); 
    } catch (error) {
      console.error('❌ Lỗi khi lưu sinh viên:', error);
      alert("Có lỗi xảy ra khi lưu sinh viên.");
    }
    setOpenForm(false); 
    setEditingStudent(null); 
  };

  // Xem chi tiết
  const handleView = async (studentToList) => {
    try {
      const fullStudentDetails = await getStudentById(studentToList.userId);
      setSelectedStudent(fullStudentDetails);
      setOpenDetail(true);
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết sinh viên:', error);
    }
  };

  // Chỉnh sửa
  const handleEdit = async (studentToList) => {
    try {
      const fullStudentDetails = await getStudentById(studentToList.userId);
      setEditingStudent(fullStudentDetails);
      setOpenForm(true); 
    } catch (error) {
      console.error('❌ Lỗi khi tải chi tiết sinh viên để chỉnh sửa:', error);
      alert("Không thể tải thông tin sinh viên để chỉnh sửa.");
    }
  };

  // Xóa sinh viên
  const handleStudentDelete = async (studentId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này không?");
    if (confirmDelete) {
      try {
        await deleteStudent(studentId);
        await fetchStudents();
        alert("Sinh viên đã được xóa thành công!");
      } catch (error) {
        console.error('❌ Lỗi khi xóa sinh viên:', error);
        alert("Có lỗi xảy ra khi xóa sinh viên.");
      }
    }
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="student-container">
      <div className="student-header">
        <button className="add-button" onClick={() => {
          setEditingStudent(null);
          setOpenForm(true);
        }}>
          Thêm sinh viên
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <StudentDetail
        open={openDetail}
        student={selectedStudent}
        onClose={() => {
          setOpenDetail(false);
          setSelectedStudent(null);
        }}
      />

      <StudentForm
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingStudent(null); 
        }}
        initialData={editingStudent} 
        onSave={handleSaveStudent} 
      />

      <table className="student-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã sinh viên</th>
            <th>Họ tên</th>
            <th>Giới tính</th>
            <th>Lớp</th>
            <th>Năm nhập học</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.userId}>
              <td>{index + 1}</td>
              <td>{student.studentCode}</td>
              <td>{student.fullName}</td>
              <td>{student.gender}</td>
              <td>{student.className}</td>
              <td>{student.enrollmentYear}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleView(student)}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => handleEdit(student)} 
                />
                <FaTrashAlt
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleStudentDelete(student.userId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị {students.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {students.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
