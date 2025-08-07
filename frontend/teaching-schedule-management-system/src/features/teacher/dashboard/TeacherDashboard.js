import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h2 className="mb-0">
                <i className="fas fa-chalkboard-teacher me-2"></i>
                🏫 HỆ THỐNG GIẢNG VIÊN - TRANG GIẢNG VIÊN 🏫
              </h2>
              <small className="d-block mt-2">Teacher Dashboard - Dành riêng cho Giảng viên</small>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    <h5 className="alert-heading">
                      <i className="fas fa-user-circle me-2"></i>
                      Xin chào Giảng viên: {user?.name || user?.username}!
                    </h5>
                    <p className="mb-2"><strong>🎓 ĐÂY LÀ TRANG DÀNH CHO GIẢNG VIÊN 🎓</strong></p>
                    <p className="mb-0">Chào mừng bạn đến với hệ thống quản lý lịch giảng dạy - Giao diện Giảng viên</p>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Lịch giảng dạy hôm nay */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-day fa-3x text-primary mb-3"></i>
                      <h5 className="card-title">Lịch hôm nay</h5>
                      <p className="card-text text-muted">Xem lịch giảng dạy hôm nay</p>
                      <button className="btn btn-primary">
                        <i className="fas fa-eye me-1"></i>
                        Xem lịch
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lịch tuần này */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-week fa-3x text-success mb-3"></i>
                      <h5 className="card-title">Lịch tuần</h5>
                      <p className="card-text text-muted">Xem lịch giảng dạy tuần này</p>
                      <button className="btn btn-success">
                        <i className="fas fa-calendar me-1"></i>
                        Xem lịch tuần
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quản lý môn học */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <i className="fas fa-book fa-3x text-warning mb-3"></i>
                      <h5 className="card-title">Môn học</h5>
                      <p className="card-text text-muted">Quản lý các môn học giảng dạy</p>
                      <button className="btn btn-warning">
                        <i className="fas fa-edit me-1"></i>
                        Quản lý
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thông báo */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-info">
                    <div className="card-body text-center">
                      <i className="fas fa-bell fa-3x text-info mb-3"></i>
                      <h5 className="card-title">Thông báo</h5>
                      <p className="card-text text-muted">Xem thông báo từ nhà trường</p>
                      <button className="btn btn-info">
                        <i className="fas fa-envelope me-1"></i>
                        Xem thông báo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hồ sơ cá nhân */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-secondary">
                    <div className="card-body text-center">
                      <i className="fas fa-user-edit fa-3x text-secondary mb-3"></i>
                      <h5 className="card-title">Hồ sơ</h5>
                      <p className="card-text text-muted">Cập nhật thông tin cá nhân</p>
                      <button className="btn btn-secondary">
                        <i className="fas fa-user me-1"></i>
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>

                {/* Báo cáo */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-dark">
                    <div className="card-body text-center">
                      <i className="fas fa-chart-bar fa-3x text-dark mb-3"></i>
                      <h5 className="card-title">Báo cáo</h5>
                      <p className="card-text text-muted">Xem báo cáo giảng dạy</p>
                      <button className="btn btn-dark">
                        <i className="fas fa-chart-line me-1"></i>
                        Xem báo cáo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thống kê nhanh */}
              <div className="row mt-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <i className="fas fa-chart-pie me-2"></i>
                    Thống kê nhanh
                  </h5>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-calendar fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">5</h4>
                          <small>Lớp hôm nay</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-book fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">12</h4>
                          <small>Môn học</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-users fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">240</h4>
                          <small>Sinh viên</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-clock fa-2x me-3"></i>
                        <div>
                          <h4 className="mb-0">48</h4>
                          <small>Giờ/tuần</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông báo phân biệt role */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="alert alert-success text-center">
                    <h4>
                      <i className="fas fa-graduation-cap me-2"></i>
                      BẠN ĐANG SỬ DỤNG TRANG DÀNH CHO GIẢNG VIÊN
                      <i className="fas fa-graduation-cap ms-2"></i>
                    </h4>
                    <p className="mb-2">
                      <strong>Role: Teacher (Giảng viên)</strong> | 
                      <strong> User: {user?.username}</strong> | 
                      <strong> Tên: {user?.name || 'Chưa cập nhật'}</strong>
                    </p>
                    <p className="mb-0 text-muted">
                      Đây là giao diện quản lý lịch giảng dạy dành riêng cho các giảng viên của trường
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
