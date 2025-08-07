import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import "../../../styles/AccountList.css";
import AccountForm from "./AccountForm";
import AccountDetail from "./AccountDetail";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useAuth } from "../../../contexts/AuthContext";
import { accountApi } from "../../../api/AccountApi";

const AccountList = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout, checkTokenExpiry, isTokenValid } = useAuth();

  // Fetch accounts từ API sử dụng AccountApi
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching accounts...");

      // Check token validity first
      if (!isTokenValid()) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }

      // Sử dụng AccountApi thay vì fetch trực tiếp
      const data = await accountApi.getAll();

      console.log("API Response:", data);

      // Transform data để match với UI format
      const transformedData = data.map((user, index) => {
        // Normalize role values
        let normalizedRole = user.role || 'User';
        if (normalizedRole === 'ROLE_ADMIN') normalizedRole = 'Admin';
        if (normalizedRole === 'ROLE_TEACHER') normalizedRole = 'Teacher';
        if (normalizedRole === 'ROLE_STUDENT') normalizedRole = 'Student';
        
        return {
          stt: index + 1,
          tenDangNhap: user.username,
          vaiTro: normalizedRole,
          ngayTao: user.createdDate || new Date().toISOString().split('T')[0],
          id: user.id
        };
      });

      // Sort theo ID giảm dần để item mới nhất lên đầu
      transformedData.sort((a, b) => (b.id || 0) - (a.id || 0));

      // Cập nhật lại STT sau khi sort
      const finalData = transformedData.map((item, index) => ({
        ...item,
        stt: index + 1
      }));

      setAccounts(finalData);
      setFilteredAccounts(finalData); // Khởi tạo danh sách lọc
    } catch (error) {
      console.error("Fetch accounts error:", error);
      setError(error.message);
      
      // Nếu token hết hạn, tự động logout
      if (error.message.includes('Token hết hạn') || error.message.includes('không có quyền')) {
        setTimeout(() => {
          logout();
        }, 2000); // Delay 2s để user đọc message
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Effect để filter accounts khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(account => 
        account.tenDangNhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.vaiTro.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  }, [accounts, searchTerm]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddAccount = () => {
    setEditingAccount(null); // Reset editing state
    setShowForm(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleViewAccount = (account) => {
    setSelectedAccount(account);
    setShowDetail(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (account) => {
    setDeletingAccount(account);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingAccount(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAccount) return;

    try {
      setDeleteLoading(true);
      setError(null);

      if (!isTokenValid()) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }

      // Gọi API xóa tài khoản
      await accountApi.delete(deletingAccount.id);

      // Refresh data sau khi xóa thành công
      await fetchAccounts();
      
      // Đóng modal
      handleCloseDeleteModal();

    } catch (error) {
      console.error("Delete account error:", error);
      setError(error.message);
      
      if (error.message.includes('Token hết hạn') || error.message.includes('không có quyền')) {
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reload data sau khi thêm/sửa
  const handleFormSuccess = async () => {
    // Refresh data từ API để có thông tin mới nhất
    await fetchAccounts();
    handleCloseForm();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hiển thị form overlay khi showForm = true */}
      {showForm && <AccountForm onClose={handleCloseForm} onSuccess={handleFormSuccess} editData={editingAccount} />}
      
      {/* Hiển thị detail modal khi showDetail = true */}
      {showDetail && <AccountDetail account={selectedAccount} onClose={handleCloseDetail} />}
      
      {/* Hiển thị delete confirm modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="XÓA TÀI KHOẢN"
        message="Bạn có chắc chắn muốn xóa tài khoản này không?"
        loading={deleteLoading}
      />
      
      {/* Error message with login again option */}
      {error && (
        <div className="alert alert-warning mb-3">
          <strong>Lỗi kết nối API:</strong> {error}
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-primary me-2" onClick={fetchAccounts}>
              Thử lại
            </button>
            {error.includes('Token hết hạn') && (
              <button className="btn btn-sm btn-danger" onClick={logout}>
                Đăng nhập lại
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Form Card */}
      <div className="form-card compact">
        <button className="add-btn" onClick={handleAddAccount}>Thêm tài khoản</button>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Tìm kiếm" 
            className="search-box"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Table */}
      <table className="account-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((item, index) => (
            <tr key={item.id || index}>
              <td>{index + 1}</td>
              <td>{item.tenDangNhap}</td>
              <td>{item.vaiTro}</td>
              <td>{item.ngayTao}</td>
              <td className="actions">
                <FaInfoCircle className="icon info" onClick={() => handleViewAccount(item)} />
                <FaEdit className="icon edit" onClick={() => handleEditAccount(item)} />
                <FaTrash className="icon delete" onClick={() => handleDeleteAccount(item)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <div>Hiển thị {filteredAccounts.length} kết quả {searchTerm && `(lọc từ ${accounts.length} tài khoản)`}</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến {Math.min(10, filteredAccounts.length)} bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default AccountList;