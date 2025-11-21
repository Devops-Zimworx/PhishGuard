import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="not-found">
      <header>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </header>
      <div>
        <Link to="/">Return to Home</Link>
      </div>
    </section>
  );
}

export default NotFound;


