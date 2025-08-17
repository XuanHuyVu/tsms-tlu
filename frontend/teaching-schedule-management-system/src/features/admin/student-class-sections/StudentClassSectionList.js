import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaInfoCircle, FaPen, FaTrash } from "react-icons/fa";
import StudentClassSectionApi from "../../../api/StudentClassSectionApi";
import "../../../styles/DepartmentList.css"; // tái dùng style bảng có sẵn

// (Tuỳ chọn) Nếu bạn đã/ sẽ có 2 component này tương tự TeachingSchedule* thì import:
// import StudentClassSectionForm from "./StudentClassSectionForm";
// import StudentClassSectionDetail from "./StudentClassSectionDetail";
// import DeleteConfirmModal from "../../../components/DeleteConfirmModal";

export default function StudentClassSectionList({ defaultStudentId }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // popup/form/detail tuỳ chọn
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(null);

  // delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = async (signal) => {
    setLoading(true);
    try {
      const res = await StudentClassSectionApi.fetchPage({
        page,
        size,
        search: search.trim(),
        sort: "id,asc",
        studentId: defaultStudentId,
      });
      if (signal?.aborted) return;
      setRows(res?.content || []);
      setTotal(res?.totalElements || 0);
      setTotalPages(res?.totalPages || 0);
    } catch (err) {
      if (!signal?.aborted) {
        console.error("[SCS-List] load error", err);
        setRows([]);
        setTotal(0);
        setTotalPages(0);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, search, defaultStudentId]);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    setPage(0);
  };

  const promptDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setShowDelete(false);
    try {
      await StudentClassSectionApi.delete(deleteId);
      if (rows.length === 1 && page > 0) setPage((p) => p - 1);
      else load({});
    } catch (err) {
      console.error("[SCS-List] delete error", err);
    }
  };

  const rangeText = useMemo(() => {
    const start = total === 0 ? 0 : page * size + 1;
    const end = Math.min(total, (page + 1) * size);
    return `Từ ${start} đến ${end} bản ghi`;
  }, [page, size, total]);

  return (
    <div className="container">
      {/* POPUPS (tuỳ chọn) */}
      {showForm && (
        // <StudentClassSectionForm
        //   open={showForm}
        //   initialData={editing}
        //   onClose={() => setShowForm(false)}
        //   onSuccess={() => { setShowForm(false); load({}); }}
        // />
        <></>
      )}

      {showDetail && (
        // <StudentClassSectionDetail
        //   open={showDetail}
        //   id={detailId}
        //   onClose={() => setShowDetail(false)}
        // />
        <></>
      )}

      {/* Delete confirmation (nếu có sẵn component) */}
      {/*
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="XÓA ĐĂNG KÝ LỚP HỌC PHẦN"
        message="Bạn có chắc chắn muốn xóa đăng ký này không?"
      />
      */}

      {/* TOOLBAR */}
      <div className="form-card compact">
        <button
          className="add-btn"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Thêm đăng ký
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

      {/* TABLE */}
      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Sinh viên</th>
            <th>Lớp</th>
            <th>Học phần</th>
            <th>Học kỳ</th>
            <th>Nhóm TH</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ padding: 16 }}>Đang tải…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: 16 }}>Không có dữ liệu</td></tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id}>
                <td>{page * size + i + 1}</td>
                <td>{r.studentName || r.studentCode}</td>
                <td>{r.classCode}</td>
                <td>{r.subjectName}</td>
                <td>{r.semester}</td>
                <td>{r.practiseGroup}</td>
                <td>
                  <div className="actions">
                    <FaInfoCircle
                      className="icon info"
                      onClick={() => { setDetailId(r.id); setShowDetail(true); }}
                      title="Chi tiết"
                    />
                    <FaPen
                      className="icon edit"
                      onClick={() => { setEditing(r); setShowForm(true); }}
                      title="Sửa"
                    />
                    <FaTrash
                      className="icon delete"
                      onClick={() => promptDelete(r.id)}
                      title="Xoá"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="footer">
        <div>
          Hiển thị <b>{rows.length}</b> / {total} kết quả
        </div>
        <div className="pagination">
          <select
            value={size}
            onChange={(e) => { setPage(0); setSize(+e.target.value); }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <span>{rangeText}</span>
          <button disabled={page <= 0} onClick={() => setPage(page - 1)}>{"<"}</button>
          <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>{">"}</button>
        </div>
      </div>
    </div>
  );
}