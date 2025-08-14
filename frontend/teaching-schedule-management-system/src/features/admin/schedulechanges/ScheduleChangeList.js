import React, { useEffect, useState } from "react";
import { getScheduleChanges } from "../../../api/ScheduleChangeApi";
import dayjs from "dayjs";
import "../../../styles/ScheduleChangeList.css";
import { FaSearch, FaInfoCircle, FaRegCheckSquare } from "react-icons/fa";
import ScheduleChangeDetail from "./ScheduleChangeDetail";

const ScheduleChangeList = () => {
  const [changes, setChanges] = useState([]);
  const [filters, setFilters] = useState({
    type: "Tất cả",
    teacher: "Nguyễn Văn A",
    fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    search: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedChange, setSelectedChange] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchChanges();
  }, [page, pageSize]);

  const fetchChanges = async () => {
    try {
      const params = { ...filters, page: page - 1, size: pageSize };
      console.log("[fetchChanges] params gửi API:", params);

      const data = await getScheduleChanges(params);
      console.log("[fetchChanges] dữ liệu trả về:", data);

      if (data.length > 0) {
        setChanges(data);
        setTotalRecords(data.length);
      } else {
        setChanges([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setChanges([]);
      setTotalRecords(0);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleViewDetails = (change) => {
    setSelectedChange(change);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChange(null);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="schedule-change-container">
      {/* Bộ lọc */}
      <div className="filter-bar">
        <div className="filter-items-group">
          <div className="filter-item">
            <label>Loại thay đổi</label>
            <select name="type" value={filters.type}>
              <option value="Tất cả">Tất cả</option>
              <option value="Hủy lịch">Hủy lịch</option>
              <option value="Bù lịch">Bù lịch</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Giảng viên</label>
            <select name="teacher" value={filters.teacher}>
              <option value="Nguyễn Văn A">Nguyễn Văn A</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Từ ngày</label>
            <input type="date" name="fromDate" value={filters.fromDate} />
          </div>

          <div className="filter-item">
            <label>Đến ngày</label>
            <input type="date" name="toDate" value={filters.toDate} />
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-box1"
            name="search"
            value={filters.search}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Bảng dữ liệu */}
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
          {changes.length > 0 ? (
            changes.map((item, index) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{item.type || "-"}</td>
                <td>{item.teachingSchedule?.classSection?.teacher?.fullName || "-"}</td>
                <td>{item.teachingSchedule?.classSection?.name || "-"}</td>
                <td>{item.createdAt ? dayjs(item.createdAt).format("DD/MM/YYYY") : "-"}</td>
                <td className="actions">
                  <FaInfoCircle
                    className="icon info"
                    title="Chi tiết"
                    onClick={() => handleViewDetails(item)}
                  />
                  <FaRegCheckSquare className="icon check" title="Duyệt" />
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

      {/* Phân trang */}
      <div className="footer">
        <div>Hiển thị {changes.length} kết quả</div>
        <div className="pagination">
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            &lt;
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            &gt;
          </button>
        </div>
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedChange && (
        <ScheduleChangeDetail change={selectedChange} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ScheduleChangeList;
