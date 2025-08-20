import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, admin = false }) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  if (!token) return <Navigate to="/" replace />;
  if (admin && role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
export default ProtectedRoute;

