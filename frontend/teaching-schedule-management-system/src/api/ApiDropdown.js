import axiosInstance from './axiosInstance';

/**
 * Lấy danh sách tất cả các Khoa
 * @returns Promise<Array<{id: number, name: string}>>
 */
export const getFaculties = async () => {
  try {
    const response = await axiosInstance.get('admin/faculties');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Khoa:', error);
    throw error;
  }
};

/**
 * Lấy danh sách Bộ môn theo ID của Khoa
 * @param {number|string} facultyId 
 * @returns Promise<Array<{id: number, name: string, facultyId: number}>>
 */
export const getDepartmentsByFaculty = async (facultyId) => {
  try {
    const response = await axiosInstance.get('/admin/departments', {
      params: { facultyId },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Bộ môn:', error);
    throw error;
  }
};
