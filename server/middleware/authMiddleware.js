const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);


// Accept both payload.id and payload.userId (some tokens use different claim names)
    const userId = payload.id || payload.userId;
    if (!userId) return res.status(401).json({ message: 'Token payload missing user id' });



    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.status !== 'Active') return res.status(403).json({ message: 'User inactive' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = authMiddleware;
