const express = require('express');
const { body } = require('express-validator');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protectAdmin } = require('../middleware/auth');

const router = express.Router();

const employeeValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number')
];

// Public read routes
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);

// Admin-only write routes
router.post('/', protectAdmin, employeeValidation, createEmployee);
router.put('/:id', protectAdmin, employeeValidation, updateEmployee);
router.delete('/:id', protectAdmin, deleteEmployee);

module.exports = router;
