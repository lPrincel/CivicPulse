const User = require('../models/User');

/**
 * @desc   Register a new user (Citizen or Admin)
 * @route  POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.'
      });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'citizen';
    const assignedDepartment = assignedRole === 'admin' 
      ? (department || 'Emergency Dispatch')
      : 'Community Resident';

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: assignedRole,
      department: assignedDepartment
    });

    user.setPassword(password);
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      ...user.toAuthJSON()
    });
  } catch (error) {
    console.error(`[Register Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error during registration.'
    });
  }
};

/**
 * @desc   Login user
 * @route  POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = user.verifyPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      ...user.toAuthJSON()
    });
  } catch (error) {
    console.error(`[Login Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error during login.'
    });
  }
};

/**
 * @desc   Get current logged-in user
 * @route  GET /api/auth/me
 * @access Private (via Bearer token)
 */
const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = User.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authorization token.'
      });
    }

    const user = await User.findById(decoded.id).select('-passwordHash -salt');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(`[getMe Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to authenticate user.'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};

