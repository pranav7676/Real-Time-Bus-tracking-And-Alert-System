import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ---------- User / Auth ----------
app.post('/api/users/sync', async (req, res) => {
  const { clerkId, email, name, avatarUrl } = req.body;
  // Upsert user from Clerk webhook or client call
  // In production: use PrismaClient
  res.json({ id: clerkId, email, name, avatarUrl, role: null, onboardingDone: false });
});

app.get('/api/users/:clerkId', async (req, res) => {
  const { clerkId } = req.params;
  // Fetch user by clerkId
  res.json({ id: clerkId, role: null, onboardingDone: false });
});

app.patch('/api/users/:clerkId/role', async (req, res) => {
  const { clerkId } = req.params;
  const { role } = req.body;
  // Update user role
  res.json({ id: clerkId, role, onboardingDone: false });
});

app.patch('/api/users/:clerkId/onboarding', async (req, res) => {
  const { clerkId } = req.params;
  const { name, phone } = req.body;
  // Complete onboarding
  res.json({ id: clerkId, name, phone, onboardingDone: true });
});

// ---------- Buses ----------
app.get('/api/buses', async (_req, res) => {
  res.json([]);
});

app.get('/api/buses/:id', async (req, res) => {
  res.json({ id: req.params.id });
});

app.post('/api/buses', async (req, res) => {
  res.status(201).json(req.body);
});

app.patch('/api/buses/:id', async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// ---------- Trips ----------
app.post('/api/trips/start', async (req, res) => {
  const { busId, driverId } = req.body;
  res.status(201).json({ id: `trip-${Date.now()}`, busId, driverId, status: 'IN_PROGRESS' });
});

app.patch('/api/trips/:id/end', async (req, res) => {
  res.json({ id: req.params.id, status: 'COMPLETED', endedAt: new Date() });
});

// ---------- Attendance ----------
app.post('/api/attendance/scan', async (req, res) => {
  const { userId, busId } = req.body;
  res.status(201).json({ id: `att-${Date.now()}`, userId, busId, scannedAt: new Date() });
});

app.get('/api/attendance', async (_req, res) => {
  res.json([]);
});

// ---------- SOS Alerts ----------
app.post('/api/sos', async (req, res) => {
  res.status(201).json({ id: `sos-${Date.now()}`, ...req.body, resolved: false });
});

app.get('/api/sos', async (_req, res) => {
  res.json([]);
});

app.patch('/api/sos/:id/resolve', async (req, res) => {
  res.json({ id: req.params.id, resolved: true, resolvedAt: new Date() });
});

// ---------- Analytics ----------
app.get('/api/analytics/dashboard', async (_req, res) => {
  res.json({
    activeBuses: 12,
    driversOnline: 10,
    todayRidership: 847,
    attendanceRate: 94.2,
    activeAlerts: 1,
  });
});

app.get('/api/analytics/weekly', async (_req, res) => {
  res.json([
    { date: 'Mon', ridership: 720, attendance: 680 },
    { date: 'Tue', ridership: 850, attendance: 810 },
    { date: 'Wed', ridership: 790, attendance: 750 },
    { date: 'Thu', ridership: 920, attendance: 870 },
    { date: 'Fri', ridership: 880, attendance: 840 },
    { date: 'Sat', ridership: 450, attendance: 420 },
    { date: 'Sun', ridership: 380, attendance: 350 },
  ]);
});

// ---------- Routes ----------
app.get('/api/routes', async (_req, res) => {
  res.json([]);
});

app.post('/api/routes', async (req, res) => {
  res.status(201).json(req.body);
});

// ---------- Admin: Drivers ----------
app.get('/api/admin/drivers', async (_req, res) => {
  res.json([]);
});

app.post('/api/admin/assign-driver', async (req, res) => {
  res.json(req.body);
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
