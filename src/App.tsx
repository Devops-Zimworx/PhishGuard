import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/variants.css';
import './styles/qr-generator.css';
import { WifiRoute } from './components/WifiRoute';
import { SuccessRoute } from './components/SuccessRoute';
import { AdminRoute } from './components/AdminRoute';
import { GenerateRoute } from './components/GenerateRoute';
import { AdminLogin } from './components/AdminLogin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from './components/NotFound';

function App() {
  return (
    <Routes>
      {/* I'm setting up the root route to redirect to /wifi for the landing page. */}
      <Route path="/" element={<Navigate to="/wifi" replace />} />
      
      {/* I'm setting up the WiFi portal route that handles both / and /wifi paths. */}
      <Route path="/wifi" element={<WifiRoute />} />
      
      {/* I'm setting up the success page route for after form submission. */}
      <Route path="/success" element={<SuccessRoute />} />
      
      {/* I'm setting up the admin login route. */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* I'm protecting the admin dashboard route with authentication. */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute />
          </ProtectedRoute>
        }
      />
      
      {/* I'm protecting the QR generator route with authentication. */}
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <GenerateRoute />
          </ProtectedRoute>
        }
      />
      
      {/* I'm setting up a catch-all route for 404 errors. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
