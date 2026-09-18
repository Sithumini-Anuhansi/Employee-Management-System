import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const isAdmin = !!localStorage.getItem('adminToken');
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.employees);
    } catch (err) {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/employees/${id}`);
      setMessage(`${name} was deleted.`);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed. Are you logged in as admin?');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <h3>Employee Directory</h3>
        {isAdmin ? (
          <div className="nav-actions">
            <Link to="/employees/new" className="btn-link">+ Add Employee</Link>
            <button onClick={handleAdminLogout}>Logout Admin</button>
          </div>
        ) : (
          <Link to="/admin/login" className="btn-link">Admin Login</Link>
        )}
      </nav>

      <div className="content">
        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.position}</td>
                    <td>{emp.department}</td>
                    <td>${emp.salary.toLocaleString()}</td>
                    <td><span className={`status-badge status-${emp.status}`}>{emp.status}</span></td>
                    {isAdmin && (
                      <td className="actions-cell">
                        <Link to={`/employees/edit/${emp._id}`}>Edit</Link>
                        <button className="link-btn" onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
