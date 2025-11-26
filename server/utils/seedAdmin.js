require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const run = async () => {
  try {
    await connectDB();
    const adminEmail = 'admin@example.com';
    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Admin@123', salt);

    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: hashed,
      role: 'Admin',
      status: 'Active'
    });
    await admin.save();
    console.log('Initial admin created. Email:', adminEmail, 'Password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
