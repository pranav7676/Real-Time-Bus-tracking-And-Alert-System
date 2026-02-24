import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smartbus_jwt_secret_key_2026_india';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// In-memory fallback when MongoDB is not available
let localUsers: any[] = [];
let useLocalStorage = false;

function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
}

// POST /api/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, countryCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (useLocalStorage) {
      const exists = localUsers.find(u => u.email === email);
      if (exists) return res.status(400).json({ message: 'Email already registered' });

      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        name, email, password: hashedPassword,
        phone: phone || '', countryCode: countryCode || '+91',
        role: 'STUDENT', onboardingDone: false, plan: null,
        createdAt: new Date(),
      };
      localUsers.push(user);
      const token = generateToken(user._id);
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, countryCode: user.countryCode }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone, countryCode });
    const token = generateToken(user._id.toString());

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, countryCode: user.countryCode }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (useLocalStorage) {
      const user = localUsers.find(u => u.email === email);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const bcrypt = await import('bcryptjs');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken(user._id);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, countryCode: user.countryCode, onboardingDone: user.onboardingDone, plan: user.plan }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: (user as any).phone, countryCode: (user as any).countryCode, onboardingDone: (user as any).onboardingDone, plan: (user as any).plan }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (useLocalStorage) {
      const user = localUsers.find(u => u._id === req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, countryCode: user.countryCode, onboardingDone: user.onboardingDone, plan: user.plan });
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, countryCode, role, onboardingDone } = req.body;

    if (useLocalStorage) {
      const idx = localUsers.findIndex(u => u._id === req.userId);
      if (idx === -1) return res.status(404).json({ message: 'User not found' });
      if (name) localUsers[idx].name = name;
      if (phone) localUsers[idx].phone = phone;
      if (countryCode) localUsers[idx].countryCode = countryCode;
      if (role) localUsers[idx].role = role;
      if (onboardingDone !== undefined) localUsers[idx].onboardingDone = onboardingDone;
      const user = localUsers[idx];
      return res.json({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, countryCode: user.countryCode, onboardingDone: user.onboardingDone, plan: user.plan });
    }

    const update: any = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (countryCode) update.countryCode = countryCode;
    if (role) update.role = role;
    if (onboardingDone !== undefined) update.onboardingDone = onboardingDone;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/change-password
router.put('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    if (useLocalStorage) {
      const user = localUsers.find(u => u._id === req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const bcrypt = await import('bcryptjs');
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 12);
      return res.json({ message: 'Password updated successfully' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await (user as any).comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/account
router.delete('/account', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (useLocalStorage) {
      localUsers = localUsers.filter(u => u._id !== req.userId);
      return res.json({ message: 'Account deleted successfully' });
    }
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export { useLocalStorage };
export function setLocalStorage(val: boolean) { useLocalStorage = val; }
export default router;
