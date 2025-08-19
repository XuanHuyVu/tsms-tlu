import React from "react";
import '../../../styles/ScheduleChangeDetail.css';


function mapChangeData(change) {
    if (!change) return {};

    const type = change.type;
    const fileNameFromUrl = change.fileUrl ? change.fileUrl.split('/').pop() : "";

    switch (type) {
        case "MAKE_UP_CLASS":
            return {
                type,
                newDate: change.newDate || "",
                newRoom: change.newRoom || null,
                newPeriodStart: change.newPeriodStart || "",
                newPeriodEnd: change.newPeriodEnd || "",
                lectureContent: change.lectureContent || "",
                fileUrl: change.fileUrl || "",
                fileName: fileNameFromUrl,
            };
        case "CLASS_CANCEL":
            return {
                type, 
                reason: change.reason || "",
                fileUrl: change.fileUrl || "",
                fileName: fileNameFromUrl,
            };
        default:
            return { type };
    }
}


export default function ScheduleChangeDetail({ change, onClose, onApprove, onReject }) {
    console.log("Dữ liệu raw 'change' nhận được trong ScheduleChangeDetail:", change);

    const mappedChange = mapChangeData(change);
    console.log("Dữ liệu mappedChange:", mappedChange);
    console.log("Type from mappedChange:", mappedChange.type);

    return (
        <div className="schedulechange-detail-modal">
            <div className="schedulechange-detail-box">
                <div className="schedulechange-detail-header">
                    <h2>
                        {mappedChange.type === "MAKE_UP_CLASS"
                        ? "Chi tiết lịch bù cần duyệt"
                        : mappedChange.type === "CLASS_CANCEL"
                            ? "Chi tiết lịch hủy cần duyệt"
                            : "Chi tiết lịch cần duyệt"}
                    </h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

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

                        {/* <div className="form-group">
                            <label>Ngày giảng:</label>
                            <input value={change?.date || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Tiết học:</label>
                            <input value={change?.lesson || ""} readOnly />
                        </div> */}

                        <div className="form-group">
                            <label>Bộ môn quản lý:</label>
                            <input value={change?.teachingSchedule?.classSection?.department?.name || ""} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Khoa quản lý:</label>
                            <input value={change?.teachingSchedule?.classSection?.faculty?.name || ""} readOnly />
                        </div>
{/* 
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
                        </div> */}

                        <div className="form-group">
                            <label>Phòng cũ:</label>
                            <input value={change?.teachingSchedule?.classSection?.room?.name || ""} readOnly />
                        </div>

                        {mappedChange.type === "MAKE_UP_CLASS" && (
                        <>
                         {console.log("mappedChange data:", mappedChange)}
                            <div className="form-group">
                            <label>Ngày dạy bù:</label>
                            <input
                                value={
                                mappedChange.newDate
                                    ? new Date(mappedChange.newDate).toLocaleDateString("vi-VN") // sẽ ra dd/MM/yyyy
                                    : "Chưa cập nhật"
                                }
                                readOnly
                            />
                            </div>

                            <div className="form-group">
                            <label>Phòng mới:</label>
                            <input
                                value={(mappedChange.newRoom && mappedChange.newRoom.name) ? mappedChange.newRoom.name : "Chưa cập nhật"}
                                readOnly
                            />
                            </div>

                            <div className="form-group">
                            <label>Tiết:</label>
                            <input
                                value={
                                mappedChange.newPeriodStart && mappedChange.newPeriodEnd
                                    ? `${mappedChange.newPeriodStart.trim()} - ${mappedChange.newPeriodEnd.trim()}`
                                    : "Chưa cập nhật"
                                }
                                readOnly
                            />
                            </div>

                            <div className="form-group full-width">
                            <label>Nội dung bài giảng:</label>
                            <input
                                value={mappedChange.lectureContent || "Chưa cập nhật"}
                                readOnly
                            />
                            </div>

                            <div className="form-group full-widt    h">
                            <label>Tài liệu:</label>
                            {mappedChange.fileUrl ? (
                                <a
                                href={mappedChange.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="file-link"
                                >
                                <span className="file-icon">📄</span>{" "}
                                {mappedChange.fileName || "Tài liệu.pdf"}
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

                <div className="schedulechange-detail-footer">
                    <button className="approve-btn" onClick={onApprove}>Duyệt</button>
                    <button className="reject-btn" onClick={onReject}>Từ chối</button>
                </div>
            </div>
        </div>
    );
}