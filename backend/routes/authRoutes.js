const express = require('express');
const { body } = require('express-validator');
const { loginAdmin } = require('../controllers/authController');

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/login
router.post('/login', loginValidation, loginAdmin);

module.exports = router;
