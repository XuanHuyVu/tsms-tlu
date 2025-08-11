import { useEffect, useMemo, useState } from "react";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import { FaSearch, FaInfoCircle, FaPen, FaTrash } from "react-icons/fa";
import "../../../styles/DepartmentList.css";
import TeachingScheduleForm from "./TeachingScheduleForm";
import TeachingScheduleDetail from "./TeachingScheduleDetail";

export default function TeachingScheduleList() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  const reload = async () => {
    console.log("[TSList] reload() start");
    setLoading(true);
    try {
      const res = await TeachingScheduleApi.fetchPage({ page, size, search, sort: "id,asc" });
      console.log("[TSList] fetchPage result =", res);
      setRows(res.content);
      setTotal(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error("[TSList] reload error =", e);
    } finally {
      setLoading(false);
      console.log("[TSList] reload() end");
    }
  };

  useEffect(() => {
    console.log("[TSList] page/size changed =", { page, size });
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const doSearch = (e) => {
    e?.preventDefault?.();
    console.log("[TSList] doSearch =", search);
    setPage(0);
    reload();
  };

  const fromToText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    const t = `Từ ${start} đến ${end} bản ghi`;
    console.log("[TSList] fromToText =", t);
    return t;
  }, [page, size, total]);

  const handleDelete = async (id) => {
    console.log("[TSList] handleDelete id =", id);
    if (!window.confirm("Xóa lịch giảng dạy này?")) return;
    await TeachingScheduleApi.delete(id);
    if (rows.length === 1 && page > 0) setPage((p) => Math.max(0, p - 1));
    else reload();
  };

  return (
    <div className="container">
      {showForm && (
        <TeachingScheduleForm
          open
          editData={editing}
          onClose={() => { console.log("[TSList] close form"); setShowForm(false); }}
          onSuccess={() => { console.log("[TSList] form success"); reload(); setShowForm(false); setEditing(null); }}
        />
      )}

      {showDetail && (
        <TeachingScheduleDetail
          open
          data={selected}
          onClose={() => { console.log("[TSList] close detail"); setShowDetail(false); }}
        />
      )}

      <div className="form-card compact">
        <button className="add-btn" onClick={() => { console.log("[TSList] add"); setEditing(null); setShowForm(true); }}>
          Thêm lịch dạy
        </button>
        <form className="search-container" onSubmit={doSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" onClick={doSearch} />
        </form>
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Giảng viên</th>
            <th>Lớp học phần</th>
            <th>Học phần</th>
            <th>Bộ môn</th>
            <th>Khoa</th>
            <th>Học kỳ</th>
            <th>Phòng</th>
            <th>Số buổi</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr><td colSpan={10} style={{ padding: 16 }}>Đang tải…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={10} style={{ padding: 16 }}>Không có dữ liệu</td></tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={r.id}>
                <td>{page * size + idx + 1}</td>
                <td>{r?.classSection?.teacher?.fullName}</td>
                <td>{r?.classSection?.name}</td>
                <td>{r?.classSection?.subject?.name}</td>
                <td>{r?.classSection?.department?.name}</td>
                <td>{r?.classSection?.faculty?.name}</td>
                <td>{r?.classSection?.semester?.academicYear}</td>
                <td>{r?.classSection?.room?.name}</td>
                <td>{r?.details?.length || 0}</td>
                <td>
                  <div className="actions">
                    <FaInfoCircle className="icon info" title="Chi tiết" onClick={() => { console.log("[TSList] info row =", r); setSelected(r); setShowDetail(true); }} />
                    <FaPen className="icon edit" title="Sửa" onClick={() => { console.log("[TSList] edit row =", r); setEditing(r); setShowForm(true); }} />
                    <FaTrash className="icon delete" title="Xóa" onClick={() => handleDelete(r.id)} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="footer">
        <div>Hiển thị <b>{rows.length}</b> / {total} kết quả</div>
        <div className="pagination">
          <select value={size} onChange={(e) => { console.log("[TSList] change size =", e.target.value); setSize(Number(e.target.value)); }}>
            {[10, 20, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        <span>{fromToText}</span>
          <button disabled={page <= 0} onClick={() => { console.log("[TSList] prev page"); setPage((p) => Math.max(0, p - 1)); }}>{"<"}</button>
          <button disabled={page + 1 >= totalPages} onClick={() => { console.log("[TSList] next page"); setPage((p) => Math.min(totalPages - 1, p + 1)); }}>{">"}</button>
        </div>
      </div>
    </div>
  );
}
