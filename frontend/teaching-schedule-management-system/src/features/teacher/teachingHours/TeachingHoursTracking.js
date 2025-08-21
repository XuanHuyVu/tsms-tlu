// src/components/teacher/teaching-hours/TeachingHoursTracking.jsx
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaBook,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import {
  getTeachingSchedules,
  confirmTeachingHour,
} from "../../../api/TeachingHoursApi";
import "../../../styles/TeachingHoursTracking.css";

const TeachingHoursTracking = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const teacherId = 1; // sau này thay bằng ID khi login

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getTeachingSchedules(teacherId);

        const mappedSchedules = data.flatMap((schedule) =>
          schedule.details.map((detail) => {
            const teachingDate = new Date(detail.teachingDate);
            return {
              id: detail.id,
              title: `${schedule.classSection.subject.name} (${schedule.classSection.name})`,
              date: teachingDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              type: detail.type,
              room: schedule.classSection.room?.name || "Chưa có phòng",
              time: `Tiết ${detail.periodStart} → ${detail.periodEnd}`,
              status: detail.status === "DA_DAY" ? "completed" : "pending",
              rawDetail: { ...detail },
              teachingDate: detail.teachingDate,
              periodStart: detail.periodStart,
              periodEnd: detail.periodEnd,
            };
          })
        );

        setSchedules(mappedSchedules);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giờ dạy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleConfirm = async (schedule) => {
    const now = new Date();
    const classDate = new Date(schedule.teachingDate);

    // Nếu chưa đến ngày dạy
    if (now < classDate.setHours(0, 0, 0, 0)) {
      alert("Chưa đến ngày dạy, không thể xác nhận!");
      return;
    }

    try {
      setConfirmingId(schedule.id);
      await confirmTeachingHour(schedule.rawDetail);

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === schedule.id
            ? {
                ...s,
                status: "completed",
                rawDetail: { ...s.rawDetail, status: "DA_DAY" },
              }
            : s
        )
      );
    } catch (error) {
      console.error("Lỗi khi xác nhận:", error);
    } finally {
      setConfirmingId(null);
    }
  };

  // kiểm tra trong khung giờ cho phép
  const canConfirm = (schedule) => {
    const now = new Date();
    const classDate = new Date(schedule.teachingDate);

    // chỉ chấm công trong đúng ngày dạy
    if (now.toDateString() !== classDate.toDateString()) return false;

    const startHour = 7; // tiết 1 bắt đầu 7h00
    const minutesPerPeriod = 50;

    const endTime = new Date(classDate);
    endTime.setHours(startHour, 0, 0, 0);
    endTime.setMinutes(endTime.getMinutes() + schedule.periodEnd * minutesPerPeriod);

    // Chỉ cho phép chấm công từ 30p trước khi kết thúc đến khi kết thúc
    const confirmStart = new Date(endTime.getTime() - 30 * 60 * 1000);
    const confirmEnd = endTime;

    return now >= confirmStart && now <= confirmEnd;
  };

  // kiểm tra đã hết hạn (quá ngày hoặc quá giờ cho phép)
  const isExpired = (schedule) => {
    const now = new Date();
    const classDate = new Date(schedule.teachingDate);

    // Nếu ngày đã qua -> hết hạn
    if (now > classDate.setHours(23, 59, 59, 999)) return true;

    // Nếu trong ngày nhưng đã qua giờ cho phép -> hết hạn
    if (!canConfirm(schedule) && now.toDateString() === classDate.toDateString()) {
      const startHour = 7;
      const minutesPerPeriod = 50;

      const endTime = new Date(classDate);
      endTime.setHours(startHour, 0, 0, 0);
      endTime.setMinutes(endTime.getMinutes() + schedule.periodEnd * minutesPerPeriod);

      if (now > endTime) return true;
    }

    return false;
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
    <>
      <div className="content-header">
        <h2>Danh sách giờ dạy</h2>
      </div>
      <div className="schedule-list">
        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>Không có lịch dạy nào</p>
          </div>
        ) : (
          schedules.map((schedule) => {
            const isConfirmable = canConfirm(schedule);
            const expired = isExpired(schedule);

            return (
              <div key={schedule.id} className="schedule-card">
                <div className="card-left-accent"></div>
                <div className="card-content">
                  <div className="card-header">
                    <div className="schedule-title">
                      <h3>{schedule.title}</h3>
                    </div>
                    <div className="card-header-actions">
                      {schedule.status === "completed" ? (
                        <span className="status-badge completed">Hoàn thành</span>
                      ) : expired ? (
                        <span className="status-badge expired">Đã hết hạn</span>
                      ) : (
                        <button
                          className="confirm-btn"
                          onClick={() => handleConfirm(schedule)}
                          disabled={confirmingId === schedule.id || !isConfirmable}
                        >
                          {confirmingId === schedule.id
                            ? "Đang xác nhận..."
                            : "Xác nhận"}
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
                        <FaMapMarkerAlt
                          className="info-icon"
                          style={{ marginLeft: "12px" }}
                        />
                        <span className="info-text">{schedule.room}</span>
                      </div>
                      <div className="info-row">
                        <FaClock className="info-icon" />
                        <span className="info-text">{schedule.time}</span>
                      </div>
                      {schedule.status === "completed" && (
                        <div className="info-row">
                          <FaCheckCircle
                            className="info-icon status-icon"
                            style={{ color: "#10b981" }}
                          />
                          <span className="info-text status-text">Đã dạy</span>
                        </div>
                      )}
                      {schedule.status === "pending" && !expired && (
                        <div className="info-row">
                          <FaHourglassHalf
                            className="info-icon pending-icon"
                            style={{ color: "#f59e0b" }}
                          />
                          <span className="info-text pending-text">
                            Chờ xác nhận
                          </span>
                        </div>
                      )}
                      {expired && schedule.status !== "completed" && (
                        <div className="info-row">
                          <FaHourglassHalf
                            className="info-icon expired-icon"
                            style={{ color: "#ef4444" }}
                          />
                          <span className="info-text expired-text">Đã hết hạn</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default TeachingHoursTracking;
