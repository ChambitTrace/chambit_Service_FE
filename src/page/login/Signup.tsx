import type React from "react";
import { useState } from "react";
import { useSignup } from "../../hook/auth/auth";
import { useNavigate } from "react-router-dom";
import "./LoginFormStyle.css";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordFormatError, setPasswordFormatError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading, error } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormatError || passwordMatchError) return;
    try {
      await signup({ email: formData.email, password: formData.password });
      navigate("/");
    } catch {
      // no-op; error state is already set in the hook
    }
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
              <h1 className="login-title">회원가입</h1>
              <p className="login-description">
                계정을 생성하여 서비스를 이용하세요
              </p>
            </div>
          </div>

          <div className="login-content">
            <form onSubmit={handleSubmit} className="login-form">
              {/* 이메일 입력창 */}
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  이메일
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, password: value });
                      const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
                      setPasswordFormatError(!regex.test(value));
                    }}
                    className={
                      passwordFormatError
                        ? "input-field password-input error"
                        : "input-field password-input"
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? "👀" : "🕶️"}
                  </button>
                </div>
                {passwordFormatError && (
                  <p className="error-text">
                    비밀번호는 5자 이상이며 영문 대소문자, 숫자, 특수문자를 모두
                    포함해야 합니다.
                  </p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  비밀번호 확인
                </label>
                <div className="password-container">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        confirmPassword: value,
                      });
                      setPasswordMatchError(value !== formData.password);
                    }}
                    className={
                      passwordMatchError
                        ? "input-field password-input error"
                        : "input-field password-input"
                    }
                    required
                  />
                </div>
                {passwordMatchError && (
                  <p className="error-text">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}

              {/* 회원가입 버튼 */}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </form>

            {/* 회원가입 링크 */}
            <div className="signup-link">
              <p>
                이미 계정이 있으신가요?
                <a href="/login" className="signup-anchor">
                  로그인
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
