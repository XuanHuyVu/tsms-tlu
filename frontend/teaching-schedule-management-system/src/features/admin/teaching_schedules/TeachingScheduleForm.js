import React, { useEffect, useMemo, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import ClassSectionApi     from "../../../api/ClassSectionApi";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import PreviewSchedule     from "./PreviewSchedule";
import "../../../styles/TeachingScheduleForm.css";

const PERIODS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Tiết ${i + 1}` }));
const TYPES   = ["Lý thuyết", "Thực hành"];
const WEEKDAY_VI = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];

// from, to: "YYYY-MM-DD" | Date | string date-like
const enumerateDates = (from, to, dow) => {
  const res = [];
  let d = new Date(from), end = new Date(to);
  d.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  while (d.getDay() !== dow) d.setDate(d.getDate() + 1);
  while (d <= end) {
    // chỉ lấy DATE (YYYY-MM-DD)
    res.push(d.toISOString().slice(0,10));
    d.setDate(d.getDate() + 7);
  }
  return res;
};

export default function TeachingScheduleForm({ open, onClose, onSuccess, initialData = null }) {
  const [sections, setSections]      = useState([]);
  const [classSectionId, setClsId]   = useState("");
  const [selectedClass, setSelected] = useState(null);
  const [note, setNote]              = useState("");
  const [fromDate, setFrom]          = useState("");
  const [toDate, setTo]              = useState("");
  // items: weekday: number (0-6), periodStart/periodEnd: number, type: string
  const [items, setItems]            = useState([]);
  const [saving, setSaving]          = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        const raw = await ClassSectionApi.getAll();
        let list = Array.isArray(raw) ? raw : (raw?.content ?? []);

        let csObj = null;
        let csId = "";
        let formItems = [];
        let formNote = "";
        let formFrom = "";
        let formTo = "";

        if (initialData?.id) {
          const data = await TeachingScheduleApi.getTeachingScheduleById(initialData.id);
          formNote = data?.note ?? "";

          // Lấy min/max theo DATE (YYYY-MM-DD) — nếu API trả datetime thì cắt phần ngày
          const dates = (data?.details ?? [])
            .map(d => (d?.teachingDate ?? "").slice(0,10))
            .filter(Boolean);
          formFrom = dates.length ? dates.reduce((a,b) => (a < b ? a : b)) : "";
          formTo   = dates.length ? dates.reduce((a,b) => (a > b ? a : b)) : "";

          formItems = [];
          (data?.details ?? []).forEach(d => {
            const dDate = d?.teachingDate;
            if (!dDate) return;
            const obj = {
              weekday    : new Date(dDate).getDay(),                 // number 0-6
              periodStart: Number(d?.periodStart),                   // ép số
              periodEnd  : Number(d?.periodEnd),                     // ép số
              type       : d?.type ?? ""
            };
            // tránh trùng
            if (!formItems.some(w =>
              w.weekday === obj.weekday &&
              w.periodStart === obj.periodStart &&
              w.periodEnd === obj.periodEnd &&
              w.type === obj.type
            )) {
              formItems.push(obj);
            }
          });

          csObj = data.classSection ?? {};
          if (data.classSectionId) csId = data.classSectionId;

          if (!csId && csObj.name) {
            const matched = list.find(s => s.name === csObj.name);
            if (matched) csId = matched.id;
          }
          let matchedSection = list.find(s => String(s.id) === String(csId));
          if (matchedSection) {
            csObj = matchedSection;
          } else if (csObj.name) {
            matchedSection = { ...csObj, id: csId };
            list = [...list, matchedSection];
            csObj = matchedSection;
          }
        }

        if (mounted) {
          setSections(list);
          if (initialData?.id) {
            setClsId(String(csId ?? ""));
            setSelected(csObj ?? null);
            setNote(formNote);
            setFrom(formFrom);
            setTo(formTo);
            setItems(
              formItems.length
                ? formItems
                : [{ weekday: null, periodStart: null, periodEnd: null, type: "" }]
            );
          } else {
            // trạng thái mặc định khi thêm mới
            setItems([{ weekday: null, periodStart: null, periodEnd: null, type: "" }]);
          }
        }
      } catch (e) {
        console.error("[init load]", e);
        if (initialData?.id) alert("Không thể tải dữ liệu chỉnh sửa!");
      }
    })();
    return () => { mounted = false; };
  }, [open, initialData]);

  useEffect(() => {
    if (!classSectionId) return;
    let active = true;
    (async () => {
      try {
        const detail = await ClassSectionApi.getById(classSectionId);
        if (!active) return;
        setSelected(detail);
        setSections(prev =>
          prev.some(s => String(s.id) === String(detail.id))
            ? prev
            : [...prev, detail]
        );
      } catch (e) {
        console.error("[getById]", e);
        setSelected(null);
      }
    })();
    return () => { active = false; };
  }, [classSectionId]);

  const addItem    = () => setItems(p => [...p, { weekday: null, periodStart: null, periodEnd: null, type: "" }]);
  const removeItem = idx => setItems(p => p.filter((_,i)=>i!==idx));
  const changeItem = (idx, field, val) => {
    setItems(p=>{
      const c=[...p];
      c[idx]={...c[idx],[field]:val};
      return c;
    });
  };

  // Preview: tạo danh sách ngày theo tuần, periodStart/End là số, date là YYYY-MM-DD
  const preview = useMemo(() => {
    if (!fromDate || !toDate) return [];
    const arr = [];
    items.forEach(it => {
      const dow = it.weekday;
      if (dow === null || dow === undefined) return;
      enumerateDates(fromDate, toDate, dow).forEach(d => {
        arr.push({
          teachingDate: d,                           // date-only
          periodStart : it.periodStart,              // number
          periodEnd   : it.periodEnd,                // number
          type        : it.type
        });
      });
    });
    return arr.sort((a,b)=>a.teachingDate.localeCompare(b.teachingDate));
  }, [fromDate, toDate, items]);

  const itemsValid = items.length > 0 && items.every(i =>
    Number.isInteger(i?.weekday) &&
    Number.isInteger(i?.periodStart) &&
    Number.isInteger(i?.periodEnd) &&
    i?.periodStart >= 1 &&
    i?.periodEnd >= i?.periodStart &&
    !!i?.type
  );

  const canSave = !!classSectionId && !!fromDate && !!toDate && itemsValid && preview.length > 0;

  const handleSubmit = async e => {
    e.preventDefault(); if (!canSave||saving) return;
    setSaving(true);
    try {
      const body = {
        classSectionId: Number(classSectionId),
        note: note.trim(),
        // details gửi đi: teachingDate (YYYY-MM-DD), periodStart, periodEnd là số
        details: preview.map(d => ({
          teachingDate: d.teachingDate,
          periodStart : Number(d.periodStart),
          periodEnd   : Number(d.periodEnd),
          type        : d.type
        }))
      };
      const result = initialData?.id
        ? await TeachingScheduleApi.update(initialData.id, body)
        : await TeachingScheduleApi.create(body);
      onSuccess?.(result);
      onClose?.();
    } catch (e) {
      console.error("[save]", e);
      alert("Không thể lưu!");
    } finally {
      setSaving(false);
    }
  };

  const ro = {
    faculty : selectedClass?.faculty?.name ?? "",
    dept    : selectedClass?.department?.name ?? "",
    teacher : selectedClass?.teacher?.fullName ?? "",
    subject : selectedClass?.subject?.name ?? "",
    semester: selectedClass?.semester?.academicYear ?? "",
    room    : selectedClass?.room?.name ?? ""
  };

  if (!open) return null;

  return (
    <div className="tsf-overlay" onClick={onClose}>
      <div className="tsf-modal" onClick={e=>e.stopPropagation()}>
        <div className="tsf-header">
          <h3>{initialData?"CHỈNH SỬA":"THÊM"} LỊCH GIẢNG DẠY</h3>
          <button className="tsf-close" onClick={onClose}><FaTimes/></button>
        </div>
        <form className="tsf-body" onSubmit={handleSubmit}>
          <div className="tsf-field">
            <label>Lớp học phần *</label>
            <select value={classSectionId} onChange={e=>setClsId(e.target.value)}>
              <option value="">-- Chọn lớp học phần --</option>
              {sections.map(s=><option key={s.id} value={String(s.id)}>{s.name}</option>)}
            </select>
          </div>

          <div className="tsf-row">
            <div className="tsf-field"><label>Khoa</label><input value={ro.faculty} disabled/></div>
            <div className="tsf-field"><label>Bộ môn</label><input value={ro.dept} disabled/></div>
          </div>
          <div className="tsf-row">
            <div className="tsf-field"><label>Giảng viên</label><input value={ro.teacher} disabled/></div>
            <div className="tsf-field"><label>Học kỳ</label><input value={ro.semester} disabled/></div>
          </div>
          <div className="tsf-row">
            <div className="tsf-field"><label>Môn học</label><input value={ro.subject} disabled/></div>
            <div className="tsf-field"><label>Phòng</label><input value={ro.room} disabled/></div>
          </div>

          <div className="tsf-row">
            <div className="tsf-field">
              <label>Từ ngày *</label>
              <input type="date" value={fromDate} onChange={e=>setFrom(e.target.value)}/>
            </div>
            <div className="tsf-field">
              <label>Đến ngày *</label>
              <input type="date" value={toDate} onChange={e=>setTo(e.target.value)}/>
            </div>
          </div>

          <h4>Thiết lập theo tuần</h4>
          {items.map((it,idx)=>(
            <div className="tsf-row detail-row" key={idx}>
              <select
                value={it.weekday ?? ""}
                onChange={e=>changeItem(idx,"weekday", Number(e.target.value))}
              >
                <option value="">Thứ</option>
                {WEEKDAY_VI.map((w,i)=><option key={i} value={i}>{w}</option>)}
              </select>

              <select
                value={it.periodStart ?? ""}
                onChange={e=>changeItem(idx,"periodStart", Number(e.target.value))}
              >
                <option value="">Tiết bắt đầu</option>
                {PERIODS.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
              </select>

              <select
                value={it.periodEnd ?? ""}
                onChange={e=>changeItem(idx,"periodEnd", Number(e.target.value))}
              >
                <option value="">Tiết kết thúc</option>
                {PERIODS.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
              </select>

              <select
                value={it.type}
                onChange={e=>changeItem(idx,"type",e.target.value)}
              >
                <option value="">Loại</option>
                {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>

              <button type="button" className="btn-delete" onClick={()=>removeItem(idx)}><FaTrash/></button>
            </div>
          ))}
          <button type="button" className="btn-add-detail" onClick={addItem}>+ Thêm thứ/tiết</button>

          <PreviewSchedule details={preview}/>

          <div className="tsf-field">
            <label>Mô tả</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)}/>
          </div>

          <div className="tsf-actions">
            <button type="submit" className="tsf-primary" disabled={!canSave||saving}>
              {saving ? "Đang lưu…" : (initialData ? "Cập nhật" : "Xác nhận")}
            </button>
            <button type="button" className="tsf-outline" disabled={saving} onClick={onClose}>Huỷ bỏ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
