// src/features/admin/departments/DepartmentList.js
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import DepartmentForm from "./DepartmentForm";
import DepartmentDetail from "./DepartmentDetail";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import DepartmentApi from "../../../api/DepartmentApi";
import { getAllTeachers } from "../../../api/TeacherApi";
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
    fetchDepartmentsWithCounts();
  }, []);

  const fetchDepartmentsWithCounts = async () => {
    try {
      const deps = await DepartmentApi.department.getAll();
      const teachers = await getAllTeachers();

      const withCounts = deps.map((dep) => {
        const teacherCount = teachers.filter(
          (t) => t.department?.name === dep.name
        ).length;
        // Nếu BE trả sẵn subjectCount, dùng dep.subjectCount, ngược lại 0
        const subjectCount = dep.subjectCount ?? 0;

        return { ...dep, teacherCount, subjectCount };
      });

      setDepartments(withCounts);
      setFilteredDepartments(withCounts);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu bộ môn:", err);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDepartments(departments);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredDepartments(
        departments.filter(
          (dep) =>
            dep.name.toLowerCase().includes(term) ||
            dep.faculty?.name.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, departments]);

  const handleFormSuccess = async (data) => {
    const payload = { ...data, faculty: { id: data.facultyId } };
    delete payload.facultyId;
    try {
      if (editingDepartment) {
        await DepartmentApi.department.update(editingDepartment.id, payload);
      } else {
        await DepartmentApi.department.create(payload);
      }
      setShowForm(false);
      setEditingDepartment(null);
      await fetchDepartmentsWithCounts();
    } catch (err) {
      console.error("Lỗi khi lưu bộ môn:", err);
    }
  };

  const handleDeleteClick = (dep) => {
    setDepartmentToDelete(dep);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await DepartmentApi.department.delete(departmentToDelete.id);
      await fetchDepartmentsWithCounts();
    } catch (err) {
      console.error("Lỗi khi xóa bộ môn:", err);
    } finally {
      setDepartmentToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleViewDetail = async (dep) => {
    try {
      const full = await DepartmentApi.department.getById(dep.id);
      const teachers = await getAllTeachers();
      const listTeachers = teachers.filter((t) => t.department?.name === dep.name);

      setSelectedDepartment({
        ...full,
        teacherCount: listTeachers.length,
        subjectCount: full.subjectCount ?? 0,
        teachers: listTeachers,
        subjects: full.subjects ?? [],  // if BE returns subjects array
      });
      setShowDetail(true);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết đầy đủ:", err);
    }
  };

  return (
    <div className="teacher-container">
      {showForm && (
        <DepartmentForm
          onClose={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
          editData={editingDepartment}
          onSuccess={handleFormSuccess}
        />
      )}

      <DepartmentDetail
        open={showDetail}
        department={selectedDepartment}
        onClose={() => setShowDetail(false)}
      />

      <div className="teacher-header">
        <button
          className="add-button"
          onClick={() => {
            setEditingDepartment(null);
            setShowForm(true);
          }}
        >
          Thêm bộ môn
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <th>Số lượng GV</th>
            <th>Số lượng môn học</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((dep, idx) => (
            <tr key={dep.id}>
              <td>{idx + 1}</td>
              <td>{dep.code}</td>
              <td>{dep.name}</td>
              <td>{dep.faculty?.name || "Chưa xác định"}</td>
              <td>{dep.teacherCount}</td>
              <td>{dep.subjectCount}</td>
              <td className="actions">
                <FaInfoCircle
                  className="icon info"
                  title="Chi tiết"
                  onClick={() => handleViewDetail(dep)}
                  style={{ cursor: "pointer", marginRight: 8 }}
                />
                <FaEdit
                  className="icon edit"
                  title="Chỉnh sửa"
                  onClick={() => {
                    setEditingDepartment(dep);
                    setShowForm(true);
                  }}
                  style={{ cursor: "pointer", marginRight: 8 }}
                />
                <FaTrash
                  className="icon delete"
                  title="Xóa"
                  onClick={() => handleDeleteClick(dep)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div>
          Hiển thị {filteredDepartments.length} kết quả
          {searchTerm && ` (lọc từ ${departments.length})`}
        </div>
        <div className="pagination">
          <select defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>
            Từ 1 đến {Math.min(filteredDepartments.length, 10)} bản ghi
          </span>
          <button disabled>&lt;</button>
          <button disabled>&gt;</button>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="XÓA BỘ MÔN"
        message="Bạn có chắc chắn muốn xóa bộ môn này không?"
      />
    </div>
  );
};

export default DepartmentList;
