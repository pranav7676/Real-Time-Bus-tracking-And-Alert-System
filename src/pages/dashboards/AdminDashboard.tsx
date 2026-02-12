import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bus,
  Users,
  AlertTriangle,
  BarChart3,
  MapPin,
  UserCheck,
  Route,
  Shield,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { formatTime } from '../../lib/utils';

export default function AdminDashboard() {
  const buses = useAppStore((state) => state.buses);
  const alerts = useAppStore((state) => state.alerts);
  const stats = useAppStore((state) => state.stats);
  const analytics = useAppStore((state) => state.analytics);
  const resolveAlert = useAppStore((state) => state.resolveAlert);
  const isConnected = useAppStore((state) => state.isConnected);
  const { joinRole } = useSocket();

  useEffect(() => {
    joinRole('ADMIN');
  }, [joinRole]);

  const unresolvedAlerts = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Fleet management & monitoring</p>
        </div>
        <Badge variant={isConnected ? 'success' : 'outline'} className="text-sm px-4 py-1.5">
          {isConnected ? 'All Systems Online' : 'Connecting...'}
        </Badge>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Active Buses" value={stats.activeBuses.toString()} icon={<Bus className="h-5 w-5" />} description="Currently operating" />
        <StatCard title="Drivers Online" value={stats.driversOnline.toString()} icon={<UserCheck className="h-5 w-5" />} description="On active duty" />
        <StatCard title="Today's Ridership" value={stats.todayRidership.toLocaleString()} icon={<Users className="h-5 w-5" />} description="+12% from yesterday" trend="+12%" />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon={<BarChart3 className="h-5 w-5" />} description="Daily average" />
        <StatCard title="Active Alerts" value={stats.activeAlerts.toString()} icon={<AlertTriangle className="h-5 w-5" />} description={stats.activeAlerts > 0 ? 'Needs attention' : 'All clear'} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Fleet Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 bg-surface rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Live Fleet Map</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {buses.filter((b) => b.status === 'ACTIVE').length} active buses
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {buses.map((bus) => (
                  <div key={bus.id} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bus className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{bus.number}</p>
                        <p className="text-xs text-muted-foreground">{bus.routeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{bus.currentOccupancy}/{bus.capacity}</span>
                      <Badge variant={bus.status === 'ACTIVE' ? 'success' : 'warning'}>{bus.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                SOS Alerts
                {unresolvedAlerts.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">{unresolvedAlerts.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unresolvedAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unresolvedAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className="text-xs text-muted-foreground">{formatTime(alert.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Bus: {alert.bus?.number || alert.busId}</span>
                        <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>Resolve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2"><Users className="h-4 w-4" />Manage Drivers</Button>
              <Button variant="outline" className="w-full justify-start gap-2"><Route className="h-4 w-4" />Route Management</Button>
              <Button variant="outline" className="w-full justify-start gap-2"><Bus className="h-4 w-4" />Assign Buses</Button>
              <Button variant="outline" className="w-full justify-start gap-2"><Clock className="h-4 w-4" />Attendance Logs</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
