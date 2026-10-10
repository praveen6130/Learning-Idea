import jwt from 'jsonwebtoken';
import { getUserById } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ai_learning_super_secret_key_2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Authentication token is missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'TOKEN_INVALID', message: 'Token is invalid or expired' });
    }

    const user = getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User record not found' });
    }

    // Attach up-to-date user object
    req.user = user;
    next();
  });
};

// Gatekeeper: Only approved users are allowed to use the website's features
export const requireApproved = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Authentication required' });
  }

  // Host is always approved
  if (req.user.role === 'host') {
    return next();
  }

  if (req.user.status !== 'approved') {
    return res.status(403).json({
      error: 'APPROVAL_REQUIRED',
      status: req.user.status,
      message: 'Access restricted: You cannot use this website until the Admin or Host explicitly approves your account.',
      requestedRole: req.user.role
    });
  }

  next();
};

// Require Admin or Host
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Authentication required' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'host') {
    return res.status(403).json({
      error: 'ADMIN_ACCESS_REQUIRED',
      message: 'Admin or Host privileges are required to access this resource.'
    });
  }

  // Admins also need to be approved unless they are the host
  if (req.user.role !== 'host' && req.user.status !== 'approved') {
    return res.status(403).json({
      error: 'APPROVAL_REQUIRED',
      status: req.user.status,
      message: 'Your administrator application is pending Host approval.'
    });
  }

  next();
};

// Require supreme Host privileges
export const requireHost = (req, res, next) => {
  if (!req.user || req.user.role !== 'host') {
    return res.status(403).json({
      error: 'HOST_REQUIRED',
      message: 'This operation is reserved strictly for the Platform Host.'
    });
  }
  next();
};
