import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, getStats, getLogs, logActivity, getCourses } from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth + admin guard to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get list of all users with optional filtering
router.get('/users', (req, res) => {
  try {
    const { status, role, search } = req.query;
    let users = getUsers();

    // Map out safe user objects (strip passwordHash)
    users = users.map(({ passwordHash, ...safe }) => safe);

    if (status && status !== 'all') {
      users = users.filter((u) => u.status === status);
    }
    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u) => 
        (u.name && u.name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phoneNumber && u.phoneNumber.includes(q))
      );
    }

    res.json({ users });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to retrieve users' });
  }
});

// Approve user (Both Admin and Host can approve students; ONLY Host can approve Admins!)
router.post('/users/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // optional override role: 'student' | 'admin'

    const targetUser = getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
    }

    if (targetUser.role === 'host') {
      return res.status(400).json({ error: 'FORBIDDEN', message: 'Cannot modify host status' });
    }

    const assignedRole = role || targetUser.role;

    // RULE: Approve Admin ONLY by Host!
    if (assignedRole === 'admin' && req.user.role !== 'host') {
      return res.status(403).json({
        error: 'HOST_REQUIRED',
        message: 'Permission denied: Only the Platform Host can approve Administrator accounts. Instructors/Admins may only approve Students.'
      });
    }

    const updates = {
      status: 'approved',
      role: assignedRole,
      approvedAt: new Date().toISOString(),
      approvedBy: `${req.user.name} (${req.user.role})`
    };

    const updated = updateUser(id, updates);
    logActivity('USER_APPROVED', `${req.user.name} (${req.user.role}) approved ${targetUser.name} (${targetUser.email}) as ${updated.role}.`);

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: `User approved successfully as ${updated.role}`, user: safeUser });
  } catch (err) {
    console.error('Approve user error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to approve user' });
  }
});

// Reject user access
router.post('/users/:id/reject', (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Application does not meet platform criteria' } = req.body;

    const targetUser = getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
    }

    if (targetUser.role === 'host') {
      return res.status(400).json({ error: 'FORBIDDEN', message: 'Cannot modify host' });
    }

    // Only Host can reject another admin
    if (targetUser.role === 'admin' && req.user.role !== 'host') {
      return res.status(403).json({
        error: 'HOST_REQUIRED',
        message: 'Only the Platform Host can reject administrator accounts.'
      });
    }

    const updated = updateUser(id, {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });

    logActivity('USER_REJECTED', `${req.user.name} rejected ${targetUser.name} (${targetUser.email}). Reason: ${reason}`);

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'User registration was rejected', user: safeUser });
  } catch (err) {
    console.error('Reject user error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to reject user' });
  }
});

// Revoke or suspend access
router.post('/users/:id/revoke', (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = getUserById(id);

    if (!targetUser) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
    }

    if (targetUser.role === 'host') {
      return res.status(400).json({ error: 'FORBIDDEN', message: 'Cannot revoke host privileges' });
    }

    if (targetUser.role === 'admin' && req.user.role !== 'host') {
      return res.status(403).json({
        error: 'HOST_REQUIRED',
        message: 'Only the Platform Host can revoke administrator privileges.'
      });
    }

    const updated = updateUser(id, {
      status: 'pending',
      revokedAt: new Date().toISOString()
    });

    logActivity('ACCESS_REVOKED', `${req.user.name} reset ${targetUser.name} status back to pending.`);
    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'Access revoked. User is now pending approval.', user: safeUser });
  } catch (err) {
    console.error('Revoke access error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to revoke user access' });
  }
});

// Promote or demote role (Only Host can grant Admin role!)
router.post('/users/:id/role', (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // 'student' | 'admin'

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'INVALID_ROLE', message: 'Role must be student or admin' });
    }

    // RULE: Granting Admin role is strictly Host only!
    if (role === 'admin' && req.user.role !== 'host') {
      return res.status(403).json({
        error: 'HOST_REQUIRED',
        message: 'Only the Platform Host can promote a user to Administrator.'
      });
    }

    const targetUser = getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
    }

    if (targetUser.role === 'host') {
      return res.status(400).json({ error: 'FORBIDDEN', message: 'Cannot change host role' });
    }

    const updated = updateUser(id, { role });
    logActivity('ROLE_CHANGED', `${req.user.name} modified role for ${targetUser.name} to ${role}.`);

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: `Role changed to ${role}`, user: safeUser });
  } catch (err) {
    console.error('Change role error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update user role' });
  }
});

// Batch approve selected students / users
router.post('/users/batch-approve', (req, res) => {
  try {
    const { userIds = [], role = 'student' } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'EMPTY_LIST', message: 'No user IDs provided for approval' });
    }

    if (role === 'admin' && req.user.role !== 'host') {
      return res.status(403).json({
        error: 'HOST_REQUIRED',
        message: 'Only the Platform Host can batch approve Administrator accounts.'
      });
    }

    const approvedList = [];
    userIds.forEach((id) => {
      const u = getUserById(id);
      if (u && u.role !== 'host') {
        const updates = {
          status: 'approved',
          role: role,
          approvedAt: new Date().toISOString(),
          approvedBy: `${req.user.name} (${req.user.role})`
        };
        const updated = updateUser(id, updates);
        approvedList.push(updated.name);
      }
    });

    logActivity('BATCH_APPROVE', `${req.user.name} batch approved ${approvedList.length} users: ${approvedList.join(', ')}`);

    res.json({
      message: `Successfully approved ${approvedList.length} users.`,
      approvedCount: approvedList.length
    });
  } catch (err) {
    console.error('Batch approve error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to batch approve users' });
  }
});

// Choose student and assign courses / customized permissions
router.post('/users/:id/assign-course', (req, res) => {
  try {
    const { id } = req.params;
    const { courseIds = [] } = req.body;

    const targetUser = getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Student not found' });
    }

    const updatedCourses = Array.from(new Set([...(targetUser.assignedCourses || []), ...courseIds]));
    const updated = updateUser(id, { assignedCourses: updatedCourses });

    logActivity('COURSE_ASSIGNED', `${req.user.name} assigned ${courseIds.length} courses to ${targetUser.name}.`);

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'Courses assigned successfully to chosen student', user: safeUser });
  } catch (err) {
    console.error('Assign course error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to assign course' });
  }
});

// Batch choose students and assign courses
router.post('/users/choose-and-assign', (req, res) => {
  try {
    const { studentIds = [], courseIds = [] } = req.body;

    if (!studentIds.length || !courseIds.length) {
      return res.status(400).json({ error: 'MISSING_DATA', message: 'Please select both students and courses' });
    }

    studentIds.forEach((studentId) => {
      const student = getUserById(studentId);
      if (student) {
        const assigned = Array.from(new Set([...(student.assignedCourses || []), ...courseIds]));
        updateUser(studentId, { assignedCourses: assigned });
      }
    });

    logActivity('BATCH_ENROLL', `${req.user.name} enrolled ${studentIds.length} selected students into ${courseIds.length} courses.`);

    res.json({
      message: `Enrolled ${studentIds.length} students into selected courses.`,
      studentCount: studentIds.length
    });
  } catch (err) {
    console.error('Batch enroll error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to batch assign courses' });
  }
});

// Stats dashboard
router.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json({ stats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch statistics' });
  }
});

// Audit Activity Logs
router.get('/logs', (req, res) => {
  try {
    const logs = getLogs();
    res.json({ logs });
  } catch (err) {
    console.error('Logs error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch logs' });
  }
});

export default router;
