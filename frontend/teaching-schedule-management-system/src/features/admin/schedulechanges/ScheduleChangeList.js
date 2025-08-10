import React, { useEffect, useState } from "react";
import { getScheduleChanges, approveScheduleChange } from "../../../api/ScheduleChangeApi";
import dayjs from "dayjs";
import '../../../styles/ScheduleChangeList.css';
import { FaSearch, FaInfoCircle, FaRegCheckSquare   } from 'react-icons/fa';


const ScheduleChangeList = () => {
  const [changes, setChanges] = useState([]);
  const [filters, setFilters] = useState({
    type: "Tất cả",
    teacher: "Nguyễn Văn A",
    fromDate: dayjs().startOf('month').format("YYYY-MM-DD"),
    toDate: dayjs().endOf('month').format("YYYY-MM-DD"),
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
    const params = { ...filters, page, pageSize };
    const data = await getScheduleChanges(params);

    if (data.data && data.data.length > 0) {
      setChanges(data.data);
      setTotalRecords(data.total || data.data.length);
    } else {
      // Nếu không có dữ liệu, dùng mẫu
      const sampleData = [
        { id: 1, type: "Hủy lịch", teacher_name: "Nguyễn Văn A", class_name: "Lập trình Web 1", new_date: "2025-08-12" },
        { id: 2, type: "Bù lịch", teacher_name: "Trần Thị B", class_name: "Cơ sở dữ liệu", new_date: "2025-08-14" }
      ];
      setChanges(sampleData);
      setTotalRecords(sampleData.length);
    }
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu:", err);
    // fallback dữ liệu mẫu khi API lỗi
    setChanges([
      { id: 1, type: "Hủy lịch", teacher_name: "Nguyễn Văn A", class_name: "Lập trình Web 1", new_date: "2025-08-12" }
    ]);
    setTotalRecords(1);
  }
};


  const handleApproval = async (id) => {
    try {
      await approveScheduleChange(id);
      fetchChanges();
    } catch (err) {
      console.error("Lỗi khi duyệt:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    fetchChanges();
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
            {/* Add more teachers here */}
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
          <input type="text" placeholder="Tìm kiếm" className="search-box1" />
          <FaSearch className="search-icon" />
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
            changes.map((item, index) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{item.type}</td>
                <td>{item.teacher_name}</td>
                <td>{item.class_name}</td>
                <td>{dayjs(item.new_date).format("DD/MM/YYYY")}</td>
                <td className="actions">
                  <FaInfoCircle
                    className="icon info"
                    title="Chi tiết"
                    //onClick={() => handleView(room)}
                  />
                    <FaRegCheckSquare  
                      className="icon check"
                      title="Duyệt"
                      onClick={() => handleApproval(item.id)}
                    />
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

      <div className="footer">
        <div>Hiển thị 1 kết quả</div>
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
    </div>
  );
};

export default ScheduleChangeList;
