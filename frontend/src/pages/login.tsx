import { useState, useRef } from "react";
import api from "../services/api";
import "./login.css";
import gsap from "gsap";

function Login({ onLogin }: { onLogin: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      email: email.toLowerCase().trim(),
      password: password,
    };

    try {
      if (isRegister) {
        await api.post("/auth/register", payload);
        setIsRegister(false);
        setPassword("");
        alert("Registration successful. Please login.");
      } else {
        const res = await api.post("/auth/login", payload);

        // 🔐 SAVE TOKEN FIRST (CRITICAL)
        localStorage.setItem("token", res.data.token);
        console.log("TOKEN SAVED:", res.data.token);

        // ✅ Navigate immediately (NO delay)
        onLogin();
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (isRegister ? "Registration failed" : "Invalid credentials")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" ref={cardRef}>
        <div className="login-header">
          <h1>🍬 Sweet Shop</h1>
          <p>{isRegister ? "Create your account" : "Login to manage inventory"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <div className="error-box">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="login-toggle">
          {isRegister ? "Already have an account?" : "New user?"}{" "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setPassword("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
