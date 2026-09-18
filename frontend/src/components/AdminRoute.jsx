import { Navigate } from 'react-router-dom';

// Guards admin-only pages (like the create/edit form) by checking for a
// stored admin JWT. Unauthenticated users are redirected to admin login.
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;
