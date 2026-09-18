import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  position: '',
  department: '',
  salary: '',
  status: 'active'
};

// Handles both "create" (no :id param) and "edit" (:id present) flows.
const EmployeeForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      api.get(`/employees/${id}`)
        .then((res) => {
          const e = res.data.employee;
          setForm({
            firstName: e.firstName,
            lastName: e.lastName,
            email: e.email,
            position: e.position,
            department: e.department,
            salary: e.salary,
            status: e.status
          });
        })
        .catch(() => setError('Could not load employee data.'));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = { ...form, salary: Number(form.salary) };
    try {
      if (isEditMode) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Save failed. Are you logged in as admin?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <h3>{isEditMode ? 'Edit Employee' : 'Add Employee'}</h3>
      </nav>
      <div className="content">
        <form className="employee-form" onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}
          <div className="form-grid">
            <div>
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Position</label>
              <input name="position" value={form.position} onChange={handleChange} required />
            </div>
            <div>
              <label>Department</label>
              <input name="department" value={form.department} onChange={handleChange} required />
            </div>
            <div>
              <label>Salary</label>
              <input type="number" min="0" name="salary" value={form.salary} onChange={handleChange} required />
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/employees')}>Cancel</button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
