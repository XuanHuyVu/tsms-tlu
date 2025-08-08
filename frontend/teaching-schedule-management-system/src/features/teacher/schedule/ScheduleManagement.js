import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaBook, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import RegisterLeaveModal from './RegisterLeaveModal';
import RegisterMakeupModal from './RegisterMakeupModal';
import '../../../styles/ScheduleManagement.css';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMakeupModal, setShowMakeupModal] = useState(false);

  useEffect(() => {
    // Cập nhật ngày hiện tại
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('vi-VN', options));

    // Mock data cho demo
    const mockSchedules = [
      {
        id: 1,
        title: "Nghỉ dạy - Lập trình phần tán-2-24 (CSE423_001)",
        date: "Thứ 5, ngày 31/7/2025",
        room: "208 - B5",
        time: "Tiết 1 → Tiết 3 (7:00 - 9:40)",
        note: "Lý do: Tham dự hội thảo",
        status: "CHO_DUYET",
        type: "NGHI_DAY"
      },
      {
        id: 2,
        title: "Nghỉ dạy - Công nghệ phần mềm-2-24 (CSE481_002)",
        date: "Thứ 2, ngày 29/7/2025",
        room: "208 - B5",
        time: "Tiết 10 → 12 (15:40 - 18:20)",
        note: "Lý do: Họp hội đồng khoa học",
        status: "DA_DUYET",
        type: "NGHI_DAY"
      },
      {
        id: 3,
        title: "Dạy bù - Công nghệ phần mềm-2-24 (CSE481_002)",
        date: "Thứ 7, ngày 2/8/2025",
        room: "207 - B5",
        time: "Tiết 7 → 9 (12:55 - 15:35)",
        note: "Bù cho buổi nghỉ ngày 29/7/2025",
        status: "DA_DUYET",
        type: "DAY_BU"
      }
    ];

    setTimeout(() => {
      setSchedules(mockSchedules);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CHO_DUYET':
        return <span className="status-badge pending">Chờ duyệt</span>;
      case 'DA_DUYET':
        return <span className="status-badge approved">Đã duyệt</span>;
      case 'DA_HUY':
        return <span className="status-badge rejected">Đã hủy</span>;
      default:
        return <span className="status-badge">Không xác định</span>;
    }
  };

  // Removed getTypeIcon function as we're not using type icons anymore

  const handleLeaveSubmit = (formData) => {
    console.log('Đăng ký nghỉ dạy:', formData);
    // TODO: Call API to submit leave request
    
    // Tìm thông tin schedule từ formData.scheduleId
    const scheduleOptions = [
      { id: 1, name: "Lập trình phần tán-2-24 (CSE423_001) - Thứ 5, Tiết 1-3" },
      { id: 2, name: "Công nghệ phần mềm-2-24 (CSE481_002) - Thứ 2, Tiết 10-12" },
      { id: 3, name: "Cơ sở dữ liệu-2-24 (CSE301_001) - Thứ 4, Tiết 7-9" }
    ];
    
    const selectedSchedule = scheduleOptions.find(s => s.id == formData.scheduleId);
    const scheduleName = selectedSchedule ? selectedSchedule.name.split(' - ')[0] : 'Lớp học phần';
    
    // Format date để hiển thị đẹp hơn
    const dateObj = new Date(formData.date);
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const formattedDate = `${dayNames[dateObj.getDay()]}, ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    
    // Format time từ period
    const timeMapping = {
      "1-2": "Tiết 1 → Tiết 2 (7:00 - 8:40)",
      "3-4": "Tiết 3 → Tiết 4 (9:00 - 10:40)", 
      "5-6": "Tiết 5 → Tiết 6 (11:00 - 12:40)",
      "7-8": "Tiết 7 → Tiết 8 (13:00 - 14:40)",
      "9-10": "Tiết 9 → Tiết 10 (15:00 - 16:40)",
      "11-12": "Tiết 11 → Tiết 12 (17:00 - 18:40)"
    };
    
    // Thêm vào danh sách schedules với đầy đủ thông tin
    const newSchedule = {
      id: schedules.length + 1,
      title: `Nghỉ dạy - ${scheduleName}`,
      date: formattedDate,
      room: formData.room ? formData.room.replace('-', ' - ') : "208 - B5",
      time: timeMapping[formData.period] || "Tiết 1 → Tiết 3 (7:00 - 9:40)",
      note: `Lý do: ${formData.reason}`,
      status: "CHO_DUYET",
      type: "NGHI_DAY"
    };
    setSchedules(prev => [newSchedule, ...prev]);
  };

  const handleMakeupSubmit = (formData) => {
    console.log('Đăng ký dạy bù:', formData);
    // TODO: Call API to submit makeup request
    
    // Tìm thông tin schedule gốc từ formData.originalScheduleId
    const missedSchedules = [
      { id: 1, name: "Lập trình phần tán-2-24 (CSE423_001) - Nghỉ ngày 31/7/2025" },
      { id: 2, name: "Công nghệ phần mềm-2-24 (CSE481_002) - Nghỉ ngày 29/7/2025" }
    ];
    
    const selectedSchedule = missedSchedules.find(s => s.id == formData.originalScheduleId);
    const scheduleName = selectedSchedule ? selectedSchedule.name.split(' - ')[0] : 'Lớp học phần';
    
    // Format makeup date
    const dateObj = new Date(formData.makeupDate);
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const formattedDate = `${dayNames[dateObj.getDay()]}, ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    
    // Format time từ makeupTime
    const timeMapping = {
      "1-3": "Tiết 1 → Tiết 3 (7:00 - 9:40)",
      "4-6": "Tiết 4 → Tiết 6 (9:50 - 12:30)", 
      "7-9": "Tiết 7 → Tiết 9 (12:55 - 15:35)",
      "10-12": "Tiết 10 → Tiết 12 (15:40 - 18:20)"
    };
    
    // Extract ngày nghỉ từ selectedSchedule name nếu có
    const missedDateMatch = selectedSchedule ? selectedSchedule.name.match(/(\d{1,2}\/\d{1,2}\/\d{4})/) : null;
    const missedDate = missedDateMatch ? missedDateMatch[1] : '';
    
    // Thêm vào danh sách schedules với đầy đủ thông tin
    const newSchedule = {
      id: schedules.length + 1,
      title: `Dạy bù - ${scheduleName}`,
      date: formattedDate,
      room: formData.room ? formData.room.replace('-', ' - ') : "207 - B5",
      time: timeMapping[formData.makeupTime] || "Tiết 7 → Tiết 9 (12:55 - 15:35)",
      note: `Bù cho buổi nghỉ ngày ${missedDate}${formData.content ? '. Nội dung: ' + formData.content : ''}`,
      status: "CHO_DUYET",
      type: "DAY_BU"
    };
    setSchedules(prev => [newSchedule, ...prev]);
  };

  if (loading) {
    return (
      <div className="schedule-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-management">
      <div className="schedule-content-wrapper">
        <div className="schedule-content">
          <div className="content-header">
            <h2>Danh sách đăng ký nghỉ dạy & dạy bù</h2>
            <div className="action-buttons">
              <button 
                className="btn-register btn-leave"
                onClick={() => setShowLeaveModal(true)}
              >
               x Đăng ký nghỉ dạy
              </button>
              <button 
                className="btn-register btn-makeup"
                onClick={() => setShowMakeupModal(true)}
              >
               + Đăng ký dạy bù
              </button>
            </div>
          </div>

          <div className="schedule-list">
            {schedules.length === 0 ? (
              <div className="empty-state">
                <p>Không có lịch dạy nào được đăng ký</p>
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
                      {getStatusBadge(schedule.status)}
                    </div>

                    <div className="card-body">
                      <div className="schedule-info">
                        <div className="info-row">
                          <FaCalendarAlt className="info-icon" />
                          <span className="info-text">{schedule.date}</span>
                        </div>
                        <div className="info-row">
                          <FaBook className="info-icon" />
                          <span className="info-text">Thực hành</span>
                          <FaMapMarkerAlt className="info-icon" style={{ marginLeft: "12px" }} />
                          <span className="info-text">{schedule.room}</span>
                        </div>
                        <div className="info-row">
                          <FaClock className="info-icon" />
                          <span className="info-text">{schedule.time}</span>
                        </div>
                        {schedule.note && (
                          <div className="info-row">
                            <span className="info-text">{schedule.note}</span>
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

      {/* Modals */}
      <RegisterLeaveModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={handleLeaveSubmit}
      />
      
      <RegisterMakeupModal
        isOpen={showMakeupModal}
        onClose={() => setShowMakeupModal(false)}
        onSubmit={handleMakeupSubmit}
      />
    </div>
  );
};

export default ScheduleManagement;
