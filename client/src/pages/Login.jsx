
import { useState } from "react";

function Login({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>DevFlow</h1>
        </div>

        <p className="login-subtitle">
          Developer project workspace
        </p>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to access your workspace</p>
        </div>

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
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        {message && (
          <p className="login-message">{message}</p>
        )}

        <p className="login-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="register-link"
            onClick={onRegister}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
