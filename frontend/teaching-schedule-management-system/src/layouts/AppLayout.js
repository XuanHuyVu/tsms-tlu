import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../features/admin/dashboard/Dashboard';

function AppLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Thêm các route khác ở đây sau */}
        </Routes>
      </div>
    </div>
  );
}

export default AppLayout;
