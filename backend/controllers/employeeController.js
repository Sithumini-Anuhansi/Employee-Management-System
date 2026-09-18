const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

// @route   GET /api/employees
// @access  Public (read access does not require authentication)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: employees.length, employees });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error fetching employees', error: err.message });
  }
};

// @route   GET /api/employees/:id
// @access  Public
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    return res.status(200).json({ success: true, employee });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format' });
    }
    return res.status(500).json({ success: false, message: 'Server error fetching employee', error: err.message });
  }
};

// @route   POST /api/employees
// @access  Private (admin only)
exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const existing = await Employee.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An employee with this email already exists' });
    }

    const employee = await Employee.create(req.body);
    return res.status(201).json({ success: true, message: 'Employee created successfully', employee });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error creating employee', error: err.message });
  }
};

// @route   PUT /api/employees/:id
// @access  Private (admin only)
exports.updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    return res.status(200).json({ success: true, message: 'Employee updated successfully', employee });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format' });
    }
    return res.status(500).json({ success: false, message: 'Server error updating employee', error: err.message });
  }
};

// @route   DELETE /api/employees/:id
// @access  Private (admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    return res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format' });
    }
    return res.status(500).json({ success: false, message: 'Server error deleting employee', error: err.message });
  }
};
