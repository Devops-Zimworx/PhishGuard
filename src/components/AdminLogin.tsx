import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/env';

const AUTH_STORAGE_KEY = 'phishguard_admin_auth';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const env = getEnv();
    const expectedPassword = env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      setError('Admin password is not configured. Please set VITE_ADMIN_PASSWORD in your environment.');
      return;
    }

    if (password === expectedPassword) {
      // I'm storing the auth state in localStorage for persistence across page reloads.
      localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <section className="admin-login">
      <header>
        <h1>Admin Login</h1>
        <p>Enter the admin password to access the dashboard.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            autoFocus
          />
        </label>

        {error && <div className="admin-login__error">{error}</div>}

        <button type="submit">Login</button>
      </form>
    </section>
  );
}

// I'm exporting a utility function to check if the user is authenticated.
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
}

// I'm exporting a utility function to clear authentication.
export function clearAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export default AdminLogin;


