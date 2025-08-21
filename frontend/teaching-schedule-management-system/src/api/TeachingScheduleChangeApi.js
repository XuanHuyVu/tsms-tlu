import axiosInstance from "./axiosInstance";

// ================== ADMIN ==================

// Lấy danh sách thay đổi lịch (có filter + phân trang)
export const getScheduleChanges = async (params) => {
  try {
    const response = await axiosInstance.get("/admin/schedule-changes", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thay đổi lịch:", error);
    throw error;
  }
};

// Lấy chi tiết thay đổi lịch theo ID
export const getScheduleChangeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/schedule-changes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết thay đổi lịch:", error);
    throw error;
  }
};

// Admin duyệt thay đổi lịch
export const approveScheduleChange = async (id) => {
  try {
    const response = await axiosInstance.put(`/admin/schedule-changes/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi duyệt thay đổi lịch:", error);
    throw error;
  }
};

// Admin từ chối thay đổi lịch
export const rejectScheduleChange = async (id, reason) => {
  try {
    const response = await axiosInstance.put(`/admin/schedule-changes/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi từ chối thay đổi lịch:", error);
    throw error;
  }
};

// Xóa thay đổi lịch (nếu cần)
export const deleteScheduleChange = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/schedule-changes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa thay đổi lịch:", error);
    throw error;
  }
};

// ================== TEACHER ==================

// Giảng viên tạo mới yêu cầu thay đổi lịch (FormData để upload file)
export const createScheduleChange = async (data) => {
  try {
    const response = await axiosInstance.post("/teacher/schedule-changes", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo thay đổi lịch:", error);
    throw error;
  }
};
