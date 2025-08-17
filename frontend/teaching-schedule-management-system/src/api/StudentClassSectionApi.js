const BASE = "/api/admin/student-class-sections";

function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  return q.toString();
}

async function http(method, url, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[StudentClassSectionApi] ${method} ${url} => ${res.status} ${text}`);
  }
  // backend trang phân trang trả về JSON kiểu { content, totalElements, totalPages, ... }
  return res.status !== 204 ? res.json() : null;
}

const StudentClassSectionApi = {
  /**
   * Lấy trang danh sách đăng ký lớp học phần
   * @param {object} params { page, size, search, sort, studentId }
   */
  async fetchPage({ page = 0, size = 10, search = "", sort = "id,asc", studentId } = {}) {
    const qs = buildQuery({ page, size, search: search.trim(), sort, studentId });
    return http("GET", `${BASE}?${qs}`);
  },

  /** Lấy chi tiết 1 đăng ký theo id */
  async getById(id) {
    return http("GET", `${BASE}/${id}`);
  },

  /** Tạo mới đăng ký lớp học phần */
  async create(payload) {
    // payload: { studentId, classSectionId, practiseGroup }
    return http("POST", BASE, payload);
  },

  /** Cập nhật đăng ký lớp học phần */
  async update(id, payload) {
    return http("PUT", `${BASE}/${id}`, payload);
  },

  /** Xoá đăng ký */
  async delete(id) {
    return http("DELETE", `${BASE}/${id}`);
  },

  /** Đổi nhóm thực hành nhanh */
  async updatePractiseGroup(id, practiseGroup) {
    return http("PATCH", `${BASE}/${id}/practise-group`, { practiseGroup });
  },

  /** Đăng ký hàng loạt (tuỳ backend hỗ trợ) */
  async bulkCreate(list) {
    // list: Array<{ studentId, classSectionId, practiseGroup }>
    return http("POST", `${BASE}/bulk`, list);
  },
};

export default StudentClassSectionApi;