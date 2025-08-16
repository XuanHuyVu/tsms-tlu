// src/api/TeacherScheduleApi.js
import axiosInstance from "./axiosInstance";

/**
 * GET /teacher/teaching-schedules?teacherId=456
 */
export async function getAllTeacherSchedules(teacherId, params = {}) {
  if (!teacherId) throw new Error("TeacherScheduleApi: missing teacherId");
  const { data } = await axiosInstance.get("/teacher/teaching-schedules", {
    params: { teacherId, ...params },
  });
  console.log("[TeacherScheduleApi] raw schedules →", data);
  return data;
}

export default {
  getAll: getAllTeacherSchedules,
};
