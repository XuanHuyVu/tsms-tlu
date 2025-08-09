import axiosInstance from './axiosInstance';

export const departmentApi = {
  getAll: async () => {
    const res = await axiosInstance.get('/admin/departments');
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/admin/departments/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post('/admin/departments', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/admin/departments/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`/admin/departments/${id}`);
    return res.data;
  },

  getFaculties: async () => {
    const res = await axiosInstance.get('/admin/faculties');
    return res.data;
  },

  getTeacherCount: async (departmentId) => {
    const res = await axiosInstance.get(`/admin/departments/${departmentId}/teachers/count`);
    return res.data;
  },

  getSubjectCount: async (departmentId) => {
    const res = await axiosInstance.get(`/admin/departments/${departmentId}/subjects/count`);
    return res.data;
  },
};

export default { department: departmentApi };
