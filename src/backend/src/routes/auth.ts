import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { logActivity } from '../middleware/logger';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pcr-dev-secret-key';

// Generate simple ID
function generateId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Generate simple ID for activity logs
function generateLogId(): string {
  return 'log_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Get user from database
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1').get(username) as any;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Log successful login activity
    try {
      db.prepare(`
        INSERT INTO activity_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateLogId(),
        user.id,
        'login',
        null,
        null,
        JSON.stringify({
          method: req.method,
          url: req.url,
          statusCode: 200
        }),
        req.ip,
        req.headers['user-agent'] || null
      );
    } catch (logError) {
      console.error('Failed to log login activity:', logError);
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLogin: user.last_login
    };

    res.json({
      success: true,
      data: {
        user: userData,
        token,
        expiresIn: 24 * 60 * 60 // 24 hours in seconds
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, logActivity('logout'), (req: AuthenticatedRequest, res: Response) => {
  // In a real app, you might invalidate the token in a blacklist
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Get fresh user data
    const user = db.prepare('SELECT id, username, email, first_name, last_name, role, is_active, created_at, last_login FROM users WHERE id = ?').get(req.user.id) as any;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLogin: user.last_login
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/register (admin only)
router.post('/register', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Only admin can create users
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { username, email, password, firstName, lastName, role = 'user' } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email) as any;

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userId = generateId();
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, username, email, passwordHash, firstName, lastName, role);

    res.json({
      success: true,
      data: {
        id: userId,
        username,
        email,
        firstName,
        lastName,
        role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;