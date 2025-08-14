import React, { useEffect, useState } from "react";
import { getScheduleChanges, getScheduleChangeDetail, approveScheduleChange } from "../../../api/ScheduleChangeApi";
import { getAllTeachers } from "../../../api/TeacherApi";
import dayjs from "dayjs";
import "../../../styles/ScheduleChangeList.css";
import { FaSearch, FaInfoCircle, FaRegCheckSquare } from "react-icons/fa";
import ScheduleChangeDetail from "./ScheduleChangeDetail";

const ScheduleChangeList = () => {
  const [allChanges, setAllChanges] = useState([]); // toàn bộ dữ liệu
  const [changes, setChanges] = useState([]); // dữ liệu sau khi lọc

  const [filters, setFilters] = useState({
    type: "Tất cả",
    teacher: "Tất cả",
    fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    search: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedChange, setSelectedChange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const typeMapping = {
    MAKE_UP_CLASS: "Lịch bù",
    CLASS_CANCEL: "Lịch hủy",
  };

  useEffect(() => {
    fetchTeachers();
    fetchAllChanges();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách giảng viên:", err);
    }
  };

  const fetchAllChanges = async () => {
    try {
      // lấy tất cả dữ liệu (không filter ở BE)
      const data = await getScheduleChanges({});
      const content = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setAllChanges(content);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  // Lọc ở FE mỗi khi filters hoặc allChanges thay đổi
  useEffect(() => {
    const filtered = allChanges.filter((item) => {
      // Lọc theo loại
      if (filters.type !== "Tất cả" && item.type !== filters.type) return false;

      // Lọc theo giảng viên
      const teacherName = item.teachingSchedule?.classSection?.teacher?.fullName || "";
      if (filters.teacher !== "Tất cả" && teacherName !== filters.teacher) return false;

      // Lọc theo ngày tạo
      const created = dayjs(item.createdAt).format("YYYY-MM-DD");
      if (created < filters.fromDate || created > filters.toDate) return false;

      // Lọc theo search (tìm trong tên lớp học phần)
      const className = item.teachingSchedule?.classSection?.name?.toLowerCase() || "";
      if (filters.search && !className.includes(filters.search.toLowerCase())) return false;

      return true;
    });

    setPage(1); // reset về trang 1 khi lọc
    setChanges(filtered);
  }, [filters, allChanges]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = async (change) => {
    try {
      let detailData = await getScheduleChangeDetail(change.id, change.type);
      detailData.type = change.type;
      if (!detailData.teachingSchedule && change.teachingSchedule) {
        detailData.teachingSchedule = change.teachingSchedule;
      }
      setSelectedChange(detailData);
      setShowModal(true);
    } catch (err) {
      console.error("Lỗi khi mở chi tiết:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChange(null);
  };

  const handleApproveSchedule = async (changeToApprove) => {
    try {
      await approveScheduleChange(changeToApprove.id);
      alert(`Duyệt thành công lịch ID: ${changeToApprove.id}, loại: ${typeMapping[changeToApprove.type]}`);
      fetchAllChanges(); // reload toàn bộ
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi duyệt lịch:", error);
      alert("Đã có lỗi xảy ra khi duyệt lịch.");
    }
  };

  const handleRejectSchedule = async (changeToReject) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Từ chối thành công lịch ID: ${changeToReject.id}, loại: ${typeMapping[changeToReject.type]}`);
      handleCloseModal();
      fetchAllChanges();
    } catch (error) {
      console.error("Lỗi khi từ chối lịch:", error);
      alert("Đã có lỗi xảy ra khi từ chối lịch.");
    }
  };

  // Phân trang FE
  const totalPages = Math.ceil(changes.length / pageSize);
  const paginatedChanges = changes.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="schedule-change-container">
      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-items-group">
          <div className="filter-item">
            <label>Loại thay đổi</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="Tất cả">Tất cả</option>
              <option value="CLASS_CANCEL">Hủy lịch</option>
              <option value="MAKE_UP_CLASS">Bù lịch</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Giảng viên</label>
            <select name="teacher" value={filters.teacher} onChange={handleFilterChange}>
              <option value="Tất cả">Tất cả</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.fullName}>
                  {t.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label>Từ ngày</label>
            <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          </div>
          <div className="filter-item">
            <label>Đến ngày</label>
            <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-box1"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Table */}
      <table className="schedule-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Loại</th>
            <th>Giảng viên phụ trách</th>
            <th>Lớp học phần</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedChanges.length > 0 ? (
            paginatedChanges.map((item, index) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{typeMapping[item.type] || "-"}</td>
                <td>{item.teachingSchedule?.classSection?.teacher?.fullName || "-"}</td>
                <td>{item.teachingSchedule?.classSection?.name || "-"}</td>
                <td>{item.createdAt ? dayjs(item.createdAt).format("DD/MM/YYYY") : "-"}</td>
                <td className="actions">
                  <FaInfoCircle className="icon info" title="Chi tiết" onClick={() => handleViewDetails(item)} />
                  <FaRegCheckSquare className="icon check" title="Duyệt" onClick={() => handleApproveSchedule(item)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="footer">
        <div>Hiển thị {paginatedChanges.length} / {changes.length} kết quả</div>
        <div className="pagination">
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>&lt;</button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      </div>

      {showModal && selectedChange && (
        <ScheduleChangeDetail
          change={selectedChange}
          onClose={handleCloseModal}
          onApprove={() => handleApproveSchedule(selectedChange)}
          onReject={() => handleRejectSchedule(selectedChange)}
        />
      )}
    </div>
  );
};

export default ScheduleChangeList;
