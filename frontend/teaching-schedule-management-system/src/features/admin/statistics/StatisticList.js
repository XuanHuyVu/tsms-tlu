import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch } from 'react-icons/fa';
import '../../../styles/StatisticList.css';
const StatisticsReport = () => {
  const [filters, setFilters] = useState({
    period: "Tháng",
    semester: "Học kỳ 1 - 2025",
    faculty: "Tất cả khoa",
    status: "Đang làm việc",
    search: "",
  });

const mockData = [
  {
    id: 1,
    name: "ThS. Nguyễn Văn A",
    faculty: "Công Nghệ Thông Tin",
    status: "Đang làm việc",
    subjects: 3,
    theoryHours: 90,
    practiceHours: 45,
    total: 135,
  },
  {
    id: 2,
    name: "TS. Trần Thị B",
    faculty: "Toán – Tin",
    status: "Đang làm việc",
    subjects: 4,
    theoryHours: 120,
    practiceHours: 60,
    total: 180,
  },
  {
    id: 3,
    name: "ThS. Lê Văn C",
    faculty: "Điện Tử Viễn Thông",
    status: "Đang nghỉ phép",
    subjects: 2,
    theoryHours: 60,
    practiceHours: 30,
    total: 90,
  },
];
  return (
    <div className="statistic-container">
      <div className="statistic-header">
        <button className="add-button" onClick={() => {
        }}>
          In báo cáo
        </button>
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div>
        <div className="filter-bar-statistics">
        <div className="filter-items-group-statistics">
            {/* Filter 1 */}
            <div className="filter-item-statistics">
            <label>Thống kê theo</label>
            <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
            >
                <option>Tháng</option>
                <option>Quý</option>
                <option>Năm</option>
            </select>
            </div>

            <div className="filter-item-statistics">
            <label>Học kỳ</label>
            <select
                value={filters.semester}
                onChange={(e) =>
                setFilters({ ...filters, semester: e.target.value })
                }
            >
                <option>Học kỳ 1 - 2025</option>
                <option>Học kỳ 2 - 2025</option>
            </select>
            </div>

            <div className="filter-item-statistics">
            <label>Khoa/bộ môn</label>
            <select
                value={filters.faculty}
                onChange={(e) =>
                setFilters({ ...filters, faculty: e.target.value })
                }
            >
                <option>Tất cả khoa</option>
                <option>Công Nghệ Thông Tin</option>
                <option>Kinh tế</option>
            </select>
            </div>

            <div className="filter-item-statistics">
            <label>Trạng thái</label>
            <select
                value={filters.status}
                onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
                }
            >
                <option>Đang làm việc</option>
                <option>Nghỉ phép</option>
            </select>
            </div>
        </div>

        <div>
            <button
            className="add-button"
            onClick={() => {
            }}
            >
            Thống kê
            </button>
        </div>
        </div>


        <table className="statistic-table">
            <thead>
                <tr>
                <th>STT</th>
                <th>Giảng viên</th>
                <th>Khoa</th>
                <th>Số môn</th>
                <th>Giờ lý thuyết</th>
                <th>Giờ thực hành</th>
                <th>Tổng</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {mockData.length > 0 ? (
                mockData.map((item, index) => (
                    <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.faculty}</td>
                    <td>{item.subjects}</td>
                    <td>{item.theoryHours}</td>
                    <td>{item.practiceHours}</td>
                    <td>{item.total}</td>
                    <td className="actions">
                        <FaInfoCircle className="icon info" title="Chi tiết" />
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "12px" }}>
                    Không có dữ liệu
                    </td>
                </tr>
                )}
            </tbody>
        </table>


      <div className="footer">
        <div>Hiển thị {3} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {3} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StatisticsReport;
