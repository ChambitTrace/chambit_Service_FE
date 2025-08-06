import type React from "react"
import "./LoginFormStyle.css"

export default function LoginForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Sign in form submitted!")
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="logo-placeholder">
          <h2>
            [ Logo ]
          </h2>
        </div>

        <h1 className="form-title">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="id-input" className="form-label">
              ID
            </label>
            <input id="id-input" name="id" type="text" required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="pw-input" className="form-label">
              PW
            </label>
            <input
              id="pw-input"
              name="password"
              type="password"
              required
              className="form-input"
            />
          </div>

          <div>
            <button type="submit" className="sign-in-button">
              Sign in
            </button>
          </div>
        </form>

        <div className="signup-text-container">
          No account?{" "}
          <a href="#" className="signup-link">
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
