import axiosInstance from './axiosInstance';

// Lấy danh sách thay đổi lịch (có filter và phân trang)
export const getScheduleChanges = async (params) => {
  try {
    const res = await axiosInstance.get("/admin/schedule-changes", { params });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thay đổi lịch:", error);
    throw error;
  }
};

// Duyệt thay đổi lịch
// export const approveScheduleChange = async (id) => {
//   try {
//     const res = await axiosInstance.put(`/schedule-changes/${id}/approve`, {
//       status: "APPROVED",
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Lỗi khi duyệt thay đổi lịch:", error);
//     throw error;
//   }
// };

// Từ chối thay đổi lịch
// export const rejectScheduleChange = async (id) => {
//   try {
//     const res = await axiosInstance.put(`/schedule-changes/${id}/approve`, {
//       status: "REJECTED",
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Lỗi khi từ chối thay đổi lịch:", error);
//     throw error;
//   }
// };

// Xóa yêu cầu thay đổi lịch
// export const deleteScheduleChange = async (id) => {
//   try {
//     const res = await axiosInstance.delete(`/schedule-changes/${id}`);
//     return res.data;
//   } catch (error) {
//     console.error("Lỗi khi xóa thay đổi lịch:", error);
//     throw error;
//   }
// };
