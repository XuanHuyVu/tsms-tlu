// src/features/admin/notifications/NotificationsList.js
import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaInfoCircle, FaTrash, FaPaperPlane } from "react-icons/fa";
import NotificationApi from "../../../api/NotificationApi";
import "../../../styles/NotificationsList.css";
import "../../../styles/Toast.css";
import AppToast from "../../../components/AppToast";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import NotificationDetail from "./NotificationDetail";

/* Format dd/MM/yyyy HH:mm */
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

export default function NotificationsList() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Detail modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const toastRef = useRef(null);

  const load = async (signal) => {
    setLoading(true);
    try {
      const res = await NotificationApi.fetchPage({
        page,
        size,
        search: search.trim(),
        sort: "createdAt,desc",
      });

      if (signal?.aborted) return;

      // BE có thể trả mảng hoặc Page object
      if (Array.isArray(res)) {
        const q = search.trim().toLowerCase();

        const filtered = q
          ? res.filter(
              (n) =>
                (n.title || "").toLowerCase().includes(q) ||
                (n.content || "").toLowerCase().includes(q) ||
                (n.type || "").toLowerCase().includes(q)
            )
          : res;

        const sorted = [...filtered].sort((a, b) => {
          const ta = Date.parse(a.createdAt || "") || 0;
          const tb = Date.parse(b.createdAt || "") || 0;
          return tb - ta;
        });

        const totalAll = sorted.length;
        const start = page * size;
        const end = start + size;

        setRows(sorted.slice(start, end));
        setTotal(totalAll);
        setTotalPages(Math.max(1, Math.ceil(totalAll / size)));
      } else {
        setRows(res?.content || []);
        setTotal(res?.totalElements || 0);
        setTotalPages(res?.totalPages || 0);
      }
    } catch (err) {
      if (!signal?.aborted) {
        console.error("[Notifications] load error", err);
        setRows([]);
        setTotal(0);
        setTotalPages(0);
        toastRef.current?.error("Không thể tải danh sách thông báo");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const rangeText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    return `Từ ${start} đến ${end} bản ghi`;
  }, [page, size, total]);

  const promptDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setShowDelete(false);
    try {
      await NotificationApi.delete(deleteId);
      // nếu xoá phần tử cuối của trang hiện tại thì lùi trang
      if (rows.length === 1 && page > 0) setPage((p) => p - 1);
      else {
        const ctrl = new AbortController();
        await load(ctrl.signal);
      }
      toastRef.current?.success("Xoá thông báo thành công");
    } catch (err) {
      console.error("[Notifications] delete error", err);
      toastRef.current?.error("Xoá thông báo thất bại");
    } finally {
      setDeleteId(null);
    }
  };

  const renderRow = (n, i) => {
    const id = n.id ?? `noti-${i}`;
    const recipients = Array.isArray(n.recipients) ? n.recipients : [];
    const unread = recipients.filter((r) => !r.isRead).length;
    const receiversCount = recipients.length;

    // Suy luận trạng thái từ recipients
    const status =
      receiversCount === 0 ? "Chưa gửi" : unread > 0 ? "Đã gửi" : "Đã đọc hết";

    const canPublish = receiversCount === 0; // chưa gửi → hiện nút gửi

    return (
      <tr key={id}>
        <td>{page * size + i + 1}</td>
        <td className="noti-title-cell">
          <div className="noti-title-text">{n.title || ""}</div>
          <div className="noti-subtext">{n.content || ""}</div>
        </td>
        <td>{n.type || ""}</td>
        <td>{fmtDate(n.createdAt)}</td>
        <td style={{ textAlign: "center" }}>{receiversCount}</td>
        <td>{status}</td>
        <td>
          <div className="noti-actions">
            {/* Gửi */}
            <button
              type="button"
              className={`noti-btn primary ${!canPublish ? "disabled" : ""}`}
              disabled={!canPublish}
              title={canPublish ? "Gửi thông báo" : "Đã gửi"}
              onClick={async () => {
                try {
                  await NotificationApi.publish(n.id);
                  toastRef.current?.success("Đã gửi thông báo");
                  const ctrl = new AbortController();
                  await load(ctrl.signal);
                } catch (e) {
                  console.error(e);
                  toastRef.current?.error(
                    "Không thể gửi. Kiểm tra endpoint /{id}/publish."
                  );
                }
              }}
            >
              <FaPaperPlane style={{ marginRight: 6 }} />
              {canPublish ? "Gửi" : "Đã gửi"}
            </button>

            {/* Chi tiết */}
            <button
              type="button"
              className="noti-icon info"
              title="Chi tiết"
              onClick={() => {
                setDetailId(n.id);
                setDetailOpen(true);
              }}
            >
              <FaInfoCircle />
            </button>

            {/* Xoá (luôn dùng id thật) */}
            <button
              type="button"
              className="noti-icon danger"
              title="Xoá"
              onClick={() => n.id && promptDelete(n.id)}
            >
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="noti-container">
      <AppToast ref={toastRef} />

      {/* Modal chi tiết */}
      {detailOpen && (
        <NotificationDetail
          open={detailOpen}
          notificationId={detailId}
          onClose={() => {
            setDetailOpen(false);
            setDetailId(null);
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="XÓA THÔNG BÁO"
        message="Bạn có chắc chắn muốn xóa thông báo này không?"
      />

      {/* Header */}
      <div className="noti-header">
        <div className="noti-title">Thông báo</div>

        <form className="noti-search" onSubmit={handleSearch}>
          <input
            className="noti-search-input"
            placeholder="Tìm theo tiêu đề/nội dung/loại"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="noti-search-icon" onClick={handleSearch} />
        </form>
      </div>

      {/* Table */}
      <table className="noti-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề / Nội dung</th>
            <th>Loại</th>
            <th>Ngày tạo</th>
            <th>Số người nhận</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ padding: 16 }}>
                Đang tải…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 16 }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>

      {/* Footer / Pagination (đồng bộ kiểu DepartmentList) */}
      <div className="footer">
        <div>
          Hiển thị {rows.length} kết quả
          {search && ` (lọc từ ${total})`}
        </div>
        <div className="pagination">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>{rangeText}</span>
          <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
            &lt;
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
