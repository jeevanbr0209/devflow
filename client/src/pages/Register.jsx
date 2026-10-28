
import { useState } from "react";

function Register({ onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage("Account created successfully! Please log in.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Cannot connect to server. Check your backend.");
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
          <h2>Create your account</h2>
          <p>Start managing your development projects</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        {message && (
          <p className="login-message" role="status">
            {message}
          </p>
        )}

        <p className="login-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="register-link"
            onClick={onBackToLogin}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
