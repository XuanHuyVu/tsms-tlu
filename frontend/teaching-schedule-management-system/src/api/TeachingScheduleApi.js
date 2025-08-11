import axiosInstance from "./axiosInstance";

const BASE = "/admin/teaching-schedules";

// ===== CRUD =====
export const getAllTeachingSchedules = async (params) => {
  console.log("[TSApi] getAllTeachingSchedules params =", params);
  const res = await axiosInstance.get(BASE, { params });
  console.log("[TSApi] getAllTeachingSchedules res =", res.data);
  return res.data;
};

export const getTeachingScheduleById = async (id) => {
  console.log("[TSApi] getTeachingScheduleById id =", id);
  const res = await axiosInstance.get(`${BASE}/${id}`);
  console.log("[TSApi] getTeachingScheduleById res =", res.data);
  return res.data;
};

export const createTeachingSchedule = async (data) => {
  console.log("[TSApi] createTeachingSchedule payload =", data);
  const res = await axiosInstance.post(BASE, data);
  console.log("[TSApi] createTeachingSchedule res =", res.data);
  return res.data;
};

export const updateTeachingSchedule = async (id, data) => {
  console.log("[TSApi] updateTeachingSchedule id =", id, " payload =", data);
  const res = await axiosInstance.put(`${BASE}/${id}`, data);
  console.log("[TSApi] updateTeachingSchedule res =", res.data);
  return res.data;
};

export const deleteTeachingSchedule = async (id) => {
  console.log("[TSApi] deleteTeachingSchedule id =", id);
  const res = await axiosInstance.delete(`${BASE}/${id}`);
  console.log("[TSApi] deleteTeachingSchedule res =", res.data);
  return res.data;
};

// ===== Pagination fetch =====
export const fetchPage = async ({
  page = 0,
  size = 10,
  search = "",
  sort = "id,asc",
} = {}) => {
  console.log("[TSApi] fetchPage args =", { page, size, search, sort });
  const data = await getAllTeachingSchedules({ page, size, search, sort });
  const mapped = {
    content: data.content || [],
    totalElements: data.totalElements || 0,
    totalPages: data.totalPages || 0,
    page: data.number ?? page,
    size: data.size ?? size,
  };
  console.log("[TSApi] fetchPage mapped =", mapped);
  return mapped;
};

export default {
  getAllTeachingSchedules,
  getTeachingScheduleById,
  create: createTeachingSchedule,
  update: updateTeachingSchedule,
  delete: deleteTeachingSchedule,
  fetchPage,
};
