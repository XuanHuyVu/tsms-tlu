import axiosInstance from './axiosInstance';

export const getAllTeachers = async () => {
  try {
    const response = await axiosInstance.get('/admin/teachers');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách giảng viên:', error);
    throw error;
  }
};


export const getTeacherById = (id) => {
  return axiosInstance.get(`/admin/teachers/${id}`);
};

export const createTeacher = (data) => {
  return axiosInstance.post('/admin/teachers', data);
};
