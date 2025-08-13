/*  TeachingScheduleForm.jsx  */
import React, { useEffect, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import ClassSectionApi from "../../../api/ClassSectionApi";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import "../../../styles/TeachingScheduleForm.css";

/* ---------- hằng số ---------- */
const PERIODS = Array.from({ length: 12 }, (_, i) => `Tiết ${i + 1}`);
const TYPES = ["Lý thuyết", "Thực hành"];
const EMPTY   = { classSectionId: "", note: "", details: [] };

/* ---------- helper ---------- */
const addDays = (isoStr, n) => {
  const d = new Date(isoStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);          // YYYY-MM-DD
};
const weekDayVi = (isoStr) => {
  if (!isoStr) return "";
  const day = new Date(isoStr).getDay();        // 0‑6
  return ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"][day];
};

export default function TeachingScheduleForm({
  open = true,
  onClose,
  onSuccess,
  editData = null,
}) {
  /* ---------- state ---------- */
  const [payload, setPayload] = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  /* ---------- load lớp học phần + editData ---------- */
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await ClassSectionApi.getAll();
        setClassSections(Array.isArray(res) ? res : res?.content ?? []);

        if (editData) {
          const cs = editData.classSection ?? editData;
          setPayload({
            classSectionId: String(cs.id),
            note: editData.note || "",
            details: editData.details.map((d) => ({
              teachingDate: d.teachingDate,
              periodStart: d.periodStart,
              periodEnd: d.periodEnd,
              type: d.type,
              repeat: false,
              repeatCount: 1,
            })),
          });
          setSelectedClass(cs);
        } else {
          setPayload(EMPTY);
          setSelectedClass(null);
        }
      } catch (e) {
        console.error("[TSForm] init error", e);
      }
    })();
  }, [open, editData]);

  /* ---------- common change ---------- */
  const onChange = (k) => (e) => {
    const v = e.target.value;
    setPayload((p) => ({ ...p, [k]: v }));
    if (k === "classSectionId") {
      const found = (classSections || []).find((x) => String(x.id) === v);
      setSelectedClass(found ?? null);
    }
  };

  /* ---------- detail change ---------- */
  const changeDetail = (idx, field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setPayload((p) => {
      const details = [...p.details];
      details[idx] = { ...details[idx], [field]: value };
      return { ...p, details };
    });
  };

  const addDetail = () =>
    setPayload((p) => ({
      ...p,
      details: [
        ...p.details,
        {
          teachingDate: "",
          periodStart: "",
          periodEnd: "",
          type: "",
          repeat: false,
          repeatCount: 1,
        },
      ],
    }));

  const removeDetail = (idx) =>
    setPayload((p) => ({
      ...p,
      details: p.details.filter((_, i) => i !== idx),
    }));

  /* ---------- submit ---------- */
  const requiredOk =
    payload.classSectionId &&
    payload.details.length &&
    payload.details.every(
      (d) => d.teachingDate && d.periodStart && d.periodEnd && d.type
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requiredOk || saving) return;

    /* xây detailList với repeat */
    const detailList = [];
    payload.details.forEach((d) => {
      const weeks = d.repeat ? Math.max(1, Number(d.repeatCount) || 1) : 1;
      for (let i = 0; i < weeks; i++) {
        detailList.push({
          teachingDate: addDays(d.teachingDate, 7 * i),
          periodStart: d.periodStart,
          periodEnd:   d.periodEnd,
          type: d.type,
        });
      }
    });

    const body = {
      classSectionId: Number(payload.classSectionId),
      note: payload.note.trim(),
      details: detailList,
    };

    setSaving(true);
    try {
      let saved;
      if (editData?.id) {
        saved = await TeachingScheduleApi.update(editData.id, body);
      } else {
        saved = await TeachingScheduleApi.create(body);
      }
      onSuccess?.(saved);
      onClose?.();
    } catch (err) {
      console.error("[TSForm] save error", err);
      alert("Không thể lưu lịch giảng dạy!");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- render ---------- */
  if (!open) return null;

  const readonly = {
    teacher:
      selectedClass?.teacher?.fullName ?? selectedClass?.lecturerName ?? "",
    subject:
      selectedClass?.subject?.name ?? selectedClass?.subjectName ?? "",
    dept:
      selectedClass?.department?.name ?? selectedClass?.departmentName ?? "",
    faculty:
      selectedClass?.faculty?.name ?? selectedClass?.facultyName ?? "",
    semester:
      selectedClass?.semester?.academicYear ?? selectedClass?.semester ?? "",
    room:
      selectedClass?.room?.name ?? selectedClass?.room ?? "",
  };

  return (
    <div
      className="tsf-overlay"
      onClick={() => onClose?.()}
    >
      <div className="tsf-modal" onClick={(e) => e.stopPropagation()}>
        {/* ===== Header ===== */}
        <div className="tsf-header">
          <h3>{editData ? "SỬA LỊCH GIẢNG DẠY" : "THÊM LỊCH GIẢNG DẠY MỚI"}</h3>
          <button className="tsf-close" onClick={() => onClose?.()}>
            <FaTimes />
          </button>
        </div>

        {/* ===== Body ===== */}
        <form className="tsf-body" onSubmit={handleSubmit}>
          {/* Lớp học phần */}
          <div className="tsf-field">
            <label>Lớp học phần *</label>
            <select
              value={payload.classSectionId}
              onChange={onChange("classSectionId")}
            >
              <option value="">-- Chọn học phần --</option>
              {classSections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thông tin readonly */}
          <div className="tsf-row">
            <div className="tsf-field">
              <label>Khoa *</label>
              <input value={readonly.faculty} disabled />
            </div>
            <div className="tsf-field">
              <label>Bộ môn *</label>
              <input value={readonly.dept} disabled />
            </div>
          </div>
          <div className="tsf-row">
            <div className="tsf-field">
              <label>Giảng viên *</label>
              <input value={readonly.teacher} disabled />
            </div>
            <div className="tsf-field">
              <label>Học kỳ *</label>
              <input value={readonly.semester} disabled />
            </div>
          </div>
          <div className="tsf-row">
            <div className="tsf-field">
              <label>Môn học *</label>
              <input value={readonly.subject} disabled />
            </div>
            <div className="tsf-field">
              <label>Phòng *</label>
              <input value={readonly.room} disabled />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="tsf-field">
            <label>Mô tả</label>
            <textarea
              value={payload.note}
              onChange={onChange("note")}
              placeholder="Nhập mô tả"
            />
          </div>

          {/* ===== Chi tiết ===== */}
          <h4>Chi tiết lịch học</h4>
          {payload.details.map((d, idx) => (
            <div className="tsf-row detail-row" key={idx}>
              {/* Ngày */}
              <input
                type="date"
                value={d.teachingDate}
                onChange={changeDetail(idx, "teachingDate")}
              />
              {/* hiển thị thứ */}
              <span style={{ minWidth: 72, textAlign: "center" }}>
                {weekDayVi(d.teachingDate)}
              </span>

              {/* Tiết */}
              <select
                value={d.periodStart}
                onChange={changeDetail(idx, "periodStart")}
              >
                <option value="">Tiết bắt đầu</option>
                {PERIODS.map((p) => (
                  <option key={`ps-${p}`} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={d.periodEnd}
                onChange={changeDetail(idx, "periodEnd")}
              >
                <option value="">Tiết kết thúc</option>
                {PERIODS.map((p) => (
                  <option key={`pe-${p}`} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Loại */}
              <select value={d.type} onChange={changeDetail(idx, "type")}>
                <option value="">Loại</option>
                {TYPES.map((t) => (
                  <option key={`t-${t}`}>{t}</option>
                ))}
              </select>

              {/* Lặp lại? */}
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="checkbox"
                  checked={d.repeat}
                  onChange={changeDetail(idx, "repeat")}
                />
                Lặp lại
              </label>
              {d.repeat && (
                <input
                  type="number"
                  min={1}
                  style={{ width: 60 }}
                  value={d.repeatCount}
                  onChange={changeDetail(idx, "repeatCount")}
                  title="Số tuần"
                />
              )}

              {/* Xóa */}
              <button
                type="button"
                className="btn-delete"
                onClick={() => removeDetail(idx)}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn-add-detail"
            onClick={addDetail}
          >
            + Thêm buổi học
          </button>

          {/* ===== Actions ===== */}
          <div className="tsf-actions">
            <button
              type="submit"
              className="tsf-primary"
              disabled={!requiredOk || saving}
            >
              {saving ? "Đang lưu…" : "Xác nhận"}
            </button>
            <button
              type="button"
              className="tsf-outline"
              onClick={() => onClose?.()}
              disabled={saving}
            >
              Huỷ bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
