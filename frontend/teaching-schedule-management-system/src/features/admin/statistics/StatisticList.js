import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaSearch } from 'react-icons/fa';
import { getAllStatistic } from "../../../api/StatisticApi";
import '../../../styles/StatisticList.css';

const StatisticsReport = () => {
  const [filters, setFilters] = useState({
    period: "Tháng",
    semester: "Học kỳ 1 - 2025",
    faculty: "Tất cả khoa",
    status: "Đang làm việc",
    search: "",
  });

  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAllStatistic();
        setStatistics(data);
      } catch (error) {
        console.error("Không thể tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="statistic-container">
      <div className="statistic-header">
        <button className="add-button">
          In báo cáo
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên"
            className="search-box"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

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
          <button className="add-button">
            Thống kê
          </button>
        </div>
      </div>

      <table className="statistic-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Giảng viên</th>
            <th>Học kỳ</th>
            <th>Giờ đã dạy</th>
            <th>Giờ chưa dạy</th>
            <th>Giờ dạy bù</th>
            <th>Tổng giờ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "12px" }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : statistics.length > 0 ? (
            statistics.map((item, index) => (
              <tr key={item.teacherId}>
                <td>{index + 1}</td>
                <td>{item.teacherName}</td>
                <td>{item.semesterName}</td>
                <td>{item.taughtHours}</td>
                <td>{item.notTaughtHours}</td>
                <td>{item.makeUpHours}</td>
                <td>{item.totalHours}</td>
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
        <div>Hiển thị {statistics.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {statistics.length} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsReport;
