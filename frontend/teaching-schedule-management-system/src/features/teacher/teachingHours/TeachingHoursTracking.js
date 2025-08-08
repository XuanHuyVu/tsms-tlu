import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaBook, FaMapMarkerAlt, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import '../../../styles/TeachingHoursTracking.css';

const TeachingHoursTracking = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data dựa trên hình ảnh
    const mockSchedules = [
      {
        id: 1,
        title: "Lập trình phần tán-2-24 (CSE423_001)",
        date: "Thứ 6, ngày 25/7/2025", 
        type: "Thực hành",
        room: "208 - B5",
        time: "Tiết 1 → 3 (7:00 - 9:40)",
        status: "completed", // đã dạy
        statusText: "Đã dạy"
      },
      {
        id: 2,
        title: "Lập trình phần tán-2-24 (CSE423_001)",
        date: "Thứ 5, ngày 31/7/2025",
        type: "Thực hành", 
        room: "208 - B5",
        time: "Tiết 1 → 3 (7:00 - 9:40)",
        status: "pending", // chờ xác nhận
        statusText: "Chờ xác nhận"
      },
      {
        id: 3,
        title: "Công nghệ phần mềm-2-24 (CSE481_002)",
        date: "Thứ 6, ngày 1/8/2025",
        type: "Thực hành",
        room: "208 - B5", 
        time: "Tiết 10 → 12 (15:40 - 18:20)",
        status: "pending", // chờ xác nhận
        statusText: "Chờ xác nhận"
      }
    ];

    setTimeout(() => {
      setSchedules(mockSchedules);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status, statusText) => {
    if (status === 'completed') {
      return <span className="status-badge completed">Hoàn thành</span>;
    } else {
      return null; // Không hiển thị badge cho pending
    }
  };

  const handleConfirm = (scheduleId) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, status: 'completed', statusText: 'Đã dạy' }
          : schedule
      )
    );
  };

  if (loading) {
    return (
      <div className="teaching-hours-tracking">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teaching-hours-tracking">
      <div className="schedule-content-wrapper">
        <div className="schedule-content">
          <div className="content-header">
            <h2>Danh sách giờ dạy</h2>
          </div>

          <div className="schedule-list">
            {schedules.length === 0 ? (
              <div className="empty-state">
                <p>Không có lịch dạy nào</p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="schedule-card">
                  <div className="card-left-accent"></div>
                  <div className="card-content">
                    <div className="card-header">
                      <div className="schedule-title">
                        <h3>{schedule.title}</h3>
                      </div>
                      <div className="card-header-actions">
                        {schedule.status === 'completed' && getStatusBadge(schedule.status, schedule.statusText)}
                        {schedule.status === 'pending' && (
                          <button 
                            className="confirm-btn"
                            onClick={() => handleConfirm(schedule.id)}
                          >
                            Xác nhận
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="schedule-info">
                        <div className="info-row">
                          <FaCalendarAlt className="info-icon" />
                          <span className="info-text">{schedule.date}</span>
                        </div>
                        <div className="info-row">
                          <FaBook className="info-icon" />
                          <span className="info-text">{schedule.type}</span>
                          <FaMapMarkerAlt className="info-icon" style={{ marginLeft: "12px" }} />
                          <span className="info-text">{schedule.room}</span>
                        </div>
                        <div className="info-row">
                          <FaClock className="info-icon" />
                          <span className="info-text">{schedule.time}</span>
                        </div>
                        {schedule.status === 'completed' && (
                          <div className="info-row">
                            <FaCheckCircle className="info-icon status-icon" style={{ color: '#10b981' }} />
                            <span className="info-text status-text">{schedule.statusText}</span>
                          </div>
                        )}
                        {schedule.status === 'pending' && (
                          <div className="info-row">
                            <FaHourglassHalf className="info-icon pending-icon" style={{ color: '#f59e0b' }} />
                            <span className="info-text pending-text">Chờ xác nhận</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingHoursTracking;
