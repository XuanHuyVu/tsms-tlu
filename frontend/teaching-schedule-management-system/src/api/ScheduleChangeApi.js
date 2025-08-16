import axiosInstance from './axiosInstance';

// Lấy danh sách thay đổi lịch (có filter và phân trang)
export const getScheduleChanges = async (params) => {
  try {
    const res = await axiosInstance.get("/admin/schedule-changes", { params });
    console.log("Dữ liệu trả về từ API:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thay đổi lịch:", error);
    throw error;
  }
};

export const getScheduleChangeDetail = async (id, type) => {
  let endpoint = "";
  if (type === "MAKE_UP_CLASS") {
    endpoint = `/admin/schedule-changes/${id}/make-up-class`;
  } else if (type === "CLASS_CANCEL") {
    endpoint = `/admin/schedule-changes/${id}/class-cancel`;
  }
  try {
    const res = await axiosInstance.get(endpoint);
    console.log("Dữ liệu chi tiết trả về:", res.data);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết thay đổi lịch:", err);
    throw err;
  }
};



//Duyệt thay đổi lịch
export const approveScheduleChange = async (id) => {
  try {
    const res = await axiosInstance.put(`/schedule-changes/${id}/approve`, {
      status: "APPROVED",
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi duyệt thay đổi lịch:", error);
    throw error;
  }
};

// Từ chối thay đổi lịch
export const rejectScheduleChange = async (id) => {
  try {
    const res = await axiosInstance.put(`/schedule-changes/${id}/approve`, {
      status: "REJECTED",
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi từ chối thay đổi lịch:", error);
    throw error;
  }
};

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
