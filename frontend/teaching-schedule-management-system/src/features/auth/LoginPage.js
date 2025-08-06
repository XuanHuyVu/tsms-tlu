// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/LoginPage.css";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
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

      // Gọi API thật
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Lưu token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Tạo userData từ API response
      const userData = {
        username: data.user?.username || username,
        name: data.user?.name || username,
        role: data.user?.role || "admin"
      };
      
      login(userData);
      navigate("/dashboard");
      
    } catch (error) {
      console.log("Login error:", error);
      setUsernameError("Tên đăng nhập hoặc mật khẩu không đúng");
      setPasswordError("Tên đăng nhập hoặc mật khẩu không đúng");
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
