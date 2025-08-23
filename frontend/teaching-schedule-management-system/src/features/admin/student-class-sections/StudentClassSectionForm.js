// src/features/admin/student-class-sections/StudentClassSectionForm.js
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import axiosInstance from "../../../api/axiosInstance";
import StudentClassSectionApi from "../../../api/StudentClassSectionApi";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../styles/StudentClassSectionForm.css";
import AppToast from "../../../components/AppToast";

/* -------------------- helpers -------------------- */
async function loadClassSections(search = "") {
  const { data } = await axiosInstance.get("/admin/class-sections", {
    params: { search: search?.trim() || undefined },
  });
  return Array.isArray(data) ? data : data?.content || [];
}
async function loadClassSectionDetail(id) {
  const { data } = await axiosInstance.get(`/admin/class-sections/${id}`);
  return data;
}
async function loadStudents(search = "") {
  const { data } = await axiosInstance.get("/admin/students", {
    params: { search: search?.trim() || undefined },
  });
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.map((s) => ({
    id: s.id ?? s.studentId,
    code: s.code ?? s.studentCode,
    fullName: s.fullName ?? s.name,
    className: s.className ?? s.classGroup ?? s.classCode ?? "",
  }));
}
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

export default function StudentClassSectionForm({
  open,
  // null hoặc {_mode:'edit', studentId?, classSectionId?, name?} hoặc {id|classSectionId|sectionId, name?}
  initialSection = null,
  onClose,
  onSuccess,
}) {
  const toastRef = useRef(null);
  const fileRef = useRef(null);
  const { ready, isLoggedIn } = useAuth();

  // Chuẩn hóa tham số edit
  const editSectionId = useMemo(
    () =>
      initialSection?.classSectionId ??
      initialSection?.id ??
      initialSection?.sectionId ??
      null,
    [initialSection]
  );
  const editStudentId = initialSection?.studentId ?? null;
  const isEdit = Boolean(editSectionId || editStudentId || initialSection?.name);
  const isEditByPair = Boolean(editSectionId && editStudentId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // LHP
  const [sectionKeyword, setSectionKeyword] = useState(initialSection?.name || "");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(
    editSectionId ? { id: editSectionId, name: initialSection?.name } : null
  );
  const [secOpen, setSecOpen] = useState(false);
  const secBoxRef = useRef(null);

  // SV & chọn
  const [studentKeyword, setStudentKeyword] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudentCode, setSelectedStudentCode] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [existingCodes, setExistingCodes] = useState(new Set());

  // combobox MSV
  const [msvOpen, setMsvOpen] = useState(false);
  const msvBoxRef = useRef(null);
  const msvInputRef = useRef(null);

  /* -------------------- init -------------------- */
  useEffect(() => {
    if (!ready || !isLoggedIn || !open) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [sec, stds] = await Promise.all([
          loadClassSections(""),
          loadStudents(""),
        ]);
        if (cancelled) return;
        setSections(sec);
        setStudents(stds);

        // Lấy chi tiết LHP để hiện thông tin
        if (editSectionId) {
          try {
            const detail = await loadClassSectionDetail(editSectionId);
            if (!cancelled) {
              setSelectedSection(detail);
              setSectionKeyword(detail?.name || initialSection?.name || "");
            }
          } catch {
            const fallback =
              sec.find((s) => String(s.id) === String(editSectionId)) || null;
            setSelectedSection(fallback);
            setSectionKeyword(fallback?.name || initialSection?.name || "");
          }
        }

        // Nếu edit theo cặp {studentId}/{classSectionId} -> load đúng 1 sinh viên
        if (isEditByPair) {
          try {
            const pair = await StudentClassSectionApi.getByPair(
              editStudentId,
              editSectionId
            );
            const row = mapAssignmentToRow(pair);
            if (row?.code) {
              setSelectedList([row]);
              setExistingCodes(new Set([row.code]));
              // hợp nhất vào kho students để dropdown thấy được
              setStudents((prev) => {
                const byCode = new Map(prev.map((x) => [String(x.code).trim(), x]));
                const key = String(row.code).trim();
                if (!byCode.has(key)) {
                  byCode.set(key, {
                    id: row.studentId,
                    code: row.code,
                    fullName: row.fullName,
                    className: row.className,
                  });
                }
                return Array.from(byCode.values());
              });
              setSelectedStudentCode(String(row.code));
            } else {
              setSelectedList([]);
              setExistingCodes(new Set());
            }
          } catch {
            setSelectedList([]);
            setExistingCodes(new Set());
          }
        } else {
          setSelectedList([]);
          setExistingCodes(new Set());
        }
      } catch {
        if (!cancelled) toastRef.current?.error("Không thể tải dữ liệu ban đầu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    ready,
    isLoggedIn,
    isEditByPair,
    editSectionId,
    editStudentId,
    initialSection,
  ]);

  /* -------------------- search LHP (debounce) -------------------- */
  useEffect(() => {
    const locked = isEdit && selectedSection?.id;
    if (!open || !ready || !isLoggedIn || locked) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const sec = await loadClassSections(sectionKeyword);
        if (!cancelled) setSections(sec);
      } catch {}
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [sectionKeyword, open, ready, isLoggedIn, isEdit, selectedSection]);

  /* -------------------- search SV (debounce) -------------------- */
  useEffect(() => {
    if (!open || !ready || !isLoggedIn) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const stds = await loadStudents(studentKeyword);
        if (!cancelled) {
          const byCode = new Map(stds.map((x) => [String(x.code).trim(), x]));
          selectedList.forEach((r) => {
            const k = String(r.code).trim();
            if (!byCode.has(k))
              byCode.set(k, {
                id: r.studentId,
                code: r.code,
                fullName: r.fullName,
                className: r.className,
              });
          });
          setStudents(Array.from(byCode.values()));
        }
      } catch {}
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [studentKeyword, open, ready, isLoggedIn, selectedList]);

  /* -------------------- map MSV -> info -------------------- */
  const studentLookup = useMemo(() => {
    const map = new Map();
    students.forEach((s) => map.set(String(s.code).trim(), s));
    selectedList.forEach((r) => {
      const key = String(r.code).trim();
      if (!map.has(key)) {
        map.set(key, {
          id: r.studentId,
          code: r.code,
          fullName: r.fullName,
          className: r.className,
        });
      }
    });
    return map;
  }, [students, selectedList]);

  useEffect(() => {
    if (!selectedStudentCode) {
      setSelectedStudent(null);
      return;
    }
    const found = studentLookup.get(String(selectedStudentCode).trim());
    setSelectedStudent(found || null);
  }, [selectedStudentCode, studentLookup]);

  /* -------------------- click outside / ESC -------------------- */
  useEffect(() => {
    const onDown = (e) => {
      if (msvOpen && msvBoxRef.current && !msvBoxRef.current.contains(e.target))
        setMsvOpen(false);
      if (secOpen && secBoxRef.current && !secBoxRef.current.contains(e.target))
        setSecOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMsvOpen(false);
        setSecOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [msvOpen, secOpen]);

  /* -------------------- info hiển thị -------------------- */
  const info = useMemo(() => {
    const cs = selectedSection || {};
    const department =
      cs.department?.name ||
      cs.subject?.department?.name ||
      cs.teacher?.department?.name ||
      cs.departmentName ||
      "";
    const faculty =
      cs.faculty?.name || cs.subject?.faculty?.name || cs.facultyName || "";
    return {
      faculty,
      department,
      teacher: cs.teacher?.fullName || cs.teacherName || "",
      semester:
        cs.semester?.name ||
        cs.semester?.term ||
        cs.semester?.academicYear ||
        "",
      subject: cs.subject?.name || cs.subjectName || "",
      room: cs.room?.name || cs.roomName || "",
      sectionName: cs.name || "",
    };
  }, [selectedSection]);

  /* -------------------- add/remove -------------------- */
  const addStudent = () => {
    const code = String(selectedStudentCode || "").trim();
    const found = studentLookup.get(code);
    if (!found) return toastRef.current?.error("MSV không hợp lệ");
    if (selectedList.some((x) => x.code === found.code))
      return toastRef.current?.error("Sinh viên đã có trong danh sách");

    setSelectedList((prev) => [
      ...prev,
      {
        studentId: found.id,
        code: found.code,
        fullName: found.fullName,
        className: found.className,
      },
    ]);
    setSelectedStudentCode("");
    setSelectedStudent(null);
    setMsvOpen(false);
  };
  const removeStudent = (code) => {
    setSelectedList((prev) => prev.filter((x) => x.code !== code));
  };

  /* -------------------- excel -------------------- */
  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Trường Đại học Thủy Lợi"],
      [],
      ["DANH SÁCH SINH VIÊN ĐĂNG KÍ HỌC PHẦN"],
      [],
      ["MSV", "Họ tên", "Lớp"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
    ];
    ws["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, "Mau_DangKy");
    XLSX.writeFile(wb, "mau_dang_ky_sinh_vien.xlsx");
  };

  const handleImportExcel = async (file) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: "",
        blankRows: false,
      });

      if (!rows.length) return toastRef.current?.error("File rỗng");

      let headerRowIndex = 0;
      let header = [];
      for (let i = 0; i < Math.min(rows.length, 10); i += 1) {
        const h = rows[i].map((x) => String(x || "").trim().toUpperCase());
        if (h.includes("MSV")) {
          headerRowIndex = i;
          header = h;
          break;
        }
      }
      const colIdx = header.findIndex((h) =>
        ["MSV", "MÃ SV", "STUDENTCODE"].includes(h)
      );
      if (colIdx === -1)
        return toastRef.current?.error("Không tìm thấy cột 'MSV' trong file");

      const codes = new Set();
      for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
        const code = String(rows[i][colIdx] || "").trim();
        if (code) codes.add(code);
      }
      if (codes.size === 0)
        return toastRef.current?.error("File không có MSV hợp lệ");

      const toAdd = [];
      const notFound = [];
      codes.forEach((code) => {
        const found = studentLookup.get(code);
        if (found) {
          if (
            !toAdd.some((x) => x.code === found.code) &&
            !selectedList.some((x) => x.code === found.code)
          ) {
            toAdd.push({
              studentId: found.id,
              code: found.code,
              fullName: found.fullName,
              className: found.className,
            });
          }
        } else notFound.push(code);
      });

      const resolved = [];
      for (const code of notFound) {
        try {
          const list = await loadStudents(code);
          const exact = list.find((s) => String(s.code).trim() === code);
          if (
            exact &&
            !toAdd.some((x) => x.code === exact.code) &&
            !selectedList.some((x) => x.code === exact.code)
          ) {
            resolved.push({
              studentId: exact.id,
              code: exact.code,
              fullName: exact.fullName,
              className: exact.className,
            });
          }
        } catch {}
      }

      const finalAdd = [...toAdd, ...resolved];
      setSelectedList((prev) => [...prev, ...finalAdd]);

      const missing = notFound.filter(
        (c) => !finalAdd.some((x) => x.code === c)
      );
      const ok = finalAdd.length;
      if (ok > 0) toastRef.current?.success(`Đã thêm ${ok} sinh viên từ Excel.`);
      if (missing.length > 0) {
        const preview = missing.slice(0, 10).join(", ");
        toastRef.current?.error(
          `Không tìm thấy ${missing.length} MSV: ${preview}${
            missing.length > 10 ? "..." : ""
          }`
        );
      }
    } catch (e) {
      console.error("[SCS-Form] import excel error", e);
      toastRef.current?.error("Không thể đọc file Excel");
    }
  };

  /* -------------------- submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSection?.id)
      return toastRef.current?.error("Vui lòng chọn lớp học phần");

    try {
      setSaving(true);

      if (isEditByPair) {
        if (selectedList.length !== 1) {
          return toastRef.current?.error(
            "Chế độ sửa: vui lòng chọn đúng 1 sinh viên để cập nhật"
          );
        }
        const s = selectedList[0];
        const body = {
          studentId: s.studentId,
          classSectionId: selectedSection.id,
        };
        await StudentClassSectionApi.updatePair(
          editStudentId,
          editSectionId,
          body
        );
        toastRef.current?.success("Cập nhật đăng ký thành công.");
        onSuccess?.([body], "update");
        return;
      }

      if (selectedList.length === 0)
        return toastRef.current?.error("Vui lòng thêm ít nhất 1 sinh viên");

      const listToPost = selectedList
        .filter((it) => !existingCodes.has(it.code))
        .map((s) => ({
          studentId: s.studentId,
          classSectionId: selectedSection.id,
        }));

      if (listToPost.length === 0) {
        toastRef.current?.success("Không có bản ghi mới cần đăng ký.");
        onSuccess?.([], "update");
        return;
      }

      await StudentClassSectionApi.bulkCreate(listToPost);
      toastRef.current?.success(
        `Đăng ký thành công ${listToPost.length} sinh viên.`
      );
      onSuccess?.(listToPost, "create");
    } catch (err) {
      console.error("[SCS-Form] submit error", err);
      toastRef.current?.error("Thao tác thất bại");
    } finally {
      setSaving(false);
    }
  };

  const closeNow = () => {
    if (saving) return;
    setSelectedSection(null);
    setSectionKeyword("");
    setSelectedStudentCode("");
    setSelectedStudent(null);
    setSelectedList([]);
    setExistingCodes(new Set());
    setSecOpen(false);
    setMsvOpen(false);
    onClose?.();
  };

  // ---- Dropdown MSV (đặt sau toàn bộ hooks, KHÔNG return sớm) ----
  const keyword = (studentKeyword || selectedStudentCode || "")
    .trim()
    .toLowerCase();

  const inClassOptions = useMemo(() => {
    const base = selectedList.map((r) => ({
      id: r.studentId,
      code: r.code,
      fullName: r.fullName,
      className: r.className,
    }));
    if (!keyword) return base.slice(0, 50);
    return base
      .filter(
        (s) =>
          s.code.toLowerCase().includes(keyword) ||
          (s.fullName || "").toLowerCase().includes(keyword)
      )
      .slice(0, 50);
  }, [selectedList, keyword]);

  const globalOptions = useMemo(() => {
    const arr = students.filter(
      (s) =>
        !inClassOptions.some((x) => x.code === s.code) &&
        (!keyword ||
          s.code.toLowerCase().includes(keyword) ||
          (s.fullName || "").toLowerCase().includes(keyword))
    );
    return arr.slice(0, 50);
  }, [students, inClassOptions, keyword]);

  // ---- Render điều kiện ở CUỐI, không return sớm trước hooks ----
  return !open ? null : (
    <div
      className="scsf-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Sửa đăng kí học phần" : "Đăng kí học phần mới"}
    >
      <AppToast ref={toastRef} />
      <div className="scsf-modal">
        {/* Header */}
        <div className="scsf-header">
          <div>{isEdit ? "SỬA ĐĂNG KÍ HỌC PHẦN" : "ĐĂNG KÍ HỌC PHẦN MỚI"}</div>
          <button
            type="button"
            className="scsf-close"
            aria-label="Đóng"
            onClick={closeNow}
            title="Đóng"
          >
            ×
          </button>
        </div>

        {/* Form tổng */}
        <form className="scsf-form" onSubmit={handleSubmit}>
          <div className="scsf-body">
            {/* ... (phần thân giữ nguyên như trước: chọn LHP, info, combobox MSV, bảng SV, nút Excel) ... */}
            {/* Để ngắn gọn: phần JSX ở đây giống hệt phiên bản trước của bạn,
                chỉ khác ở cách return cuối file. */}
            {/* --- Lớp học phần, info, block sinh viên: dùng lại cùng code JSX trước --- */}
            {/* --------- LỚP HỌC PHẦN --------- */}
            <label className="scsf-label">
              Lớp học phần: <span className="req">*</span>
            </label>
            <div className="scsf-select-row">
              <div
                ref={secBoxRef}
                className={`scsf-select ${
                  loading || (isEdit && selectedSection?.id) ? "disabled" : ""
                }`}
                onClick={() => {
                  if (!(isEdit && selectedSection?.id)) setSecOpen(true);
                }}
                onKeyDown={(e) => {
                  if (
                    !(isEdit && selectedSection?.id) &&
                    ["Enter", " ", "ArrowDown"].includes(e.key)
                  )
                    setSecOpen(true);
                }}
                role="button"
                tabIndex={0}
                aria-expanded={secOpen}
              >
                <input
                  className="scsf-select-input"
                  placeholder="— Chọn học phần —"
                  value={sectionKeyword}
                  onChange={(e) => {
                    if (!(isEdit && selectedSection?.id))
                      setSectionKeyword(e.target.value);
                  }}
                  onFocus={() => {
                    if (!(isEdit && selectedSection?.id)) setSecOpen(true);
                  }}
                  aria-label="Tìm hoặc chọn lớp học phần"
                  readOnly={isEdit && selectedSection?.id}
                />
                <FaChevronDown
                  className="scsf-select-caret"
                  onClick={(e) => {
                    if (isEdit && selectedSection?.id) return;
                    e.stopPropagation();
                    setSecOpen((v) => !v);
                  }}
                  style={{
                    cursor: isEdit && selectedSection?.id ? "default" : "pointer",
                    opacity: isEdit && selectedSection?.id ? 0.3 : 1,
                  }}
                  title={
                    isEdit && selectedSection?.id
                      ? ""
                      : secOpen
                      ? "Thu gọn"
                      : "Mở danh sách"
                  }
                />

                {!(isEdit && selectedSection?.id) && secOpen && (
                  <div
                    className="scsf-select-dropdown"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sections.length === 0 ? (
                      <div className="scsf-dd-empty">Không có dữ liệu</div>
                    ) : (
                      sections.map((cs) => (
                        <div
                          key={cs.id}
                          className={`scsf-dd-item ${
                            selectedSection?.id === cs.id ? "active" : ""
                          }`}
                          onClick={async () => {
                            try {
                              const detail = await loadClassSectionDetail(cs.id);
                              setSelectedSection(detail);
                              setSectionKeyword(detail?.name || cs.name || "");
                            } catch {
                              setSelectedSection(cs);
                              setSectionKeyword(cs.name || "");
                            } finally {
                              setSecOpen(false);
                            }
                          }}
                        >
                          <div className="scsf-dd-name">{cs.name}</div>
                          <div className="scsf-dd-sub">
                            {cs.subject?.name || ""}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* THÔNG TIN LHP */}
            <div className="scsf-grid">
              <div>
                <label className="scsf-label">Khoa:</label>
                <input className="scsf-input" value={info.faculty} readOnly />
              </div>
              <div>
                <label className="scsf-label">Bộ môn:</label>
                <input className="scsf-input" value={info.department} readOnly />
              </div>
              <div>
                <label className="scsf-label">Giảng viên:</label>
                <input className="scsf-input" value={info.teacher} readOnly />
              </div>
              <div>
                <label className="scsf-label">Học kỳ:</label>
                <input className="scsf-input" value={info.semester} readOnly />
              </div>
              <div>
                <label className="scsf-label">Môn học:</label>
                <input className="scsf-input" value={info.subject} readOnly />
              </div>
              <div>
                <label className="scsf-label">Phòng:</label>
                <input className="scsf-input" value={info.room} readOnly />
              </div>
            </div>

            {/* THIẾT LẬP SINH VIÊN */}
            <div className="scsf-block">
              <div className="scsf-block-title-row">
                <span className="scsf-block-title">Thiết lập sinh viên</span>
                <div className="scsf-upload-right">
                  <button
                    type="button"
                    className="scsf-btn ghost"
                    onClick={downloadTemplate}
                  >
                    Tải mẫu Excel
                  </button>
                  <button
                    type="button"
                    className="scsf-btn ghost"
                    onClick={() => fileRef.current?.click()}
                  >
                    Tải lên Excel
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        handleImportExcel(f).finally(() => {
                          e.target.value = "";
                        });
                    }}
                  />
                </div>
              </div>

              {/* MSV combobox */}
              <div className="scsf-stu-row">
                <div className="scsf-stu-col code">
                  <div className="scsf-combo" ref={msvBoxRef}>
                    <input
                      ref={msvInputRef}
                      className="scsf-input"
                      placeholder="Nhập hoặc chọn MSV"
                      value={selectedStudentCode}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSelectedStudentCode(v);
                        setStudentKeyword(v);
                        setMsvOpen(true);
                      }}
                      onFocus={() => setMsvOpen(true)}
                      aria-label="Nhập hoặc chọn MSV"
                      autoComplete="off"
                    />
                    {msvOpen && (
                      <div className="scsf-combo-list">
                        {inClassOptions.length > 0 && (
                          <>
                            <div className="scsf-combo-group-title">
                              Sinh viên đang chọn
                            </div>
                            {inClassOptions.map((s) => (
                              <div
                                key={`in-${s.code}`}
                                className="scsf-combo-item"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSelectedStudentCode(String(s.code));
                                  setStudentKeyword(String(s.code));
                                  setMsvOpen(false);
                                  setTimeout(
                                    () => msvInputRef.current?.focus(),
                                    0
                                  );
                                }}
                              >
                                <div className="code">{s.code}</div>
                                <div className="name">{s.fullName}</div>
                              </div>
                            ))}
                            <div className="scsf-combo-sep" />
                          </>
                        )}

                        {globalOptions.length === 0 ? (
                          <div className="scsf-combo-empty">
                            Không có kết quả
                          </div>
                        ) : (
                          <>
                            <div className="scsf-combo-group-title">
                              Tất cả sinh viên
                            </div>
                            {globalOptions.map((s) => (
                              <div
                                key={`all-${s.id}-${s.code}`}
                                className="scsf-combo-item"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSelectedStudentCode(String(s.code));
                                  setStudentKeyword(String(s.code));
                                  setMsvOpen(false);
                                  setTimeout(
                                    () => msvInputRef.current?.focus(),
                                    0
                                  );
                                }}
                              >
                                <div className="code">{s.code}</div>
                                <div className="name">{s.fullName}</div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="scsf-stu-col name">
                  <input
                    className="scsf-input"
                    placeholder="Họ tên"
                    value={selectedStudent?.fullName || ""}
                    readOnly
                  />
                </div>
                <div className="scsf-stu-col cls">
                  <input
                    className="scsf-input"
                    placeholder="Lớp"
                    value={selectedStudent?.className || ""}
                    readOnly
                  />
                </div>
                <div className="scsf-stu-col add">
                  <button
                    type="button"
                    className="scsf-add-student"
                    onClick={addStudent}
                  >
                    {isEditByPair ? "Chọn sinh viên" : "Thêm sinh viên"}
                  </button>
                </div>
              </div>

              <table className="scsf-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>MSV</th>
                    <th>Họ tên</th>
                    <th>Lớp</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedList.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 12 }}>
                        Chưa có sinh viên nào
                      </td>
                    </tr>
                  ) : (
                    selectedList.map((s, i) => (
                      <tr key={s.code}>
                        <td>{i + 1}</td>
                        <td>{s.code}</td>
                        <td>{s.fullName}</td>
                        <td>{s.className}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className="scsf-icon danger"
                            onClick={() => removeStudent(s.code)}
                            title="Xóa"
                            aria-label={`Xóa sinh viên ${s.code}`}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="scsf-actions">
            <button
              type="button"
              className="scsf-btn ghost"
              onClick={closeNow}
              disabled={saving}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="scsf-btn primary" disabled={saving}>
              {saving
                ? isEditByPair
                  ? "Đang cập nhật..."
                  : "Đang xử lý..."
                : isEditByPair
                ? "Cập nhật"
                : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
