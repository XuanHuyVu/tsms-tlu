// src/components/ScheduleChangeDetail.js
import React from "react";
import '../../../styles/ScheduleChangeDetail.css';


function mapChangeData(change) {
    if (!change) return {};

    // Get type directly from the change object
    const type = change.type;
    const fileNameFromUrl = change.fileUrl ? change.fileUrl.split('/').pop() : "";

    switch (type) {
        case "MAKE_UP_CLASS":
            return {
                type, // Include type in the mapped object
                newDate: change.newDate || "",
                lectureContent: change.lectureContent || "",
                fileUrl: change.fileUrl || "",
                fileName: fileNameFromUrl,
            };
        case "CLASS_CANCEL":
            return {
                type, // Include type in the mapped object
                reason: change.reason || "",
                fileUrl: change.fileUrl || "",
                fileName: fileNameFromUrl,
            };
        default:
            // Always return type for consistent usage in JSX
            return { type };
    }
}


export default function ScheduleChangeDetail({ change, onClose, onApprove, onReject }) {
    // console.log the raw 'change' prop to debug its structure
    console.log("Dữ liệu raw 'change' nhận được trong ScheduleChangeDetail:", change);

    const mappedChange = mapChangeData(change);
    console.log("Dữ liệu mappedChange:", mappedChange);
    console.log("Type from mappedChange:", mappedChange.type); // Access type from mappedChange

    return (
        <div className="schedulechange-detail-modal">
            <div className="schedulechange-detail-box">
                {/* Header */}
                <div className="schedulechange-detail-header">
                    <h2>CHI TIẾT LỊCH CẦN DUYỆT</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                {/* Body */}
                <div className="schedulechange-detail-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Lớp học phần:</label>
                            <input value={change?.teachingSchedule?.classSection?.name || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Giảng viên phụ trách:</label>
                            <input value={change?.teachingSchedule?.classSection?.teacher?.fullName || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Ngày giảng:</label>
                            {/* Assuming change.date is already in a displayable format or needs dayjs.format */}
                            <input value={change?.date || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Tiết học:</label>
                            <input value={change?.lesson || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Bộ môn quản lý:</label>
                            <input value={change?.teachingSchedule?.classSection?.department?.name || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Khoa quản lý:</label>
                            <input value={change?.teachingSchedule?.classSection?.faculty?.name || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Loại lịch học:</label>
                            <input
                                value={
                                    mappedChange.type === "MAKE_UP_CLASS"
                                        ? "Lịch bù"
                                        : mappedChange.type === "CLASS_CANCEL"
                                            ? "Lịch hủy"
                                            : ""
                                }
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Phòng học:</label>
                            <input value={change?.teachingSchedule?.classSection?.room?.name || ""} readOnly />
                        </div>

                        {mappedChange.type === "MAKE_UP_CLASS" && (
                            <>
                                <div className="form-group">
                                    <label>Ngày cần dạy bù:</label>
                                    <input value={mappedChange.newDate} readOnly />
                                </div>

                                <div className="form-group full-width">
                                    <label>Nội dung bài giảng:</label>
                                    <input value={mappedChange.lectureContent} readOnly />
                                </div>

                                <div className="form-group full-width">
                                    <label>Tài liệu:</label>
                                    {mappedChange.fileUrl ? (
                                        <a href={mappedChange.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                                            <span className="file-icon">📄</span> {mappedChange.fileName || "Tài liệu.pdf"}
                                        </a>
                                    ) : (
                                        <div>Không có</div>
                                    )}
                                </div>
                            </>
                        )}

                        {mappedChange.type === "CLASS_CANCEL" && (
                            <>
                                <div className="form-group full-width">
                                    <label>Lý do đăng ký nghỉ dạy:</label>
                                    <input value={mappedChange.reason} readOnly />
                                </div>

                                <div className="form-group full-width">
                                    <label>Minh chứng:</label>
                                    {mappedChange.fileUrl ? (
                                        <a href={mappedChange.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                                            <span className="file-icon">📄</span> {mappedChange.fileName || "Minh chứng.pdf"}
                                        </a>
                                    ) : (
                                        <div>Không có</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="schedulechange-detail-footer">
                    <button className="approve-btn" onClick={onApprove}>Duyệt</button>
                    <button className="reject-btn" onClick={onReject}>Từ chối</button>
                </div>
            </div>
        </div>
    );
}