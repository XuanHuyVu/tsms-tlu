// src/features/admin/faculties/FacultyList.js
import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../../api/FacultiesApi";
import DepartmentApi from "../../../api/DepartmentApi";
import { getAllTeachers } from "../../../api/TeacherApi";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import FacultyForm from "./FacultyForm";
import FacultyDetail from "./FacultyDetail";
import "../../../styles/FacultyList.css";

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [loading, setLoading] = useState(false);

  // --- helpers ---
  const applyFilter = (list, term) => {
    if (!term?.trim()) return list;
    const t = term.toLowerCase();
    return list.filter(
      (f) =>
        f.name?.toLowerCase().includes(t) ||
        f.code?.toLowerCase().includes(t) ||
        f.deanName?.toLowerCase().includes(t)
    );
  };

  // --- initial load with counts ---
  const fetchFacultiesWithCounts = async () => {
    setLoading(true);
    try {
      const [facus, teachers, departments] = await Promise.all([
        getAllFaculties(),
        getAllTeachers(),
        DepartmentApi.department.getAll(),
      ]);

      const withCounts = facus.map((f) => {
        const teacherCount = teachers.filter((t) => t.facultyId === f.id).length;
        const departmentCount = departments.filter((d) => d.faculty?.id === f.id).length;
        return { ...f, teacherCount, departmentCount };
      });

      setFaculties(withCounts);
      setFilteredFaculties(applyFilter(withCounts, searchTerm));
    } catch (err) {
      console.error("Lỗi khi tải danh sách khoa:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultiesWithCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-filter when search or list changes
  useEffect(() => {
    setFilteredFaculties(applyFilter(faculties, searchTerm));
  }, [searchTerm, faculties]);

  // --- handlers ---
  const handleAddClick = useCallback(() => {
    setEditingFaculty(null);
    setShowForm(true);
  }, []);

  const handleInfoClick = useCallback(async (e, fac) => {
    e?.stopPropagation?.();
    try {
      const [full, teachers, departments] = await Promise.all([
        getFacultyById(fac.id),
        getAllTeachers(),
        DepartmentApi.department.getAll(),
      ]);

      const teacherList = teachers.filter((t) => t.facultyId === fac.id);
      const departmentList = departments.filter((d) => d.faculty?.id === fac.id);

      setSelectedFaculty({
        ...full,
        teacherCount: teacherList.length,
        departmentCount: departmentList.length,
        teachers: teacherList,
        departments: departmentList,
      });
      setShowDetail(true);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết khoa:", err?.response?.data || err);
    }
  }, []);

  const handleEditClick = useCallback((e, fac) => {
    e?.stopPropagation?.();
    setEditingFaculty(fac);
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((e, fac) => {
    e?.stopPropagation?.();
    setFacultyToDelete(fac);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (!facultyToDelete) return;
    try {
      await deleteFaculty(facultyToDelete.id);
      setFaculties((prev) => {
        const next = prev.filter((f) => f.id !== facultyToDelete.id);
        setFilteredFaculties(applyFilter(next, searchTerm));
        return next;
      });
    } catch (err) {
      console.error("Lỗi khi xóa khoa:", err?.response?.data || err);
    } finally {
      setFacultyToDelete(null);
      setShowDeleteModal(false);
    }
  };

  // Nhận payload phẳng từ FacultyForm (ví dụ: { code, name, deanName, ... })
  // Sau khi tạo/sửa xong -> record nhảy lên đầu + tính lại counts tức thời
  const handleFormSuccess = async (formData) => {
    try {
      let savedFaculty;
      if (editingFaculty) {
        savedFaculty = await updateFaculty(editingFaculty.id, formData);
      } else {
        savedFaculty = await createFaculty(formData);
      }

      setShowForm(false);
      setEditingFaculty(null);

      // Tính lại đếm cho faculty vừa lưu
      const [teachers, departments] = await Promise.all([
        getAllTeachers(),
        DepartmentApi.department.getAll(),
      ]);
      const teacherCount = teachers.filter((t) => t.facultyId === savedFaculty.id).length;
      const departmentCount = departments.filter((d) => d.faculty?.id === savedFaculty.id).length;

      // Đưa record lên đầu + đồng bộ filter theo từ khoá hiện tại
      setFaculties((prev) => {
        const next = [
          { ...savedFaculty, teacherCount, departmentCount },
          ...prev.filter((f) => f.id !== savedFaculty.id),
        ];
        setFilteredFaculties(applyFilter(next, searchTerm));
        return next;
      });
    } catch (err) {
      console.error("Lỗi khi lưu khoa:", err?.response?.status, err?.response?.data || err);
    }
  };

  return (
    <div className="teacher-container">
      {/* FORM (modal) */}
      {showForm && (
        <FacultyForm
          editData={editingFaculty}
          onClose={() => {
            setShowForm(false);
            setEditingFaculty(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* DETAIL (modal) */}
      <FacultyDetail
        open={showDetail}
        faculty={selectedFaculty}
        onClose={() => setShowDetail(false)}
      />

      {/* Header */}
      <div className="teacher-header">
        <button
          type="button"
          className="add-button"
          onClick={handleAddClick}
          onKeyDown={(e) => e.key === "Enter" && handleAddClick()}
        >
          Thêm khoa
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

      {/* Bảng */}
      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã khoa</th>
            <th>Tên khoa</th>
            <th>Trưởng khoa</th>
            <th>Số lượng giảng viên</th>
            <th>Số lượng ngành</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            filteredFaculties.map((f, idx) => (
              <tr key={f.id}>
                <td>{idx + 1}</td>
                <td>{f.code}</td>
                <td>{f.name}</td>
                <td>{f.deanName || "Chưa cập nhật"}</td>
                <td>{f.teacherCount ?? 0}</td>
                <td>{f.departmentCount ?? 0}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="icon-btn info"
                    title="Chi tiết"
                    onClick={(e) => handleInfoClick(e, f)}
                    onKeyDown={(e) => e.key === "Enter" && handleInfoClick(e, f)}
                    aria-label={`Xem chi tiết khoa ${f.name}`}
                  >
                    <FaInfoCircle />
                  </button>
                  <button
                    type="button"
                    className="icon-btn edit"
                    title="Chỉnh sửa"
                    onClick={(e) => handleEditClick(e, f)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditClick(e, f)}
                    aria-label={`Chỉnh sửa khoa ${f.name}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete"
                    title="Xóa"
                    onClick={(e) => handleDeleteClick(e, f)}
                    onKeyDown={(e) => e.key === "Enter" && handleDeleteClick(e, f)}
                    aria-label={`Xóa khoa ${f.name}`}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

          {loading && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                Đang tải...
              </td>
            </tr>
          )}

          {!loading && filteredFaculties.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="footer">
        <div>
          Hiển thị {filteredFaculties.length} kết quả
          {searchTerm && ` (lọc từ ${faculties.length})`}
        </div>
        <div className="pagination">
          <select defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>Từ 1 đến {Math.min(filteredFaculties.length, 10)} bản ghi</span>
          <button disabled>&lt;</button>
          <button disabled>&gt;</button>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="XÓA KHOA"
        message="Bạn có chắc chắn muốn xóa khoa này không?"
      />
    </div>
  );
};

export default FacultyList;
