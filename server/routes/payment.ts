import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import Order from '../models/Order.js';
import QRCode from 'qrcode';

const router = Router();
let localOrders: any[] = [];
let useLocal = false;

export function setPaymentLocalStorage(val: boolean) { useLocal = val; }

// POST /api/cart - Create order
router.post('/cart', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { plan, price } = req.body;
    if (!plan || !price) {
      return res.status(400).json({ message: 'Plan and price are required' });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    if (useLocal) {
      const order = {
        _id: Date.now().toString(),
        userId: req.userId,
        plan, price, status: 'pending',
        qrCode: '', invoiceNumber,
        createdAt: new Date(),
      };
      localOrders.push(order);
      return res.status(201).json(order);
    }

    const order = await Order.create({
      userId: req.userId, plan, price,
      invoiceNumber, status: 'pending',
    });
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/checkout/:orderId - Complete checkout & generate QR
router.post('/checkout/:orderId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const qrData = JSON.stringify({
      userId: req.userId,
      orderId,
      plan: req.body.plan || 'basic',
      timestamp: new Date().toISOString(),
      type: 'smartbus_subscription',
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#f97316', light: '#1a1a2e' },
    });

    if (useLocal) {
      const idx = localOrders.findIndex(o => o._id === orderId);
      if (idx === -1) return res.status(404).json({ message: 'Order not found' });
      localOrders[idx].status = 'completed';
      localOrders[idx].qrCode = qrCodeDataUrl;
      return res.json(localOrders[idx]);
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      status: 'completed',
      qrCode: qrCodeDataUrl,
    }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/generate-qr - Generate standalone QR code
router.post('/generate-qr', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data } = req.body;
    const qrData = JSON.stringify({
      userId: req.userId,
      data: data || {},
      timestamp: new Date().toISOString(),
      type: 'smartbus_pass',
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#f97316', light: '#1a1a2e' },
    });

    res.json({ qrCode: qrCodeDataUrl });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders - Get user orders
router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (useLocal) {
      const orders = localOrders.filter(o => o.userId === req.userId);
      return res.json(orders);
    }
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
