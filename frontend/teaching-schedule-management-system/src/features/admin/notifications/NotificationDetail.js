// src/features/admin/notifications/NotificationDetail.js
import { useEffect, useMemo, useRef, useState } from "react";
import NotificationApi from "../../../api/NotificationApi";
import "../../../styles/NotificationsList.css"; // tái dùng style bảng, header

function fmtDate(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  } catch {
    return String(dt);
  }
}

export default function NotificationDetail({ open, notificationId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!open || !notificationId) {
      setData(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const detail = await NotificationApi.getById(notificationId);
        if (!cancelled && mounted.current) setData(detail || null);
      } finally {
        if (!cancelled && mounted.current) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, notificationId]);

  const recipients = useMemo(
    () => (Array.isArray(data?.recipients) ? data.recipients : []),
    [data]
  );
  const unread = useMemo(
    () => recipients.filter((r) => !r.isRead).length,
    [recipients]
  );

  if (!open) return null;

  return (
    <div className="noti-modal-backdrop" role="dialog" aria-modal="true" aria-label="Chi tiết thông báo">
      <div className="noti-modal">
        <div className="noti-modal-header">
          <div>CHI TIẾT THÔNG BÁO</div>
          <button className="noti-close" onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className="noti-modal-body">
          {loading ? (
            <div style={{ padding: 16 }}>Đang tải…</div>
          ) : !data ? (
            <div style={{ padding: 16 }}>Không có dữ liệu</div>
          ) : (
            <>
              <div className="noti-grid2">
                <div>
                  <label className="noti-label">Tiêu đề:</label>
                  <input className="noti-input" value={data.title || ""} readOnly />
                </div>
                <div>
                  <label className="noti-label">Loại:</label>
                  <input className="noti-input" value={data.type || ""} readOnly />
                </div>
                <div>
                  <label className="noti-label">Ngày tạo:</label>
                  <input className="noti-input" value={fmtDate(data.createdAt)} readOnly />
                </div>
                <div>
                  <label className="noti-label">Cập nhật:</label>
                  <input className="noti-input" value={fmtDate(data.updatedAt)} readOnly />
                </div>
                <div>
                  <label className="noti-label">Mã thay đổi lịch (nếu có):</label>
                  <input
                    className="noti-input"
                    value={data.relatedScheduleChangeId ?? ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="noti-label">Trạng thái:</label>
                  <input
                    className="noti-input"
                    value={
                      recipients.length === 0
                        ? "Chưa gửi"
                        : unread > 0
                        ? "Đã gửi"
                        : "Đã đọc hết"
                    }
                    readOnly
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="noti-label">Nội dung:</label>
                <textarea
                  className="noti-textarea"
                  value={data.content || ""}
                  rows={5}
                  readOnly
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="noti-subtitle">Danh sách người nhận</div>
                <table className="noti-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Recipient ID</th>
                      <th>User ID</th>
                      <th>Đã đọc?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: 12 }}>Chưa có người nhận</td></tr>
                    ) : (
                      recipients.map((r, i) => (
                        <tr key={r.id ?? `${r.userId}-${i}`}>
                          <td>{i + 1}</td>
                          <td>{r.id ?? "—"}</td>
                          <td>{r.userId ?? "—"}</td>
                          <td>{r.isRead ? "Đã đọc" : "Chưa đọc"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="noti-modal-actions">
          <button className="noti-btn ghost" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
