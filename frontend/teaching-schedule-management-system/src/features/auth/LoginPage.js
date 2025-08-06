// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../styles/LoginPage.css";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    setPasswordError("");
    
    let hasError = false;
    
    // Validate email
    if (!email) {
      setEmailError("Vui lòng nhập email");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email không đúng định dạng");
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
      // Mô phỏng API call đăng nhập
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập dữ liệu user sau khi đăng nhập thành công
      const userData = {
        email: email,
        name: "Admin User",
        role: "admin"
      };
      
      login(userData);
      navigate("/dashboard"); // Chuyển hướng đến dashboard
      
    } catch (error) {
      setEmailError("Email hoặc mật khẩu không đúng");
      setPasswordError("Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
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
                  <label className="form-label" htmlFor="email">Email </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    placeholder="abc@tlu.edu.vn"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <div className="error-container">
                    {emailError && <div className="text-danger small">{emailError}</div>}
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
