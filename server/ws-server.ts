import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

interface BusLocationPayload {
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

interface SOSPayload {
  userId: string;
  busId: string;
  message: string;
  latitude?: number;
  longitude?: number;
}

interface TripPayload {
  busId: string;
  driverId: string;
  action: 'start' | 'stop';
}

// Track connected clients
const connectedDrivers = new Map<string, string>(); // socketId -> busId
const connectedStudents = new Set<string>();
const connectedAdmins = new Set<string>();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join role-based rooms
  socket.on('join:role', (role: string) => {
    socket.join(`role:${role}`);
    if (role === 'ADMIN') connectedAdmins.add(socket.id);
    if (role === 'STUDENT') connectedStudents.add(socket.id);
  });

  // Driver joins their bus room
  socket.on('join:bus', (busId: string) => {
    socket.join(`bus:${busId}`);
    connectedDrivers.set(socket.id, busId);
  });

  // Student subscribes to a bus
  socket.on('subscribe:bus', (busId: string) => {
    socket.join(`bus:${busId}`);
  });

  // GPS location update from driver
  socket.on('location:update', (data: BusLocationPayload) => {
    // Broadcast to all subscribers of this bus
    socket.to(`bus:${data.busId}`).emit('location:updated', data);
    // Also broadcast to all admins
    io.to('role:ADMIN').emit('location:updated', data);
  });

  // SOS alert
  socket.on('sos:trigger', (data: SOSPayload) => {
    // Broadcast to admins and bus subscribers
    io.to('role:ADMIN').emit('sos:alert', {
      ...data,
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    });
    io.to(`bus:${data.busId}`).emit('sos:alert', {
      ...data,
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  });

  // Trip management
  socket.on('trip:update', (data: TripPayload) => {
    io.to('role:ADMIN').emit('trip:updated', data);
    io.to(`bus:${data.busId}`).emit('trip:updated', data);
  });

  // Attendance scan
  socket.on('attendance:scan', (data: { userId: string; busId: string }) => {
    io.to('role:ADMIN').emit('attendance:recorded', {
      ...data,
      scannedAt: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    connectedDrivers.delete(socket.id);
    connectedStudents.delete(socket.id);
    connectedAdmins.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    connections: io.engine.clientsCount,
    drivers: connectedDrivers.size,
    students: connectedStudents.size,
    admins: connectedAdmins.size,
  });
});

const PORT = process.env.WS_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

export { io, httpServer };
