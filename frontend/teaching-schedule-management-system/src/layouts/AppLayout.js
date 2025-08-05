// src/layouts/AppLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar'; 
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* nơi hiển thị nội dung các route con */}
      </div>
    </div>
  );
};

export default AppLayout;
