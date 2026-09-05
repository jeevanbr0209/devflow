import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.reload();
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <h1>DevFlow</h1>
        </div>

        <p className="login-subtitle">
          Developer project workspace
        </p>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome back</h2>

          <p>
            Sign in to access your workspace
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In →
          </button>
        </form>

        {/* Error / Success Message */}
        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        {/* Register */}
        <p className="login-footer">
          Don't have an account?{" "}
          <span className="register-link">
            Create one
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;