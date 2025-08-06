import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
        <li>
          <NavLink to="/" className="menu-link">TRANG CHỦ</NavLink>
        </li>

        <li onClick={() => toggleMenu('hocPhan')}>
          <div className="menu-item">
            <span>HỌC PHẦN</span>
            <span className="arrow-icon">
              {openMenus.hocPhan ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          <ul className={`submenu ${openMenus.hocPhan ? 'open' : ''}`}>
            <li><NavLink to="/hoc-phan" className="submenu-link">HỌC PHẦN</NavLink></li>
            <li><NavLink to="/lop-hoc-phan" className="submenu-link">LỚP HỌC PHẦN</NavLink></li>
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
            <li><NavLink to="/giang-vien" className="submenu-link">DANH SÁCH GIẢNG VIÊN</NavLink></li>
            <li><NavLink to="/lich-giang-day" className="submenu-link">LỊCH GIẢNG DẠY</NavLink></li>
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
            <li><NavLink to="/tkb" className="submenu-link">THỜI KHÓA BIỂU</NavLink></li>
            <li><NavLink to="/lich-thay-doi" className="submenu-link">LỊCH THAY ĐỔI</NavLink></li>
          </ul>
        </li>

        <li>
          <NavLink to="/hoc-ky" className="menu-link">HỌC KỲ</NavLink>
        </li>
        <li>
          <NavLink to="/thong-ke" className="menu-link">THỐNG KÊ - BÁO CÁO</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
