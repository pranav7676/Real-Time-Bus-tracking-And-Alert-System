import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, CreditCard, FileText, Minus, Plus, Trash2, Lock } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

const planDetails: Record<string, { name: string; price: number; features: string[] }> = {
  basic: {
    name: 'Basic Plan', price: 499,
    features: ['Up to 10 buses', 'Real-time GPS tracking', 'Basic attendance via QR', 'Email support', 'Basic analytics dashboard'],
  },
  pro: {
    name: 'Pro Plan', price: 999,
    features: ['Up to 50 buses', 'Advanced GPS with live ETA', 'QR + biometric attendance', 'SOS emergency alerts', 'Priority support', 'Advanced analytics', 'Custom branding', 'API access'],
  },
  enterprise: {
    name: 'Enterprise Plan', price: 1999,
    features: ['Unlimited buses', 'White-label solution', 'Dedicated account manager', '24/7 phone support', 'Custom integrations', 'SLA guarantees', 'Advanced security', 'Training & onboarding'],
  },
};

export function CartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Get plan from URL or localStorage
  const planParam = searchParams.get('plan') || 'basic';
  const [selectedPlan, setSelectedPlan] = useState(planParam);

  useEffect(() => {
    // Load cart from localStorage
    const saved = localStorage.getItem('smartbus_cart');
    if (saved) {
      try {
        const cart = JSON.parse(saved);
        if (cart.plan) setSelectedPlan(cart.plan);
        if (cart.quantity) setQuantity(cart.quantity);
      } catch { /* ignore parse errors */ }
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-up?redirect_url=/cart?plan=' + selectedPlan);
    }
  }, [isSignedIn, navigate, selectedPlan]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smartbus_cart', JSON.stringify({ plan: selectedPlan, quantity }));
  }, [selectedPlan, quantity]);

  const plan = planDetails[selectedPlan] || planDetails.basic;
  const subtotal = plan.price * quantity;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) return;
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      // Save order to localStorage for ConfirmationPage
      const order = {
        clerkUserId: user?.id || 'guest',
        email: user?.primaryEmailAddress?.emailAddress || '',
        plan: selectedPlan,
        planName: plan.name,
        quantity,
        subtotal,
        gst,
        total,
        timestamp: new Date().toISOString(),
        invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
      };
      localStorage.setItem('smartbus_last_order', JSON.stringify(order));
      // Clear cart
      localStorage.removeItem('smartbus_cart');
      setIsProcessing(false);
      setShowPaymentModal(false);
      navigate('/confirmation');
    }, 2000);
  };

  const qrData = JSON.stringify({
    clerkUserId: user?.id || 'guest',
    email: user?.primaryEmailAddress?.emailAddress || '',
    plan: selectedPlan,
    quantity,
    total,
    timestamp: new Date().toISOString(),
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
  });

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `smartbus-pass-${selectedPlan}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(qrData);
  };

  // Order complete view
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </header>
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="h-10 w-10 text-green-500" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Order Confirmed! 🎉</h1>
              <p className="text-muted-foreground mb-8">Your SmartBus subscription is now active.</p>

              {/* QR Code */}
              <Card className="p-8 mb-8">
                <h2 className="font-semibold text-lg mb-4">Your SmartBus Pass QR Code</h2>
                <div id="qr-code" className="flex justify-center mb-4">
                  <QRCodeCanvas
                    value={qrData}
                    size={250}
                    bgColor="#1a1b2e"
                    fgColor="#f97316"
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleDownloadQR}>
                    Download QR PNG
                  </Button>
                  <Button variant="outline" onClick={handleCopyData}>
                    Copy QR Data
                  </Button>
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="p-6 text-left">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{plan.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span>{quantity}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                    <span>Total Paid</span>
                    <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Pricing
          </Button>
          <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
          <div />
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-20 max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">Pricing</button>
          <span>/</span>
          <span className="text-foreground">Cart</span>
        </nav>
      </div>

      <main className="pt-8 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4" />Checkout
            </div>
            <h1 className="text-3xl font-bold mb-2">Complete Your <span className="gradient-text">Order</span></h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Selection */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4"><CardTitle>Select Plan</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="grid gap-3">
                    {Object.entries(planDetails).map(([key, p]) => (
                      <button key={key} onClick={() => setSelectedPlan(key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPlan === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{p.name}</h3>
                            <p className="text-sm text-muted-foreground">{p.features.length} features included</p>
                          </div>
                          <span className="text-xl font-bold text-primary">₹{p.price.toLocaleString('en-IN')}<span className="text-sm text-muted-foreground font-normal">/mo</span></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quantity */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4"><CardTitle>Quantity (Bus Licenses)</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-surface transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-surface transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Invoice Preview</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowInvoice(!showInvoice)}>
                    {showInvoice ? 'Hide' : 'Show'} Details
                  </Button>
                </div>
                <AnimatePresence>
                  {showInvoice && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="border border-border rounded-lg p-4 text-sm">
                        <div className="flex justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg">INVOICE</p>
                            <p className="text-muted-foreground">SmartBus Technologies Pvt. Ltd.</p>
                            <p className="text-muted-foreground">GSTIN: 33AABCS1234X1ZA</p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">Date: {new Date().toLocaleDateString('en-IN')}</p>
                            <p className="text-muted-foreground">Invoice #: INV-PREVIEW</p>
                          </div>
                        </div>
                        <div className="border-t border-border pt-3 space-y-2">
                          <div className="flex justify-between"><span>Bill To:</span><span>{user?.fullName || 'User'}</span></div>
                          <div className="flex justify-between"><span>Email:</span><span>{user?.primaryEmailAddress?.emailAddress || ''}</span></div>
                        </div>
                        <div className="border-t border-border mt-3 pt-3 space-y-2">
                          <div className="flex justify-between"><span>{plan.name} × {quantity}</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between text-muted-foreground"><span>CGST (9%)</span><span>₹{Math.round(gst / 2).toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between text-muted-foreground"><span>SGST (9%)</span><span>₹{Math.round(gst / 2).toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">{plan.name} × {quantity}</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold border-t border-border pt-3">
                    <span>Total</span>
                    <span className="text-primary text-lg">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium">Features included:</h4>
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{total.toLocaleString('en-IN')}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  14-day free trial. Cancel anytime. 🔒 Secure payment.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !isProcessing && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Secure Payment</h2>
                    <p className="text-sm text-muted-foreground">SmartBus Payment Gateway</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Card Holder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="•••"
                        maxLength={3}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Amount</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing || !cardNumber || !cardExpiry || !cardCvv || !cardName}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Pay ₹{total.toLocaleString('en-IN')}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    🔒 Your payment info is secured with 256-bit SSL encryption
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
