import { useEffect, useMemo, useState, useRef } from "react";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import { FaSearch, FaInfoCircle, FaPen, FaTrash } from "react-icons/fa";
import "../../../styles/DepartmentList.css";
import TeachingScheduleForm from "./TeachingScheduleForm";
import TeachingScheduleDetail from "./TeachingScheduleDetail";

export default function TeachingScheduleList() {
  /* ---------- STATE ---------- */
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  /* pop-up flags */
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);      // null = “Thêm”
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(null);

  /* cache id đã fetch detail */
  const fetchedDetailIds = useRef(new Set());

  /* ---------- LOAD PAGE ---------- */
  const load = async (signal) => {
    setLoading(true);
    try {
      const res = await TeachingScheduleApi.fetchPage({
        page,
        size,
        search: search.trim(),
        sort: "id,asc",
      });
      if (signal?.aborted) return;

      console.log("[List] page data =", res);
      setRows(res.content);
      setTotal(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err) {
      if (!signal?.aborted) {
        console.error("[List] load error", err);
        setRows([]);
        setTotal(0);
        setTotalPages(0);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  /* load khi page/size/search đổi */
  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, search]);

  /* ---------- FETCH SESSIONS (= details.length) ---------- */
  useEffect(() => {
    const need = rows.filter(
      (r) => r.sessions === 0 && !fetchedDetailIds.current.has(r.id)
    );
    if (need.length === 0) return;

    console.log("[List] need fetch details of IDs:", need.map((n) => n.id));

    let cancelled = false;
    (async () => {
      try {
        const arr = await Promise.all(
          need.map((r) =>
            TeachingScheduleApi.getTeachingScheduleById(r.id).catch(() => null)
          )
        );
        const map = {};
        arr.forEach((d) => {
          if (d && Array.isArray(d.details)) {
            map[d.id] = d.details.length;
            fetchedDetailIds.current.add(d.id);
            console.log(`[Detail] id=${d.id} sessions=${d.details.length}`);
          }
        });
        if (cancelled) return;
        setRows((prev) =>
          prev.map((r) => (map[r.id] ? { ...r, sessions: map[r.id] } : r))
        );
      } catch (e) {
        if (!cancelled) console.error("[List] fetch details error", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rows]);

  /* ---------- HANDLERS ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa lịch giảng dạy này?")) return;
    await TeachingScheduleApi.delete(id);
    if (rows.length === 1 && page > 0) setPage((p) => p - 1);
    else load({});
  };

  /* ---------- DERIVED ---------- */
  const rangeText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    return `Từ ${start} đến ${end} bản ghi`;
  }, [page, size, total]);

  /* ---------- UI ---------- */
  return (
    <div className="container">
      {/* ===== POPUPS ===== */}
      {showForm && (
        <TeachingScheduleForm
          open={showForm}           /* quan trọng: prop điều khiển hiển thị */
          editData={editing}        /* null = thêm mới, !=null = sửa */
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            load({});
          }}
        />
      )}

      {showDetail && (
        <TeachingScheduleDetail
          open={showDetail}
          id={detailId}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="form-card compact">
        <button
          className="add-btn"
          onClick={() => {
            setEditing(null);        /* Thêm mới */
            setShowForm(true);
          }}
        >
          Thêm lịch dạy
        </button>

        <form className="search-container" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </form>
      </div>

      {/* ===== TABLE ===== */}
      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th><th>Giảng viên</th><th>Lớp</th><th>Học phần</th>
            <th>Học kỳ</th><th>Phòng</th><th>Số buổi</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8} style={{ padding:16 }}>Đang tải…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={8} style={{ padding:16 }}>Không có dữ liệu</td></tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id}>
                <td>{page * size + i + 1}</td>
                <td>{r.lecturerName}</td>
                <td>{r.classCode}</td>
                <td>{r.subjectName}</td>
                <td>{r.semester}</td>
                <td>{r.room}</td>
                <td>{r.sessions} buổi</td>
                <td>
                  <div className="actions">
                    <FaInfoCircle
                      className="icon info"
                      onClick={() => {
                        setDetailId(r.id);
                        setShowDetail(true);
                      }}
                    />
                    <FaPen
                      className="icon edit"
                      onClick={() => {
                        setEditing(r);
                        setShowForm(true);
                      }}
                    />
                    <FaTrash
                      className="icon delete"
                      onClick={() => handleDelete(r.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== FOOTER ===== */}
      <div className="footer">
        <div>
          Hiển thị <b>{rows.length}</b> / {total} kết quả
        </div>
        <div className="pagination">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(+e.target.value);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <span>{rangeText}</span>
          <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
            {"<"}
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
