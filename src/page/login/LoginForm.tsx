import type React from "react";
import { useState } from "react";
import "./LoginFormStyle.css";
import { useLogin, oauthLogin } from "../../hook/auth/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: formData.id, password: formData.password });
      navigate("/dashboard"); // 로그인 성공 시 대시보드로 이동
    } catch {
      // error state handled by hook
    }
  };

  const handleGoogleLogin = () => {
    oauthLogin();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            {/* 로고 */}
            <div className="logo-container">
              <div className="logo">
                <img src="/logo-no-back.png" alt="logo" />
              </div>
            </div>

            <div className="header-text">
              <h1 className="login-title">로그인</h1>
              <p className="login-description">
                계정에 로그인하여 서비스를 이용하세요
              </p>
            </div>
          </div>

          <div className="login-content">
            <form onSubmit={handleSubmit} className="login-form">
              {/* ID 입력창 */}
              <div className="input-group">
                <label htmlFor="id" className="input-label">
                  아이디
                </label>
                <input
                  id="id"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              {/* 비밀번호 입력창 */}
              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  비밀번호
                </label>
                <div className="password-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="input-field password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? "👀" : "🕶️"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}

              {/* 로그인 버튼 */}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {/* 구분선 */}
            <div className="divider">
              <hr></hr>
              <span className="divider-text">또는</span>
              <hr></hr>
            </div>

            {/* 구글 로그인 버튼 */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-button"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 로그인
            </button>

            {/* 회원가입 링크 */}
            <div className="signup-link">
              <p>
                계정이 없으신가요?{" "}
                <a href="/signup" className="signup-anchor">
                  회원가입
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
