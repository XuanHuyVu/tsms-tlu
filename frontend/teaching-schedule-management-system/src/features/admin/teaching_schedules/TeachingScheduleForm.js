import React, { useEffect, useMemo, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import ClassSectionApi from "../../../api/ClassSectionApi";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import PreviewSchedule from "./PreviewSchedule";
import "../../../styles/TeachingScheduleForm.css";

const PERIODS = Array.from({ length: 12 }, (_, i) => `Tiết ${i + 1}`);
const TYPES = ["Lý thuyết", "Thực hành"];
const WEEKDAY_VI = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const enumerateDates = (from, to, dow) => {
  const out = [];
  let cur = new Date(from);
  const end = new Date(to);
  cur.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  while (cur.getDay() !== dow) cur.setDate(cur.getDate() + 1);
  while (cur <= end) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 7);
  }
  return out;
};

export default function TeachingScheduleForm({ open, onClose, onSuccess }) {
  const [sections, setSections] = useState([]);
  const [classSectionId, setClassSectionId] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [note, setNote] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const data = await ClassSectionApi.getAll();
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setSections(list);
      } catch (e) {
        console.error("[ClassSectionApi]", e);
      }
    })();
  }, [open]);

  // 🔁 Lấy chi tiết lớp học phần bằng getById
  useEffect(() => {
    if (!classSectionId) return;
    (async () => {
      try {
        const detail = await ClassSectionApi.getById(classSectionId);
        setSelectedClass(detail);
      } catch (e) {
        console.error("[getById]", e);
        setSelectedClass(null);
      }
    })();
  }, [classSectionId]);

  const addItem = () =>
    setItems((prev) => [...prev, { weekday: "", periodStart: "", periodEnd: "", type: "" }]);

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const changeItem = (idx, field, value) =>
    setItems((prev) => {
      const cp = [...prev];
      cp[idx] = { ...cp[idx], [field]: value };
      return cp;
    });

  const preview = useMemo(() => {
    if (!fromDate || !toDate) return [];
    const list = [];
    items.forEach((it) => {
      const dow = Number(it.weekday);
      if (isNaN(dow)) return;
      const days = enumerateDates(fromDate, toDate, dow);
      days.forEach((d) =>
        list.push({
          teachingDate: d,
          periodStart: it.periodStart,
          periodEnd: it.periodEnd,
          type: it.type,
        })
      );
    });
    return list.sort((a, b) => a.teachingDate.localeCompare(b.teachingDate));
  }, [fromDate, toDate, items]);

  const canSave =
    classSectionId &&
    fromDate &&
    toDate &&
    items.length &&
    items.every((i) => i.weekday && i.periodStart && i.periodEnd && i.type) &&
    preview.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const body = {
        classSectionId: Number(classSectionId),
        note: note.trim(),
        details: preview,
      };
      const saved = await TeachingScheduleApi.create(body);
      onSuccess?.(saved);
      onClose?.();
    } catch (err) {
      console.error("[save]", err);
      alert("Không thể lưu lịch!");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const ro = {
    faculty: selectedClass?.faculty?.name ?? "",
    dept: selectedClass?.department?.name ?? "",
    teacher: selectedClass?.teacher?.fullName ?? "",
    subject: selectedClass?.subject?.name ?? "",
    semester: selectedClass?.semester?.academicYear ?? "",
    room: selectedClass?.room?.name ?? "",
  };

  return (
    <div className="tsf-overlay" onClick={onClose}>
      <div className="tsf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tsf-header">
          <h3>THÊM LỊCH GIẢNG DẠY</h3>
          <button className="tsf-close" onClick={onClose}><FaTimes /></button>
        </div>

        <form className="tsf-body" onSubmit={handleSubmit}>
          <div className="tsf-field">
            <label>Lớp học phần *</label>
            <select value={classSectionId} onChange={(e) => setClassSectionId(e.target.value)}>
              <option value="">-- Chọn --</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="tsf-row">
            <div className="tsf-field"><label>Khoa</label><input value={ro.faculty} disabled /></div>
            <div className="tsf-field"><label>Bộ môn</label><input value={ro.dept} disabled /></div>
          </div>
          <div className="tsf-row">
            <div className="tsf-field"><label>Giảng viên</label><input value={ro.teacher} disabled /></div>
            <div className="tsf-field"><label>Học kỳ</label><input value={ro.semester} disabled /></div>
          </div>
          <div className="tsf-row">
            <div className="tsf-field"><label>Môn học</label><input value={ro.subject} disabled /></div>
            <div className="tsf-field"><label>Phòng</label><input value={ro.room} disabled /></div>
          </div>

          <div className="tsf-row">
            <div className="tsf-field"><label>Từ ngày *</label><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
            <div className="tsf-field"><label>Đến ngày *</label><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          </div>

          <h4>Thiết lập theo tuần</h4>
          {items.map((it, idx) => (
            <div className="tsf-row detail-row" key={idx}>
              <select value={it.weekday} onChange={(e) => changeItem(idx, "weekday", e.target.value)}>
                <option value="">Thứ</option>
                {WEEKDAY_VI.map((w, i) => <option key={i} value={i}>{w}</option>)}
              </select>
              <select value={it.periodStart} onChange={(e) => changeItem(idx, "periodStart", e.target.value)}>
                <option value="">Tiết bắt đầu</option>
                {PERIODS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <select value={it.periodEnd} onChange={(e) => changeItem(idx, "periodEnd", e.target.value)}>
                <option value="">Tiết kết thúc</option>
                {PERIODS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <select value={it.type} onChange={(e) => changeItem(idx, "type", e.target.value)}>
                <option value="">Loại</option>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button type="button" className="btn-delete" onClick={() => removeItem(idx)}><FaTrash /></button>
            </div>
          ))}

          <button type="button" className="btn-add-detail" onClick={addItem}>+ Thêm thứ/tiết</button>

          <PreviewSchedule details={preview} />

          <div className="tsf-field">
            <label>Mô tả</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="tsf-actions">
            <button type="submit" className="tsf-primary" disabled={!canSave || saving}>
              {saving ? "Đang lưu..." : "Xác nhận"}
            </button>
            <button type="button" className="tsf-outline" onClick={onClose} disabled={saving}>
              Huỷ bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
