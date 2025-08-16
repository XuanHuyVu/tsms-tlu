// src/features/auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/LoginPage.css";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/AccountApi";
import axiosInstance from "../../api/axiosInstance";

// Chuẩn hoá role từ backend: ROLE_ADMIN, TEACHER, STUDENT
const normalizeRole = (rawRole) => {
  const r = String(rawRole || "").trim().toUpperCase();
  if (r === "ROLE_ADMIN" || r.includes("ADMIN")) return "Admin";
  if (r === "TEACHER" || r.includes("TEACHER")) return "Teacher";
  if (r === "STUDENT" || r.includes("STUDENT")) return "Student";
  return "User";
};

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

  // Nếu đã đăng nhập, tự điều hướng theo role (optional)
  useEffect(() => {
    if (isLoggedIn && user?.role) {
      const role = user.role;
      if (role === "Admin") navigate("/dashboard");
      else if (role === "Teacher") navigate("/teacher-dashboard");
      else if (role === "Student") navigate("/student-dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset lỗi
    setUsernameError("");
    setPasswordError("");

    if (!username) {
      setUsernameError("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);
    try {
      // Xoá token cũ để interceptor không gắn vào /auth/login
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers?.common?.Authorization;

      // Gọi API đăng nhập
      const data = await authApi.login({ username, password });
      // Expect:
      // { token: "xxx", user: { id: 1, username: "admin", role: "ROLE_ADMIN" | "TEACHER" | "STUDENT" } }

      // Lưu token & set default header cho các request tiếp theo
      let token = data?.token;
      if (!token) {
        token = "fake-token-" + Date.now(); // fallback để debug
        console.warn("API không trả token, tạm dùng:", token);
      }
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Chuẩn hoá role & dựng userData
      const role = normalizeRole(data?.user?.role);
      const userData = {
        id: data?.user?.id ?? null,
        username: data?.user?.username ?? username,
        // UI dùng fullName/name/username — điền đủ để tránh undefined
        name: data?.user?.name ?? data?.user?.username ?? username,
        fullName: data?.user?.fullName ?? data?.user?.name ?? data?.user?.username ?? username,
        role,
        rawRole: data?.user?.role ?? null, // giữ để debug
      };

      // Lưu vào AuthContext (+ localStorage trong context)
      login(userData, rememberMe);

      // Điều hướng theo role
      if (role === "Admin") navigate("/dashboard");
      else if (role === "Teacher") navigate("/teacher-dashboard");
      else if (role === "Student") navigate("/student-dashboard");
      else navigate("/dashboard");
    } catch (error) {
      const status = error?.response?.status;
      const backendMsg = error?.response?.data?.message || error?.response?.data?.error || "";

      let errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
      if (status === 403) errorMessage = backendMsg || "Không có quyền truy cập (403).";
      else if (status === 401) errorMessage = backendMsg || "Sai thông tin đăng nhập (401).";
      else if (status === 500) errorMessage = backendMsg || "Lỗi server, vui lòng thử lại sau (500).";
      else if (status) errorMessage = backendMsg || `Lỗi ${status}: Không thể đăng nhập`;
      else if ((error?.message || "").includes("Network Error")) errorMessage = "Không thể kết nối đến server";

      setUsernameError(errorMessage);
      setPasswordError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (usernameError) setUsernameError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handleGoToDashboard = () => navigate("/dashboard");
  const handleLogout = () => logout();

  // Đã đăng nhập → hiển thị trạng thái
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
                  <p className="text-muted mb-1">
                    Xin chào <strong>{user?.fullName || user?.name || user?.username}</strong>
                  </p>
                  <p className="text-muted small">
                    Vai trò: <span className="badge bg-primary">{user?.role || "User"}</span>
                  </p>
                  {user?.id != null && (
                    <p className="text-muted small mb-0">User ID: <code>{user.id}</code></p>
                  )}
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button type="button" className="btn btn-primary" onClick={handleGoToDashboard}>
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Vào Dashboard
                  </button>

                  <button type="button" className="btn btn-outline-secondary" onClick={handleLogout}>
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

  // Form đăng nhập
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

          {/* Bên phải là thẻ đăng nhập */}
          <div className="col-md-6 col-lg-5 col-xl-4 offset-xl-1">
            <div className="card p-4 shadow rounded-3">
              <h4 className="text-center mb-1">TSMS TLU</h4>

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
                      <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
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
                    onClick={() => {}}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
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
