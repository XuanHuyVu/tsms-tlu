import React, { useEffect, useState } from "react";

const defaultValues = {
  code: "",
  name: "",
  deanName: "",
  description: "",
  status: "ACTIVE",
};

const FacultyForm = ({ editData, onClose, onSuccess }) => {
  const [form, setForm] = useState(defaultValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        code: editData.code ?? "",
        name: editData.name ?? "",
        deanName: editData.deanName ?? "",
        description: editData.description ?? "",
        status: editData.status ?? "ACTIVE",
      });
    } else {
      setForm(defaultValues);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSuccess(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editData ? "Chỉnh sửa khoa" : "Thêm khoa"}</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Mã khoa</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              placeholder="VD: CNTT"
            />
          </div>

          <div className="form-group">
            <label>Tên khoa</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Công nghệ thông tin"
            />
          </div>

          <div className="form-group">
            <label>Trưởng khoa</label>
            <input
              name="deanName"
              value={form.deanName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / 3" }}>
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả ngắn về khoa"
            />
          </div>

          <div className="form-actions" style={{ gridColumn: "1 / 3" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyForm;
