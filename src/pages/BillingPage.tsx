import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export function BillingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-8">Billing & <span className="gradient-text">Invoices</span></h1>

            <Card className="p-6 mb-6">
              <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Current Plan</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                  <div>
                    <h3 className="font-semibold capitalize">{user?.plan || 'No active plan'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.plan ? 'Active subscription' : 'Start a trial to get access to all features'}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/pricing')}>
                    {user?.plan ? 'Change Plan' : 'View Plans'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Order History</CardTitle></CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button variant="outline" onClick={() => navigate('/pricing')}>Browse Plans</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium capitalize">{order.plan} Plan</p>
                            <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>{order.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{order.invoiceNumber} • {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">₹{order.price}</span>
                          {order.qrCode && (
                            <a href={order.qrCode} download={`qr-${order.invoiceNumber}.png`}>
                              <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
