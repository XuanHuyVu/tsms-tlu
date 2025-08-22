// src/features/teacher/schedule/ScheduleManagement.js
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { getScheduleChanges } from "../../../api/TeachingScheduleChangeApi";
import "../../../styles/ScheduleManagement.css";

const ScheduleManagement = () => {
  const [scheduleChanges, setScheduleChanges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScheduleChanges();
        setScheduleChanges(data);
      } catch (err) {
        console.error("Không lấy được dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "DA_DUYET":
        return { label: "Đã duyệt", className: "status-approved" };
      case "CHO_DUYET":
        return { label: "Chờ duyệt", className: "status-pending" };
      case "TU_CHOI":
        return { label: "Từ chối", className: "status-rejected" };
      default:
        return { label: status, className: "" };
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "HUY_LICH":
        return "Nghỉ dạy";
      case "DAY_BU":
        return "Dạy bù";
      default:
        return type;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="schedule-management">
      <div className="schedule-header-top">
        <h2>Danh sách đăng ký nghỉ dạy & dạy bù</h2>
        <div className="action-buttons">
          <button className="btn-leave">x Đăng ký nghỉ dạy</button>
          <button className="btn-makeup">+ Đăng ký dạy bù</button>
        </div>
      </div>

      {scheduleChanges.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <ul className="schedule-list">
          {scheduleChanges.map((item) => {
            const status = getStatusLabel(item.status);
            return (
              <li key={item.id} className="schedule-item">
                <div className="schedule-header">
                  <strong>
                    {getTypeLabel(item.type)} - {item.classSection.subject.name} ({item.classSection.name})
                  </strong>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="schedule-info">
                  <p>
                    <FaCalendarAlt /> Ngày: {formatDate(item.details.teachingDate)}
                  </p>
                  <p>
                    <FaClock /> Tiết {item.details.periodStart} - {item.details.periodEnd}
                  </p>
                  <p>
                    <FaMapMarkerAlt /> {item.classSection.room.name}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ScheduleManagement;
