import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    if (!headerRef.current || !formRef.current) {
      return;
    }

    const headerWidth = headerRef.current.getBoundingClientRect().width;
    const formWidth = formRef.current.getBoundingClientRect().width;

    console.log("[AdminLogin] layout width probe", {
      headerWidth,
      formWidth,
      widthDelta: formWidth - headerWidth,
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(
          signInError.message || "Invalid credentials. Please try again."
        );
        setLoading(false);
        return;
      }

      // Successfully signed in, navigate to admin dashboard
      navigate("/admin", { replace: true });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login">
      <div className="admin-login__card">
        <header ref={headerRef}>
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the dashboard.</p>
        </header>

        <form ref={formRef} onSubmit={handleSubmit}>
          {error && <div className="admin-login__error">{error}</div>}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
              disabled={loading}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
