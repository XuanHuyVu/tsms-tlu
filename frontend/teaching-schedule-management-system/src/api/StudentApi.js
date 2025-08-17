import axiosInstance from './axiosInstance';

// Lấy tất cả sinh viên
export const getAllStudents = async () => {
  try {
    const response = await axiosInstance.get('/admin/students');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sinh viên:', error);
    throw error;
  }
};

// Lấy sinh viên theo ID
export const getStudentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy sinh viên theo ID:', error);
    throw error;
  }
};

// Thêm mới sinh viên
export const createStudent = (data) => {
  return axiosInstance.post('/admin/students', data);
};

// Xóa sinh viên
export const deleteStudent = (id) => {
  return axiosInstance.delete(`/admin/students/${id}`);
};

// Cập nhật thông tin sinh viên
export const updateStudent = (id, data) => {
  return axiosInstance.put(`/admin/students/${id}`, data);
};
