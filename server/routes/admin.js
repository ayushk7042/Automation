const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes require auth and admin role
router.use(authMiddleware);
router.use(requireAdmin);

/**
 * POST /api/admin/create-user
 * Body: { name, email, role, tempPassword }
 */
router.post('/create-user', async (req, res) => {
  const { name, email, role, tempPassword } = req.body;
  if (!name || !email || !role || !tempPassword)
    return res.status(400).json({ message: 'Missing fields' });

  if (!['Admin','AM','Finance'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  try {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'User with this email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(tempPassword, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      createdBy: req.user._id,
      mustChangePassword: true   // 👉 NEW
    });

    await newUser.save();

    // 👉 Send email invite
    const sendInviteEmail = require("../utils/sendInviteEmail");
    await sendInviteEmail(email, name, tempPassword);

    res.status(201).json({
      message: 'User created & email sent',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/admin/users
 * Query: ?role=AM
 */
router.get('/users', async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  try {
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/admin/:id/deactivate  -> set status = Inactive
 */
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // prevent admin from deactivating themselves optionally:
    // if (user._id.equals(req.user._id)) return res.status(400).json({ message: 'Cannot deactivate self' });

    user.status = 'Inactive';
    await user.save();
    res.json({ message: 'User deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/admin/:id/activate  -> set status = Active
 */
router.patch('/:id/activate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = 'Active';
    await user.save();
    res.json({ message: 'User activated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/admin/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/admin/:id/reset-password
 * Body: { newPassword }
 */
router.patch('/:id/reset-password', async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: 'newPassword required' });
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
