import React, { useEffect, useState } from "react";
import { getAllTeachingSchedules, updateTeachingSchedule } from "../../../api/TeachingScheduleApi";
import dayjs from "dayjs";
import "../../../styles/ScheduleChangeList.css";
import { FaSearch, FaInfoCircle, FaRegCheckSquare } from "react-icons/fa";

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

  useEffect(() => {
    fetchChanges();
  }, [page, pageSize]);

  const fetchChanges = async () => {
  try {
    const params = { ...filters, page: page - 1, size: pageSize };
    console.log("[fetchChanges] params gửi API:", params);

    const data = await getAllTeachingSchedules(params);
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


  const handleApproval = async (id) => {
    try {
      await updateTeachingSchedule(id);
      fetchChanges();
    } catch (err) {
      console.error("Lỗi khi duyệt:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    fetchChanges();
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="schedule-change-container">
      <div className="filter-bar">
        <div className="filter-items-group">
          <div className="filter-item">
            <label>Loại thay đổi</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="Tất cả">Tất cả</option>
              <option value="Hủy lịch">Hủy lịch</option>
              <option value="Bù lịch">Bù lịch</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Giảng viên</label>
            <select name="teacher" value={filters.teacher} onChange={handleFilterChange}>
              <option value="Nguyễn Văn A">Nguyễn Văn A</option>
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
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Loại</th>
            <th>Giảng viên phụ trách</th>
            <th>Lớp học phần</th>
            <th>Ngày giảng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
          <tbody>
            {changes.length > 0 ? (
              changes.flatMap((item, index) =>
                (item.details && item.details.length > 0
                  ? item.details.map((detail, idx) => (
                      <tr key={`${item.id}-${idx}`}>
                        <td>{(page - 1) * pageSize + index + 1}</td>
                        <td>{item.type || "-"}</td>
                        <td>{item.classSection?.teacher?.fullName || "-"}</td>
                        <td>{item.classSection?.name || "-"}</td>
                        <td>
                          {detail.teachingDate
                            ? dayjs(detail.teachingDate).format("DD/MM/YYYY")
                            : "-"}
                        </td>

                        {/* Action buttons */}
                        <td className="actions">
                          <FaInfoCircle className="icon info" title="Chi tiết" />
                          <FaRegCheckSquare
                            className="icon check"
                            title="Duyệt"
                            onClick={() => handleApproval(item.id)}
                          />
                        </td>
                      </tr>
                    ))
                  : [])
              )
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>


        </table>

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
    </div>
  );
};

export default ScheduleChangeList;
