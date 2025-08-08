import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import DepartmentForm from "./DepartmentForm";
import DepartmentDetail from "./DepartmentDetail";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import "../../../styles/DepartmentList.css";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        code: "PM01",
        name: "Công nghệ phần mềm",
        facultyId: 2,
        faculty: "Công nghệ thông tin",
        lecturers: 12,
        subjects: 8,
        teachers: [],
        subjectsList: [],
      },
      {
        id: 2,
        code: "HTTT02",
        name: "Hệ thống thông tin",
        facultyId: 2,
        faculty: "Công nghệ thông tin",
        lecturers: 10,
        subjects: 5,
        teachers: [],
        subjectsList: [],
      },
      {
        id: 3,
        code: "TUD03",
        name: "Toán ứng dụng",
        facultyId: 3,
        faculty: "Khoa học tự nhiên",
        lecturers: 8,
        subjects: 4,
        teachers: [],
        subjectsList: [],
      },
    ];
    setDepartments(dummyData);
    setFilteredDepartments(dummyData);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dep) =>
        dep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dep.faculty.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  const getFacultyNameById = (id) => {
    const facultyMap = {
      1: "Khoa học máy tính",
      2: "Công nghệ thông tin",
      3: "Khoa học tự nhiên",
    };
    return facultyMap[id] || "";
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDepartment(null);
  };

  const handleFormSuccess = (data) => {
    if (editingDepartment) {
      const updatedList = departments.map((dep) =>
        dep.id === editingDepartment.id
          ? { ...dep, ...data, faculty: getFacultyNameById(data.facultyId) }
          : dep
      );
      setDepartments(updatedList);
    } else {
      const newDepartment = {
        id: departments.length + 1,
        ...data,
        faculty: getFacultyNameById(data.facultyId),
        lecturers: 0,
        subjects: 0,
        teachers: [],
        subjectsList: [],
      };
      setDepartments([newDepartment, ...departments]);
    }
    setShowForm(false);
  };

  const handleDeleteClick = (dep) => {
    setDepartmentToDelete(dep);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      setDepartments(departments.filter(dep => dep.id !== departmentToDelete.id));
      setDepartmentToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container">
      {showForm && (
        <DepartmentForm
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          editData={editingDepartment}
        />
      )}

      <DepartmentDetail
        open={showDetail}
        department={selectedDepartment}
        onClose={() => setShowDetail(false)}
      />

      <div className="form-card compact">
        <button className="add-btn" onClick={handleAddDepartment}>
          Thêm bộ môn
        </button>
        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã bộ môn</th>
            <th>Tên bộ môn</th>
            <th>Khoa</th>
            <th>Số lượng<br />giảng viên</th>
            <th>Số lượng<br />môn học</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((dep, index) => (
            <tr key={dep.id}>
              <td>{index + 1}</td>
              <td>{dep.code}</td>
              <td>{dep.name}</td>
              <td>{dep.faculty}</td>
              <td>{dep.lecturers}</td>
              <td>{dep.subjects}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => {
                    setSelectedDepartment(dep);
                    setShowDetail(true);
                  }}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => {
                    setEditingDepartment(dep);
                    setShowForm(true);
                  }}
                />
                <FaTrash
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleDeleteClick(dep)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>
          Hiển thị {filteredDepartments.length} kết quả
          {searchTerm && ` (lọc từ ${departments.length} bộ môn)`}
        </div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>
            Từ 1 đến {Math.min(filteredDepartments.length, 10)} bản ghi
          </span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="XÓA BỘ MÔN"
        message={`Bạn có chắc chắn muốn xóa bộ môn này không?`}
      />
    </div>
  );
};

export default DepartmentList;
