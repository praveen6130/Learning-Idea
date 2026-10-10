import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, getUserById, getUserByEmail, getUserByEmailAndPhone, createUser, updateUser, logActivity } from '../db.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user (Starts as 'pending' awaiting host or admin approval)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role = 'student', bio = '' } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ 
        error: 'MISSING_FIELDS', 
        message: 'Name, email, phone number, and password are all required.' 
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    if (password.length < 6) {
      return res.status(400).json({
        error: 'PASSWORD_TOO_SHORT',
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existing = getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ 
        error: 'EMAIL_EXISTS', 
        message: 'An account with this email already exists. Please log in or use Forgot Password.' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // New registrations are pending approval
    const newUser = {
      id: `user-${uuidv4().slice(0, 8)}`,
      name: name.trim(),
      email: cleanEmail,
      phoneNumber: cleanPhone,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'student',
      status: 'pending', // PENDING APPROVAL
      bio: bio ? bio.trim() : `Learner interested in AI and skill development.`,
      createdAt: new Date().toISOString(),
      assignedCourses: []
    };

    createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, status: newUser.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;

    res.status(201).json({
      message: 'Registration submitted successfully! Your account is pending approval.',
      token,
      user: safeUser,
      requiresApproval: true
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({ 
        error: 'USER_NOT_FOUND', 
        message: `The email "${cleanEmail}" is not registered yet. Please register first and then try to login.` 
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        error: 'INVALID_PASSWORD', 
        message: 'Incorrect password. If you forgot your password, click "Forgot Password?" below to reset it using your phone number.' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
      isApproved: user.status === 'approved' || user.role === 'host'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Login failed. Please try again.' });
  }
});

// Forgot / Reset Password via Phone Number
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, phoneNumber, newPassword } = req.body;

    if (!email || !phoneNumber || !newPassword) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'Email address, registered phone number, and new password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'PASSWORD_TOO_SHORT',
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = getUserByEmailAndPhone(cleanEmail, cleanPhone);
    if (!user) {
      return res.status(404).json({
        error: 'VERIFICATION_FAILED',
        message: 'Verification failed: No account matches both this email and registered phone number. Please check and try again.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    updateUser(user.id, { passwordHash });
    logActivity('PASSWORD_RESET', `Password was reset via phone verification for ${user.name} (${user.email}).`);

    res.json({
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to reset password. Please try again.' });
  }
});

// Current user profile
router.get('/me', authenticateToken, (req, res) => {
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({
    user: safeUser,
    isApproved: safeUser.status === 'approved' || safeUser.role === 'host'
  });
});

// Switch persona (Reserved only for testing Host view)
router.post('/switch-persona', async (req, res) => {
  try {
    const { persona } = req.body;

    let targetEmail = 'host@learningidea.com';
    if (persona === 'student-approved') targetEmail = 'alex.student@learningidea.com';
    if (persona === 'student-pending') targetEmail = 'sarah.jenkins@learningidea.com';
    if (persona === 'admin-pending') targetEmail = 'marcus.vance@learningidea.com';

    const user = getUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ error: 'PERSONA_NOT_FOUND', message: 'Persona not found' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      message: `Switched to ${safeUser.name}`,
      token,
      user: safeUser,
      isApproved: safeUser.status === 'approved' || safeUser.role === 'host'
    });
  } catch (err) {
    console.error('Persona switch error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Persona switch failed' });
  }
});

export default router;
