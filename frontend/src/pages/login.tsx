
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

    try {
      if (isRegister) {
        // ✅ REGISTER
        await api.post("/auth/register", { email, password });
        setIsRegister(false);
        setPassword("");
        alert("Registration successful. Please login.");
      } else {
        // ✅ LOGIN
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);

        document.body.classList.add("page-exit");

        setTimeout(() => {
          onLogin();
          document.body.classList.remove("page-exit");
        }, 400);
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
          <p>
            {isRegister
              ? "Create your account"
              : "Login to manage inventory"}
          </p>
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

        {/* 🔁 TOGGLE */}
        <div className="login-toggle">
          {isRegister ? "Already have an account?" : "New user?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </span>
        </div>
      </div>
    </div>
  );





}

export default Login;







