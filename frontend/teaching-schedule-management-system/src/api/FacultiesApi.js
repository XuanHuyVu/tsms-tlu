import axiosInstance from './axiosInstance';

export const getAllFaculties = async () => {
  try {
    const response = await axiosInstance.get('/admin/faculties');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khoa:', error);
    throw error;
  }
};

export const getFacultyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/faculties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy khoa theo ID:', error);
    throw error;
  }
};

export const createFaculty = (data) => {
  return axiosInstance.post('/admin/faculties', data);
};

export const deleteFaculty = (id) => {
  return axiosInstance.delete(`/admin/faculties/${id}`);
};

export const updateFaculty = (id, data) => {
  return axiosInstance.put(`/admin/faculties/${id}`, data);
};
