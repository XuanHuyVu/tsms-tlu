import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import ClassSectionApi from "../../../api/ClassSectionApi";
import TeachingScheduleApi from "../../../api/TeachingScheduleApi";
import "../../../styles/TeachingScheduleForm.css";

// ====== constants ======
const PERIODS = Array.from({ length: 12 }, (_, i) => `Tiết ${i + 1}`);
const TYPES = ["Lý thuyết", "Thực hành"];
const EMPTY = {
  classSectionId: "",
  note: "",
  details: [{ teachingDate: "", periodStart: "", periodEnd: "", type: "" }],
};

// ====== small util ======
const pickClassSection = (obj) => (obj?.classSection ? obj.classSection : obj);

// ====== Custom dropdown: only caret opens ======
function CustomSelect({ value, onChangeValue, options, placeholder = "Chọn", disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className={`csf-dropdown ${disabled ? "is-disabled" : ""}`} ref={ref}>
      <div className="csf-dropdown-display">
        <span className={value ? "" : "is-placeholder"}>{value || placeholder}</span>
        <button
          type="button"
          className="csf-dropdown-caret"
          onClick={() => !disabled && setOpen((o) => !o)}
          aria-label="Mở lựa chọn"
        >
          ▾
        </button>
      </div>

      {open && !disabled && (
        <ul className="csf-dropdown-list">
          <li
            className={!value ? "is-selected" : ""}
            onClick={() => {
              onChangeValue("");
              setOpen(false);
            }}
          >
            {placeholder}
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              className={value === opt ? "is-selected" : ""}
              onClick={() => {
                onChangeValue(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TeachingScheduleForm({
  open = true,
  onClose,
  onSuccess,
  editData = null,
}) {
  const [payload, setPayload] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  // ===== load data =====
  useEffect(() => {
    if (!open) return;
    console.log("[TSForm] OPEN", { open, editData });

    (async () => {
      try {
        const list = await ClassSectionApi.getAll();
        const arr = Array.isArray(list) ? list : list?.content || [];
        setClassSections(arr);
        console.log("[TSForm] ClassSectionApi.getAll ->", arr);

        if (editData) {
          const cs = pickClassSection(editData);
          const id = String(cs?.id ?? editData.classSectionId ?? "");
          setPayload({
            classSectionId: id,
            note: editData.note || "",
            details:
              editData.details?.length
                ? editData.details.map((d) => ({
                    teachingDate: d.teachingDate || d.date || "",
                    periodStart: d.periodStart || d.lessonStart || "",
                    periodEnd: d.periodEnd || d.lessonEnd || "",
                    type: d.type || d.scheduleTypeName || "",
                  }))
                : [{ teachingDate: "", periodStart: "", periodEnd: "", type: "" }],
          });

          if (cs?.department?.name) setSelectedClass(cs);
          else if (id) {
            console.log("[TSForm] edit -> fetch class-section detail id =", id);
            setInfoLoading(true);
            try {
              const detail = await ClassSectionApi.getById(id);
              console.log("[TSForm] detail =", detail);
              setSelectedClass(detail);
            } finally {
              setInfoLoading(false);
            }
          }
        } else {
          setPayload(EMPTY);
          setSelectedClass(null);
        }
      } catch (err) {
        console.error("[TSForm] Load error =", err);
      }
    })();
  }, [open, editData]);

  // ===== handlers =====
  const onChange = (field) => async (e) => {
    const value = e.target.value;
    console.log("[TSForm] onChange", field, value);
    setPayload((p) => ({ ...p, [field]: value }));

    if (field === "classSectionId") {
      setSelectedClass(null);
      if (!value) return;
      try {
        setInfoLoading(true);
        console.log("[TSForm] fetch class-section detail id =", value);
        const detail = await ClassSectionApi.getById(value);
        console.log("[TSForm] detail =", detail);
        setSelectedClass(detail);
      } catch (err) {
        console.error("[TSForm] fetch detail error =", err);
      } finally {
        setInfoLoading(false);
      }
    }
  };

  const onDetailChangeValue = (idx, field, value) => {
    console.log("[TSForm] detail change", { idx, field, value });
    setPayload((p) => {
      const details = [...p.details];
      details[idx] = { ...details[idx], [field]: value };
      return { ...p, details };
    });
  };

  const onDetailInput = (idx, field) => (e) =>
    onDetailChangeValue(idx, field, e.target.value);

  const addDetail = () => {
    console.log("[TSForm] addDetail");
    setPayload((p) => ({
      ...p,
      details: [
        ...p.details,
        { teachingDate: "", periodStart: "", periodEnd: "", type: "" },
      ],
    }));
  };

  const removeDetail = (idx) => {
    console.log("[TSForm] removeDetail", idx);
    setPayload((p) => ({
      ...p,
      details: p.details.filter((_, i) => i !== idx),
    }));
  };

  // ===== validate & submit =====
  const requiredOk =
    payload.classSectionId &&
    payload.details.length > 0 &&
    payload.details.every(
      (d) => d.teachingDate && d.periodStart && d.periodEnd && d.type
    );

  const submit = async (e) => {
    e.preventDefault();
    console.log("[TSForm] SUBMIT payload =", payload, "requiredOk =", requiredOk);
    if (!requiredOk || saving) return;

    const body = {
      classSectionId: Number(payload.classSectionId),
      note: payload.note?.trim() || "",
      details: payload.details.map(({ teachingDate, periodStart, periodEnd, type }) => ({
        teachingDate,
        periodStart,
        periodEnd,
        type,
      })),
    };

    setSaving(true);
    try {
      const saved = editData?.id
        ? await TeachingScheduleApi.update(editData.id, body)
        : await TeachingScheduleApi.create(body);
      console.log("[TSForm] save OK =", saved);
      onSuccess?.(saved);
      onClose?.();
    } catch (err) {
      console.error("[TSForm] save error =", err);
      alert("Không thể lưu lịch giảng dạy!");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  // ===== derived display =====
  const teacherName = selectedClass?.teacher?.fullName || "";
  const subjectName = selectedClass?.subject?.name || "";
  const deptName = selectedClass?.department?.name || "";
  const facultyName = selectedClass?.faculty?.name || "";
  const semesterText = selectedClass?.semester?.academicYear || "";
  const roomName = selectedClass?.room?.name || "";

  // ===== view =====
  return (
    <div
      className="csf-overlay"
      onClick={() => {
        console.log("[TSForm] overlay -> close");
        onClose?.();
      }}
    >
      <div className="csf-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header (fixed) */}
        <div className="csf-header">
          <h3>{editData ? "SỬA LỊCH GIẢNG DẠY" : "THÊM LỊCH GIẢNG DẠY MỚI"}</h3>
          <button
            className="csf-close"
            type="button"
            onClick={() => {
              console.log("[TSForm] click close");
              onClose?.();
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body (scrollable) */}
        <form className="csf-body" onSubmit={submit}>
          {/* Lớp học phần */}
          <div className="csf-field">
            <label>
              Lớp học phần <span className="csf-required">*</span>
            </label>
            <div className="csf-select-wrap">
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
              <span className="csf-caret">▾</span>
            </div>
          </div>

          {/* readonly info */}
          <div className="csf-row">
            <div className="csf-field">
              <label>Khoa phụ trách: <span className="csf-required">*</span></label>
              <input disabled value={infoLoading ? "Đang tải..." : facultyName} />
            </div>
            <div className="csf-field">
              <label>Bộ môn: <span className="csf-required">*</span></label>
              <input disabled value={infoLoading ? "Đang tải..." : deptName} />
            </div>
          </div>

          <div className="csf-row">
            <div className="csf-field">
              <label>Giảng viên phụ trách: <span className="csf-required">*</span></label>
              <input disabled value={infoLoading ? "Đang tải..." : teacherName} />
            </div>
            <div className="csf-field">
              <label>Học kỳ: <span className="csf-required">*</span></label>
              <input disabled value={infoLoading ? "Đang tải..." : semesterText} />
            </div>
          </div>

          <div className="csf-row">
            <div className="csf-field">
              <label>Môn học: <span className="csf-required">*</span></label>
              <input disabled value={infoLoading ? "Đang tải..." : subjectName} />
            </div>
            <div className="csf-field">
              <label>Phòng: <span className="csf-required">*</span></label>
              <input disabled value={infoLoading ? "Đang tải..." : roomName} />
            </div>
          </div>

          <div className="csf-divider" />

          {/* note */}
          <div className="csf-field">
            <label>Mô tả:</label>
            <textarea
              value={payload.note}
              onChange={(e) => setPayload((p) => ({ ...p, note: e.target.value }))}
              placeholder="Nhập mô tả"
            />
          </div>

          <div className="csf-divider" />

          {/* section header */}
          <div className="csf-section-header">
            <h4 className="csf-section-title">Chi tiết lịch học</h4>
            <button type="button" className="csf-add-detail" onClick={addDetail}>
              + Thêm buổi học
            </button>
          </div>

          {/* detail rows */}
          {payload.details.map((d, idx) => (
            <div className="csf-detail-row" key={idx}>
              <input
                type="date"
                className="csf-control csf-date"
                value={d.teachingDate}
                onChange={onDetailInput(idx, "teachingDate")}
                placeholder="mm/dd/yyyy"
              />

              <CustomSelect
                value={d.periodStart}
                onChangeValue={(val) => onDetailChangeValue(idx, "periodStart", val)}
                options={PERIODS}
                placeholder="Tiết bắt đầu"
              />

              <CustomSelect
                value={d.periodEnd}
                onChangeValue={(val) => onDetailChangeValue(idx, "periodEnd", val)}
                options={PERIODS}
                placeholder="Tiết kết thúc"
              />

              <CustomSelect
                value={d.type}
                onChangeValue={(val) => onDetailChangeValue(idx, "type", val)}
                options={TYPES}
                placeholder="Loại"
              />

              <button
                type="button"
                className="csf-icon-btn csf-icon-btn--danger"
                onClick={() => removeDetail(idx)}
                title="Xoá buổi"
                aria-label="Xoá buổi"
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {/* actions */}
          <div className="csf-actions">
            <button type="submit" className="csf-primary" disabled={!requiredOk || saving}>
              {saving ? "Đang lưu..." : "Xác nhận"}
            </button>
            <button
              type="button"
              className="csf-outline"
              onClick={() => {
                console.log("[TSForm] cancel");
                onClose?.();
              }}
              disabled={saving}
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
