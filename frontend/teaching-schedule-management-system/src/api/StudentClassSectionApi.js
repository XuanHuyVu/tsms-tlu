// src/api/StudentClassSectionApi.js
import axiosInstance from "./axiosInstance";

/* ================================================================
 * BASE (mặc định ADMIN). Có thể override qua REACT_APP_SCS_BASE
 * ================================================================ */
const BASE = process.env.REACT_APP_SCS_BASE || "/admin/student-class-sections";

/* -------------------- utils -------------------- */
const sanitizeParams = (params = {}) => {
  const out = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string") {
      const t = v.trim();
      if (t !== "") out[k] = t;
    } else out[k] = v;
  });
  return out;
};

const getCreatedAtTs = (it) => {
  const raw = it?.createdAt || it?.classSection?.createdAt || null;
  const ts = raw ? Date.parse(raw) : NaN;
  return Number.isNaN(ts) ? 0 : ts;
};

export const normalizeSCSItem = (it, index = 0, page = 0, size = 10) => {
  const cs = it?.classSection || {};
  const subject = cs?.subject || {};
  const teacher = cs?.teacher || {};
  const semester = cs?.semester || {};

  const subjectCode = cs?.name ?? "";
  const subjectName = subject?.name ?? "";
  const teacherName = teacher?.fullName ?? "";

  const parts = [];
  if (semester?.name || semester?.term)
    parts.push(semester?.name || semester?.term);
  if (semester?.academicYear) parts.push(semester?.academicYear);
  const semesterText = parts.join(" - ");

  return {
    stt: page * size + index + 1,
    subjectCode,
    subjectName,
    teacherName,
    semesterText,
    studentCount: it?.studentCount ?? 0,
    createdAt: it?.createdAt || cs?.createdAt || null,
    raw: it,
  };
};

/* -------------------- CRUD + paging -------------------- */
export const fetchPage = async ({
  page = 0,
  size = 10,
  search = "",
  sort = "createdAt,desc",
  studentId,
  classSectionId,
} = {}) => {
  const params = sanitizeParams({
    page,
    size,
    search,
    sort,
    studentId,
    classSectionId,
  });
  const { data } = await axiosInstance.get(BASE, { params });
  return data;
};

export const fetchPageNormalized = async (args = {}) => {
  const {
    page = 0,
    size = 10,
    search = "",
    sort = "createdAt,desc",
    studentId,
    classSectionId,
  } = args;

  const raw = await fetchPage({
    page,
    size,
    search,
    sort,
    studentId,
    classSectionId,
  });

  if (Array.isArray(raw)) {
    const sorted = [...raw].sort((a, b) => getCreatedAtTs(b) - getCreatedAtTs(a));
    const totalAll = sorted.length;
    const start = page * size;
    const end = start + size;
    const paged = sorted.slice(start, end);
    return {
      content: paged.map((it, i) => normalizeSCSItem(it, i, page, size)),
      totalElements: totalAll,
      totalPages: Math.max(1, Math.ceil(totalAll / size)),
      number: page,
      size,
    };
    }

  const content = Array.isArray(raw?.content) ? raw.content : [];
  const contentSorted = [...content].sort(
    (a, b) => getCreatedAtTs(b) - getCreatedAtTs(a)
  );
  return { ...raw, content: contentSorted.map((it, i) => normalizeSCSItem(it, i, page, size)) };
};

export const getById = async (id) =>
  (await axiosInstance.get(`${BASE}/${id}`)).data;

/* ---------- APIs theo cặp studentId/classSectionId ---------- */
export const getByPair = async (studentId, classSectionId) =>
  (await axiosInstance.get(`${BASE}/${studentId}/${classSectionId}`)).data;

export const updatePair = async (
  oldStudentId,
  oldClassSectionId,
  payload // { studentId, classSectionId }
) =>
  (
    await axiosInstance.put(
      `${BASE}/${oldStudentId}/${oldClassSectionId}`,
      payload
    )
  ).data;

/* ---------- create / delete / bulk ---------- */
export const create = async (payload) => {
  const body = {
    studentId: payload?.studentId,
    classSectionId: payload?.classSectionId,
  };
  return (await axiosInstance.post(BASE, body)).data;
};

export const remove = async (id) =>
  (await axiosInstance.delete(`${BASE}/${id}`)).data;

export const bulkCreate = async (list = []) => {
  const arr = Array.isArray(list) ? list : [];
  const results = [];
  for (const it of arr) {
    const body = {
      studentId: it?.studentId,
      classSectionId: it?.classSectionId,
    };
    const { data } = await axiosInstance.post(BASE, body);
    results.push(data);
  }
  return results;
};

const StudentClassSectionApi = {
  fetchPage,
  fetchPageNormalized,
  getById,
  getByPair,
  updatePair,
  create,
  delete: remove,
  bulkCreate,
};

export default StudentClassSectionApi;
