import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import StudentClassSectionApi from "../../../api/StudentClassSectionApi";
import "../../../styles/StudentClassSectionDetail.css";

function mapAssignmentToRow(raw) {
  const st = raw?.student || {};
  return {
    studentId: st?.id ?? raw?.studentId,
    code: st?.studentCode ?? st?.code ?? raw?.studentCode ?? raw?.code ?? "",
    fullName: st?.fullName ?? raw?.fullName ?? "",
    className:
      raw?.className ??
      st?.className ??
      st?.classGroup ??
      st?.classCode ??
      "",
  };
}

async function resolveIdByName(name) {
  if (!name) return null;
  try {
    const { data } = await axiosInstance.get("/admin/class-sections", {
      params: { search: name },
    });
    const list = Array.isArray(data) ? data : data?.content || [];
    // Ưu tiên trùng tên tuyệt đối
    const exact = list.find((x) => x.name === name);
    if (exact?.id) return exact.id;
    return list[0]?.id ?? null;
  } catch {
    return null;
  }
}

export default function StudentClassSectionDetail({
  open,
  classSectionId,
  classSectionName,   // fallback nếu không có id
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      setError("");
      setLoading(true);
      try {
        // 1) Có id -> dùng luôn; không có thì resolve từ name
        let id = classSectionId || null;
        if (!id) id = await resolveIdByName(classSectionName || "");

        if (!id) {
          if (!cancelled) {
            setSection({ name: classSectionName || "" });
            setStudents([]);
            setError("Không xác định được lớp học phần.");
          }
          return;
        }

        // 2) Chi tiết lớp học phần
        const { data: cs } = await axiosInstance.get(`/admin/class-sections/${id}`);
        if (!cancelled) setSection(cs);

        // 3) Danh sách SV đã đăng ký
        const page = await StudentClassSectionApi.fetchPage({
          page: 0,
          size: 1000,
          classSectionId: id,
        });
        const items = Array.isArray(page) ? page : page?.content || [];
        const rows = items.map(mapAssignmentToRow).filter((r) => r.code);
        if (!cancelled) setStudents(rows);
      } catch (e) {
        if (!cancelled) {
          setError("Không thể tải dữ liệu chi tiết.");
          setSection(null);
          setStudents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, classSectionId, classSectionName]);

  const info = useMemo(() => {
    const cs = section || {};
    return {
      teacher: cs.teacher?.fullName || cs.teacherName || "",
      classSection: cs.name || classSectionName || "",
      subject: cs.subject?.name || cs.subjectName || "",
      semester: cs.semester?.name || cs.semester?.term || cs.semester?.academicYear || "",
      room: cs.room?.name || cs.roomName || "",
      faculty: cs.faculty?.name || cs.subject?.faculty?.name || "",
    };
  }, [section, classSectionName]);

  if (!open) return null;

  return (
    <div className="scsd-backdrop" role="dialog" aria-modal="true" aria-label="Chi tiết lớp học phần">
      <div className="scsd-modal">
        <div className="scsd-header">
          <div>CHI TIẾT LỊCH GIẢNG DẠY</div>
          <button className="scsd-close" onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className="scsd-body">
          {error && (
            <div style={{marginBottom:12, color:"#b91c1c", fontWeight:600}}>{error}</div>
          )}

          <div className="scsd-grid">
            <div>
              <label className="scsd-label">Giảng viên:</label>
              <input className="scsd-input" value={info.teacher} readOnly />
            </div>
            <div>
              <label className="scsd-label">Lớp học phần:</label>
              <input className="scsd-input" value={info.classSection} readOnly />
            </div>
            <div>
              <label className="scsd-label">Học phần:</label>
              <input className="scsd-input" value={info.subject} readOnly />
            </div>
            <div>
              <label className="scsd-label">Học kỳ:</label>
              <input className="scsd-input" value={info.semester} readOnly />
            </div>
            <div>
              <label className="scsd-label">Phòng:</label>
              <input className="scsd-input" value={info.room} readOnly />
            </div>
            <div>
              <label className="scsd-label">Số sinh viên:</label>
              <input className="scsd-input" value={students.length} readOnly />
            </div>
          </div>

          <div className="scsd-subtitle">Chi tiết sinh viên</div>
          <div className="scsd-table-wrap">
            <table className="scsd-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã sinh viên</th>
                  <th>Họ tên SV</th>
                  <th>Lớp</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{padding:12}}>Đang tải…</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={4} style={{padding:12}}>Chưa có sinh viên nào</td></tr>
                ) : (
                  students.map((s, i) => (
                    <tr key={s.code}>
                      <td>{i + 1}</td>
                      <td>{s.code}</td>
                      <td>{s.fullName}</td>
                      <td>{s.className}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="scsd-actions">
            <button className="scsd-btn ghost" onClick={onClose}>Quay lại</button>
          </div>
        </div>
      </div>
    </div>
  );
}
