import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/employees/new"
        element={
          <AdminRoute>
            <EmployeeForm />
          </AdminRoute>
        }
      />
      <Route
        path="/employees/edit/:id"
        element={
          <AdminRoute>
            <EmployeeForm />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
