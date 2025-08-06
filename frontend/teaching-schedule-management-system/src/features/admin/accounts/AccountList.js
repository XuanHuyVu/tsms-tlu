import React, { useState } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import "../../../styles/AccountList.css";
import AccountForm from "./AccountForm";
import AccountDetail from "./AccountDetail";

const data = [
  {
    stt: 1,
    tenDangNhap: "2251172378",
    email: "nva@tlu.com",
    vaiTro: "Admin",
    ngayTao: "20/10/2023",
  },
];

const AccountList = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

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

  return (
    <div className="container">
      {/* Hiển thị form overlay khi showForm = true */}
      {showForm && <AccountForm onClose={handleCloseForm} editData={editingAccount} />}
      
      {/* Hiển thị detail modal khi showDetail = true */}
      {showDetail && <AccountDetail account={selectedAccount} onClose={handleCloseDetail} />}
      
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
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.stt}</td>
              <td>{item.tenDangNhap}</td>
              <td>{item.email}</td>
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
        <div>Hiển thị 100 kết quả</div>
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