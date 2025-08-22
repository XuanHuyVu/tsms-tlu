import React, { useEffect, useState } from "react";
import { getScheduleChanges, getScheduleChangeDetail, approveScheduleChange,rejectScheduleChange,createNotification } from "../../../api/ScheduleChangeApi";
import { getAllTeachers } from "../../../api/TeacherApi";
import dayjs from "dayjs";
import "../../../styles/ScheduleChangeList.css";
import { FaSearch, FaInfoCircle, FaRegCheckSquare, FaTimesCircle,FaPaperPlane } from "react-icons/fa";
import ScheduleChangeDetail from "./ScheduleChangeDetail";

const ScheduleChangeList = () => {
  const [allChanges, setAllChanges] = useState([]); 
  const [changes, setChanges] = useState([]); 

  const [filters, setFilters] = useState({
    type: "Tất cả",
    teacher: "Tất cả",
    status: "Tất cả",
    fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    search: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedChange, setSelectedChange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const typeMapping = {
    DAY_BU: "Lịch bù",
    HUY_LICH: "Lịch hủy",
  };

  const statusLabels = {
  DA_DUYET: "Đã duyệt",
  TU_CHOI: "Từ chối",
  CHUA_DUYET: "Chưa duyệt"

  
};
const [showNotificationForm, setShowNotificationForm] = useState(false);
const [notificationData, setNotificationData] = useState({
  title: "",
  content: "",
  type: "",
  relatedScheduleChangeId: null,
  recipientUserIds: []
});
const [recipientInput, setRecipientInput] = useState("");

const handleSendNotification = async () => {
  const recipientUserIds = recipientInput
    .split(",")
    .map(id => Number(id.trim()))
    .filter(id => !isNaN(id) && id > 0);

  if (!notificationData.title.trim() || !notificationData.content.trim()) {
    alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
    return;
  }
  if (!notificationData.relatedScheduleChangeId) {
    alert("Thiếu mã lịch thay đổi liên quan!");
    return;
  }
  if (!notificationData.type) {
    alert("Vui lòng chọn loại thông báo!");
    return;
  }
  if (recipientUserIds.length === 0) {
    alert("Vui lòng nhập danh sách người nhận hợp lệ!");
    return;
  }

  const payload = {
    ...notificationData,
    recipientUserIds,
  };

  console.log("Dữ liệu gửi thông báo:", payload);

  try {
    await createNotification(payload);
    alert("Đã gửi thông báo thành công!");
    setShowNotificationForm(false);
    setNotificationData({
      title: "",
      content: "",
      type: "",
      relatedScheduleChangeId: null,
      recipientUserIds: []
    });
    setRecipientInput("");
  } catch (error) {
    if (error.response) {
      console.error('Lỗi gửi thông báo:', error.response.status, error.response.data);
      alert(`Lỗi ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error("Lỗi khi gửi thông báo:", error);
      alert("Gửi thông báo thất bại, vui lòng thử lại.");
    }
  }
};


  useEffect(() => {
    fetchTeachers();
    fetchAllChanges();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách giảng viên:", err);
    }
  };

  const fetchAllChanges = async () => {
    try {
      const data = await getScheduleChanges({});
      const content = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setAllChanges(content);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
const filtered = allChanges.filter((item) => {
  if (filters.type !== "Tất cả" && item.type !== filters.type) return false;

  const teacherName = item.classSection?.teacher?.fullName || "";
  if (filters.teacher !== "Tất cả" && teacherName !== filters.teacher) return false;

  if (filters.status !== "Tất cả" && item.status !== filters.status) return false;

  const created = dayjs(item.createdAt).format("YYYY-MM-DD");
  if (created < filters.fromDate || created > filters.toDate) return false;

  const className = item.classSection?.name?.toLowerCase() || "";
  if (filters.search && !className.includes(filters.search.toLowerCase())) return false;

  return true;
});
setChanges(filtered);

    setPage(1);
    setChanges(filtered);
  }, [filters, allChanges]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

 const handleViewDetails = async (change) => {
  try {
    let detailData = await getScheduleChangeDetail(change.id, change.type);
    console.log("Data detail nhận được:", detailData);
    detailData.type = change.type;

    if (!detailData.teachingSchedule && change.teachingSchedule) {
      detailData.teachingSchedule = change.teachingSchedule;
    }
    setSelectedChange(detailData);
    setShowModal(true);
  } catch (err) {
    console.error("Lỗi khi mở chi tiết:", err);
  }
};


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChange(null);
  };

const handleApproveSchedule = async (changeToApprove) => {
  try {
    await approveScheduleChange(changeToApprove.id);

    setAllChanges(prevChanges =>
      prevChanges.map(change =>
        change.id === changeToApprove.id
          ? { ...change, status: "DA_DUYET" }
          : change
      )
    );

    setNotificationData(prev => ({
      ...prev,
      relatedScheduleChangeId: changeToApprove.id,
      recipientUserIds: changeToApprove.recipientUserIds || [] 
    }));
    setShowNotificationForm(true);

    alert(`Đã duyệt lịch ID: ${changeToApprove.id}`);
    handleCloseModal();
  } catch (error) {
    console.error("Lỗi khi duyệt lịch:", error);
    alert("Duyệt lịch thất bại! Vui lòng thử lại.");
  }
};


  const handleRejectSchedule = async (changeToReject) => {
    try {
      const res = await rejectScheduleChange(changeToReject.id);

      setAllChanges(prevChanges =>
        prevChanges.map(change =>
          change.id === changeToReject.id
            ? { ...change, status: "Đã từ chối" }
            : change
        )
      );

      alert(`Đã từ chối lịch ID: ${changeToReject.id}`);
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi từ chối lịch:", error);
      alert("Đã có lỗi xảy ra khi từ chối lịch.");
    }
  };

  const totalPages = Math.ceil(changes.length / pageSize);
  const paginatedChanges = changes.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="schedule-change-container">
      <div className="filter-bar">
        <div className="filter-items-group">
          <div className="filter-item">
            <label>Loại thay đổi</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="Tất cả">Tất cả</option>
              <option value="HUY_LICH">Lịch hủy</option>
              <option value="DAY_BU">Lịch bù</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Giảng viên</label>
            <select
              name="teacher"
              value={filters.teacher}
              onChange={handleFilterChange}
              style={{ minWidth: '200px' }} 
            >
              <option value="Tất cả">Tất cả</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.fullName}>
                  {t.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Từ ngày</label>
            <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          </div>
          <div className="filter-item">
            <label>Đến ngày</label>
            <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          </div>

          <div className="filter-item">
            <label>Trạng thái</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="Tất cả">Tất cả</option>
              <option value="DA_DUYET">Đã duyệt</option>
              <option value="CHUA_DUYET">Chưa duyệt</option>
              <option value="TU_CHOI">Đã từ chối</option>
            </select>

          </div>

        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="search-box1"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Loại</th>
            <th>Giảng viên phụ trách</th>
            <th>Lớp học phần</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
          <tbody>
            {paginatedChanges.length > 0 ? (
              paginatedChanges.map((item, index) => (
                <tr key={item.id}>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>{typeMapping[item.type] || item.type || "-"}</td> 
                  <td>{item.classSection?.teacher?.fullName || "-"}</td> 
                  <td>{item.classSection?.name || "-"}</td> 
                  <td>{item.createdAt ? dayjs(item.createdAt).format("DD/MM/YYYY") : "-"}</td>
                  <td>{statusLabels[item.status] || item.status || "Chưa duyệt"}</td>
                  <td className="actions">
                    <FaInfoCircle
                      className="icon info"
                      title="Chi tiết"
                      onClick={() => handleViewDetails(item)}
                    />
                    {(item.status !== "DA_DUYET" && item.status !== "TU_CHOI") && (
                      <>
                        <FaRegCheckSquare
                          className="icon check"
                          title="Duyệt"
                          onClick={() => handleApproveSchedule(item)}
                          style={{ cursor: "pointer", marginLeft: 8 }}
                        />
                        <FaTimesCircle
                          className="icon reject"
                          title="Từ chối"
                          onClick={() => handleRejectSchedule(item)}
                          style={{ cursor: "pointer", marginLeft: 8 }}
                        />
                      </>
                    )}
                    {item.status === "DA_DUYET" && (
                      <FaPaperPlane
                        className="icon send"
                        title="Tạo thông báo"
                        onClick={() => {
                          setNotificationData(prev => ({
                            ...prev,
                            relatedScheduleChangeId: item.id,
                            recipientUserIds: item.recipientUserIds || [],
                            title: "",
                            content: "",
                            type: "THAY_DOI_LICH",
                          }));
                          setRecipientInput((item.recipientUserIds || []).join(","));
                          setShowNotificationForm(true);
                        }}
                        style={{ cursor: "pointer", marginLeft: 8 }}
                      />
                    )}

                  </td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>

      </table>

      {/* Pagination */}
      <div className="footer">
        <div>Hiển thị {paginatedChanges.length} / {changes.length} kết quả</div>
        <div className="pagination">
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>&lt;</button>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      </div>

      {showModal && selectedChange && (
        <ScheduleChangeDetail
          change={selectedChange}
          onClose={handleCloseModal}
          onApprove={() => handleApproveSchedule(selectedChange)}
          onReject={() => handleRejectSchedule(selectedChange)}
        />
      )}

{showNotificationForm && (
  <div className="notification-form-overlay" onClick={() => setShowNotificationForm(false)}>
    <div className="notification-form" onClick={e => e.stopPropagation()}>
      <h3>Tạo thông báo</h3>

      <label>Tiêu đề:</label>
      <input
        type="text"
        value={notificationData.title}
        onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="Nhập tiêu đề thông báo"
      />

      <label>Nội dung:</label>
      <textarea
        value={notificationData.content}
        onChange={(e) => setNotificationData(prev => ({ ...prev, content: e.target.value }))}
        rows={4}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="Nhập nội dung thông báo"
      />

      <label>Loại thông báo:</label>
      <select
        value={notificationData.type}
        onChange={e => setNotificationData(prev => ({ ...prev, type: e.target.value }))}
        style={{ width: "100%", marginBottom: 12 }}
      >
        <option value="THAY_DOI_LICH">Thay đổi lịch</option>
        <option value="HUY_LICH">Hủy lịch</option>
      </select>

      <label>Người nhận (ID, cách nhau dấu phẩy):</label>
      <input
        type="text"
        value={recipientInput}
        onChange={e => setRecipientInput(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="VD: 7,8,10,12"
      />
      <div style={{ marginTop: 16 }}>
        <button onClick={handleSendNotification} style={{ marginRight: 10 }}>Gửi thông báo</button>
        <button onClick={() => setShowNotificationForm(false)}>Hủy</button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default ScheduleChangeList;
