import React, { useState } from 'react';
import '../styles/Sidebar.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    hocPhan: false,
    giangVien: false,
    lichHoc: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus({ ...openMenus, [menu]: !openMenus[menu] });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>TSMS - TLU</h2>
      </div>
      <ul className="sidebar-menu">
        <li>TRANG CHỦ</li>

        <li onClick={() => toggleMenu('hocPhan')}>
          <div className="menu-item">
            <span>HỌC PHẦN</span>
            <span className="arrow-icon">
              {openMenus.hocPhan ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <ul className={`submenu ${openMenus.hocPhan ? 'open' : ''}`}>
            <li>HỌC PHẦN</li>
            <li>LỚP HỌC PHẦN</li>
          </ul>
        </li>

        <li onClick={() => toggleMenu('giangVien')}>
          <div className="menu-item">
            <span>GIẢNG VIÊN</span>
            <span className="arrow-icon">
              {openMenus.giangVien ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <ul className={`submenu ${openMenus.giangVien ? 'open' : ''}`}>
            <li>DANH SÁCH GIẢNG VIÊN</li>
            <li>LỊCH GIẢNG DẠY</li>
          </ul>
        </li>

        <li onClick={() => toggleMenu('lichHoc')}>
          <div className="menu-item">
            <span>LỊCH HỌC</span>
            <span className="arrow-icon">
              {openMenus.lichHoc ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <ul className={`submenu ${openMenus.lichHoc ? 'open' : ''}`}>
            <li>THỜI KHÓA BIỂU</li>
            <li>LỊCH THAY ĐỔI</li>
          </ul>
        </li>

        <li>HỌC KỲ</li>
        <li>THỐNG KÊ - BÁO CÁO</li>
      </ul>
    </div>
  );
};

export default Sidebar;
