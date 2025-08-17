import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faBell, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';
import avatar from '../assets/images/avt.jpg';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'TRANG CHỦ';
      case '/dashboard':
        return 'TRANG CHỦ';
      case '/teachers':
        return 'QUẢN LÝ GIẢNG VIÊN'
      case '/semesters':
        return 'QUẢN LÝ HỌC KỲ';
      case '/rooms':
        return 'QUẢN LÝ PHÒNG HỌC';
      case '/subjects':
        return 'QUẢN LÝ MÔN HỌC';
      case '/schedulechanges':
        return 'QUẢN LÝ LỊCH THAY ĐỔI';
      case '/class-sections':
        return 'QUẢN LÝ LỚP HỌC PHẦN';
      case '/majors':
        return 'QUẢN LÝ NGÀNH HỌC';
      case '/faculties':
        return 'QUẢN LÝ KHOA';
      case '/departments':
        return 'QUẢN LÝ BỘ MÔN';
      case '/student-class-sections':
        return 'QUẢN LÝ HỌC PHẦN ĐÃ ĐĂNG KÝ';
      case '/accounts':
        return 'QUẢN LÝ TÀI KHOẢN';
      case '/teaching-schedules':
        return 'QUẢN LÝ LỊCH GIẢNG DẠY';
      default:
        return 'QUẢN LÝ HỆ THỐNG';
    }
  };

  const handleLogout = () => {
    logout(); // Sử dụng logout từ AuthContext
    navigate('/login'); // Chuyển về trang login
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-container">
      <div className="header-bar">
        <div className="header-menu-btn">
          <button className="menu-btn-square">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <span className="header-title">{getPageTitle(location.pathname)}</span>

        <div className="header-right">
          <div className="header-bell">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <span className="notification-dot"></span>
          </div>

          <div className="header-user-wrapper" ref={dropdownRef}>
            <div className="header-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={avatar} alt="User Avatar" className="header-avatar" />
              <div className="header-user-info">
                <span className="header-user-name">Nguyễn Văn A</span>
                <span className="header-user-role">Quản trị viên</span>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Thông tin tài khoản</span>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faCog} />
                  <span>Cài đặt thông báo</span>
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
