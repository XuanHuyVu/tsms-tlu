import axiosInstance from './axiosInstance';

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



export const approveScheduleChange = async (id) => {
  try {
    const res = await axiosInstance.put(`/admin/schedule-changes/${id}/approve`, {
      status: "DA_DUYET",
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi duyệt thay đổi lịch:", error);
    throw error;
  }
};

export const rejectScheduleChange = async (id) => {
  try {
    const res = await axiosInstance.put(`/admin/schedule-changes/${id}/reject`, {
      status: "TU_CHOI",
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi từ chối thay đổi lịch:", error);
    throw error;
  }
};


