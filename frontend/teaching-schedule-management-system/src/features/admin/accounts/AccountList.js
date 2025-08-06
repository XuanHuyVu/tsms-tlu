import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import "../../../styles/AccountList.css";
import AccountForm from "./AccountForm";
import AccountDetail from "./AccountDetail";
import { useAuth } from "../../../contexts/AuthContext";

const AccountList = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, checkTokenExpiry, isTokenValid } = useAuth();

  // Fetch accounts từ API với multiple endpoint fallback
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log("Fetching accounts...", token);

      // Check token validity first
      if (!isTokenValid()) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }

      // Try multiple endpoints
      const endpoints = ['/api/users', '/api/accounts', '/api/admin/users'];
      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log(`${endpoint} Response status:`, response.status);

          if (response.ok) {
            break; // Success, exit loop
          } else if (response.status === 401 || response.status === 403) {
            lastError = new Error('Token hết hạn hoặc không có quyền truy cập');
            continue; // Try next endpoint
          } else {
            lastError = new Error(`API Error: ${response.status}`);
            continue;
          }
        } catch (err) {
          console.log(`${endpoint} failed:`, err);
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('Không thể kết nối đến API');
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Transform data để match với UI format
      const transformedData = data.map((user, index) => ({
        stt: index + 1,
        tenDangNhap: user.username,
        vaiTro: user.role || 'User',
        ngayTao: user.createdDate || 'N/A',
        id: user.id
      }));

      setAccounts(transformedData);
    } catch (error) {
      console.error("Fetch accounts error:", error);
      setError(error.message);
      
      // Nếu token hết hạn, tự động logout
      if (error.message.includes('Token hết hạn') || error.message.includes('không có quyền')) {
        setTimeout(() => {
          logout();
        }, 2000); // Delay 2s để user đọc message
      }
      
      // Fallback data nếu API lỗi
      setAccounts([
        {
          stt: 1,
          tenDangNhap: "admin",
          vaiTro: "Admin",
          ngayTao: "20/10/2023",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

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

  // Reload data sau khi thêm/sửa
  const handleFormSuccess = () => {
    fetchAccounts();
    handleCloseForm();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Đang tải danh sách tài khoản...</p>
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
          <input type="text" placeholder="Tìm kiếm" className="search-box" />
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
          {accounts.map((item, index) => (
            <tr key={item.id || index}>
              <td>{item.stt}</td>
              <td>{item.tenDangNhap}</td>
              <td>{item.vaiTro}</td>
              <td>{item.ngayTao}</td>
              <td className="actions">
                <FaInfoCircle className="icon info" onClick={() => handleViewAccount(item)} />
                <FaEdit className="icon edit" onClick={() => handleEditAccount(item)} />
                <FaTrash className="icon delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <div>Hiển thị {accounts.length} kết quả</div>
        <div className="pagination">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Từ 1 đến 10 bản ghi</span>
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default AccountList;