// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/LoginPage.css";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/AccountApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setUsernameError("");
    setPasswordError("");
    
    let hasError = false;
    
    // Validate username - chỉ kiểm tra có rỗng không
    if (!username) {
      setUsernameError("Vui lòng nhập tên đăng nhập");
      hasError = true;
    }
    
    // Validate password
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsLoading(true);
    
    try {
      console.log("=== LOGIN DEBUG ===");
      console.log("Username:", username);
      console.log("Password:", password);

      // Sử dụng AccountApi thay vì fetch trực tiếp
      const data = await authApi.login({
        username: username,
        password: password
      });

      // Lưu token
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log("✅ Token saved to localStorage:", data.token);
      } else {
        console.log("❌ No token in API response");
        // Tạo fake token cho test
        const fakeToken = 'fake-token-' + Date.now();
        localStorage.setItem('token', fakeToken);
        console.log("🔧 Created fake token for testing:", fakeToken);
      }

      // Tạo userData từ API response
      const apiRole = data.user?.role || "admin";
      
      console.log("=== ROLE NORMALIZATION DEBUG ===");
      console.log("Original API role:", apiRole);
      
      // Normalize role values from backend
      let normalizedRole = apiRole;
      
      console.log("Before normalization check - apiRole:", apiRole);
      console.log("apiRole type:", typeof apiRole);
      console.log("apiRole length:", apiRole?.length);
      console.log("apiRole JSON:", JSON.stringify(apiRole));
      console.log("apiRole === 'ROLE_TEACHER':", apiRole === 'ROLE_TEACHER');
      console.log("apiRole.trim() === 'ROLE_TEACHER':", apiRole?.trim() === 'ROLE_TEACHER');
      
      // Force normalize for debugging
      if (apiRole && (apiRole.includes('TEACHER') || apiRole.includes('Teacher'))) {
        normalizedRole = 'Teacher';
        console.log("🔧 FORCED normalization to Teacher due to TEACHER/Teacher in role");
      } else if (apiRole && (apiRole.includes('ADMIN') || apiRole.includes('Admin'))) {
        normalizedRole = 'Admin';
        console.log("🔧 FORCED normalization to Admin due to ADMIN/Admin in role");
      } else if (apiRole && (apiRole.includes('STUDENT') || apiRole.includes('Student'))) {
        normalizedRole = 'Student';
        console.log("🔧 FORCED normalization to Student due to STUDENT/Student in role");
      } else {
        switch (apiRole) {
          case 'ROLE_ADMIN':
            normalizedRole = 'Admin';
            console.log("✅ Normalized to Admin");
            break;
          case 'ROLE_TEACHER':
          case 'ROLE_Teacher': // Handle both cases
            normalizedRole = 'Teacher';
            console.log("✅ Normalized to Teacher");
            break;
          case 'ROLE_STUDENT':
            normalizedRole = 'Student';
            console.log("✅ Normalized to Student");
            break;
          default:
            console.log("⚠️ No normalization applied, keeping:", apiRole);
        }
      }
      
      console.log("Normalized role:", normalizedRole);
      
      const userData = {
        username: data.user?.username || username,
        name: data.user?.name || username,
        role: normalizedRole
      };
      
      console.log("Final userData:", userData);
      
      login(userData);
      
      // Điều hướng dựa trên role
      console.log("=== NAVIGATION DEBUG ===");
      console.log("Checking role for navigation:", userData.role);
      
      if (userData.role === 'Admin') {
        console.log("🔄 Navigating to admin dashboard...");
        navigate("/dashboard"); // Admin vào dashboard quản trị
      } else if (userData.role === 'Teacher') {
        console.log("🔄 Navigating to teacher-dashboard...");
        navigate("/teacher-dashboard"); // Teacher vào dashboard giảng viên
      } else if (userData.role === 'Student') {
        console.log("🔄 Navigating to student-dashboard...");
        navigate("/student-dashboard"); // Student vào dashboard sinh viên
      } else {
        console.log("🔄 Navigating to default dashboard...");
        navigate("/dashboard"); // Default fallback
      }
      
      console.log(`✅ Login successful, role: ${userData.role} (original: ${apiRole})`);
      
    } catch (error) {
      console.log("=== LOGIN ERROR DEBUG ===");
      console.log("Error object:", error);
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      
      let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
      
      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 401:
            errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
            break;
          case 403:
            errorMessage = "Tài khoản bị khóa hoặc không có quyền truy cập";
            break;
          case 500:
            errorMessage = "Lỗi server, vui lòng thử lại sau";
            break;
          default:
            errorMessage = `Lỗi ${error.response.status}: ${error.response.data?.message || 'Không thể đăng nhập'}`;
        }
      } else if (error.message.includes('Network Error')) {
        errorMessage = "Không thể kết nối đến server";
      }
      
      setUsernameError(errorMessage);
      setPasswordError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    // Clear error when user starts typing
    if (usernameError) {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
  };

  // Nếu đã đăng nhập, hiển thị thông báo và nút vào dashboard
  if (isLoggedIn) {
    return (
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            {/* Bên trái là hình ảnh */}
            <div className="col-md-6 col-lg-6 col-xl-6 d-flex justify-content-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid w-75"
                alt="Login"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>

            {/* Bên phải là thông báo đã đăng nhập */}
            <div className="col-md-6 col-lg-5 col-xl-4 offset-xl-1">
              <div className="card p-4 shadow rounded-3">
                <h4 className="text-center mb-4">TSMS TLU</h4>
                
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="fas fa-user-check text-success" style={{ fontSize: "48px" }}></i>
                  </div>
                  <h5 className="text-success mb-2">Đã đăng nhập thành công!</h5>
                  <p className="text-muted mb-1">Xin chào <strong>{user?.fullName || user?.username}</strong></p>
                  <p className="text-muted small">Vai trò: <span className="badge bg-primary">{user?.role || 'User'}</span></p>
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleGoToDashboard}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Vào Dashboard
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Đăng xuất
                  </button>
                </div>

                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "14px" }}>
                  © 2025 Trường Đại học Thủy Lợi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          {/* Bên trái là hình ảnh */}
          <div className="col-md-6 col-lg-6 col-xl-6 d-flex justify-content-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid w-75"
              alt="Login"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>

          {/* Bên phải là thẻ đăng nhập nằm giữa */}
          <div className="col-md-6 col-lg-5 col-xl-4 offset-xl-1">
            <div className="card p-4 shadow rounded-3">
              <h4 className="text-center mb-1">TSMS TLU</h4>

              {/* Remove general error alert since we have individual field errors */}

              <form onSubmit={handleLogin} noValidate>
                <div className="form-outline mb-2">
                  <label className="form-label" htmlFor="username">Tên đăng nhập</label>
                  <input
                    type="text"
                    id="username"
                    className={`form-control ${usernameError ? "is-invalid" : ""}`}
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  <div className="error-container">
                    {usernameError && <div className="text-danger small">{usernameError}</div>}
                  </div>
                </div>

                <div className="form-outline mb-2">
                  <label className="form-label" htmlFor="password">Mật khẩu</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`form-control ${passwordError ? "is-invalid" : ""}`}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <span
                      className={`input-group-text bg-white px-3 ${passwordError ? "border-danger" : ""}`}
                      style={{ cursor: "pointer", borderLeft: "none" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash" }`}></i>
                    </span>
                  </div>
                  <div className="error-container">
                    {passwordError && <div className="text-danger small">{passwordError}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-link text-primary p-0" 
                    onClick={() => {/* TODO: Xử lý quên mật khẩu */}}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </div>

                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "14px" }}>
                  © 2025 Trường Đại học Thủy Lợi
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
