// src/api/TeacherScheduleApi.js
import axiosInstance from "./axiosInstance";

const BASE = "/teacher/teaching-schedules";

/* --------------- CRUD --------------- */
export const getAllTeacherSchedules = async (userId, params = {}) =>
  (await axiosInstance.get(`${BASE}`, { params: { teacherId: userId, ...params } })).data;

export const getTeacherScheduleById = async (userId, id) =>
  (await axiosInstance.get(`${BASE}/${id}`, { params: { teacherId: userId } })).data;

export const createTeacherSchedule = async (userId, data) =>
  (await axiosInstance.post(`${BASE}`, { ...data, teacherId: userId })).data;

export const updateTeacherSchedule = async (userId, id, data) =>
  (await axiosInstance.put(`${BASE}/${id}`, { ...data, teacherId: userId })).data;

export const deleteTeacherSchedule = async (userId, id) =>
  (await axiosInstance.delete(`${BASE}/${id}`, { params: { teacherId: userId } })).data;

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
  console.log("[Teacher toRow]", row);
  return row;
};

/* ------------- fetchPage ----------- */
export const fetchPage = async ({
  userId,
  page = 0,
  size = 10,
  search = "",
  sort = "id,asc",
} = {}) => {
  const raw = await getAllTeacherSchedules(userId, { page, size, search, sort });
  console.log("[Teacher API] raw =", raw);

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
    raw.totalPages ?? Math.max(1, Math.ceil(totalElements / (raw.size ?? size)));

  return {
    content,
    totalElements,
    totalPages,
    page: raw.number ?? page,
    size: raw.size ?? size,
  };
};

export default {
  getAll: getAllTeacherSchedules,
  getById: getTeacherScheduleById,
  create: createTeacherSchedule,
  update: updateTeacherSchedule,
  delete: deleteTeacherSchedule,
  fetchPage,
};
