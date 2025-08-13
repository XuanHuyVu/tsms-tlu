import axiosInstance from "./axiosInstance";

const BASE = "/admin/teaching-schedules";

/* --------------- CRUD --------------- */
export const getAllTeachingSchedules = async (params = {}) =>
  (await axiosInstance.get(BASE, { params })).data;

export const getTeachingScheduleById = async (id) =>
  (await axiosInstance.get(`${BASE}/${id}`)).data;

export const createTeachingSchedule = async (data) =>
  (await axiosInstance.post(BASE, data)).data;

export const updateTeachingSchedule = async (id, data) =>
  (await axiosInstance.put(`${BASE}/${id}`, data)).data;

export const deleteTeachingSchedule = async (id) =>
  (await axiosInstance.delete(`${BASE}/${id}`)).data;

/* ---------- map -> row ---------- */
const toRow = (o) => {
  const row = {
    id: o.id,
    lecturerName:
      o.teacher?.fullName || o.classSection?.teacher?.fullName || "",
    classCode: o.classSection?.name || "",
    subjectName: o.subject?.name || o.classSection?.subject?.name || "",
    semester:
      o.semester?.academicYear ||
      o.classSection?.semester?.academicYear ||
      "",
    room: o.room?.name || o.classSection?.room?.name || "",
    sessions: Array.isArray(o.details) ? o.details.length : 0,
  };
  console.log("[toRow]", row);         // 👉 log từng row
  return row;
};

/* ------------- fetchPage ----------- */
export const fetchPage = async ({
  page = 0,
  size = 10,
  search = "",
  sort = "id,asc",
} = {}) => {
  const raw = await getAllTeachingSchedules({ page, size, search, sort });
  console.log("[API] raw =", raw);

  if (Array.isArray(raw)) {
    const kw = search.trim().toLowerCase();
    const filtered = kw
      ? raw.filter((r) =>
          [
            r.teacher?.fullName,
            r.classSection?.teacher?.fullName,
            r.classSection?.name,
            r.subject?.name,
            r.classSection?.subject?.name,
          ]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(kw))
        )
      : raw;

    return {
      content: filtered.slice(page * size, page * size + size).map(toRow),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
      page,
      size,
    };
  }

  const content = (raw.content ?? raw.items ?? []).map(toRow);
  const totalElements = raw.totalElements ?? raw.total ?? content.length;
  const totalPages =
    raw.totalPages ??
    Math.max(1, Math.ceil(totalElements / (raw.size ?? size)));

  return {
    content,
    totalElements,
    totalPages,
    page: raw.number ?? page,
    size: raw.size ?? size,
  };
};

export default {
  getAllTeachingSchedules,
  getTeachingScheduleById,
  create: createTeachingSchedule,
  update: updateTeachingSchedule,
  delete: deleteTeachingSchedule,
  fetchPage,
};
