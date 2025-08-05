import type React from "react"
import "./LoginForm.css"

export default function LoginForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // In a real application, you would handle authentication here
    console.log("Sign in form submitted!")
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Placeholder for your logo */}
        <div className="logo-placeholder">
          {/* Replace this div with your actual logo component or image */}
          Your Logo Here
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
              type="password" // Use type="password" for password fields
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
