import { motion, AnimatePresence } from 'framer-motion';
import {
    Bus,
    Users,
    AlertTriangle,
    TrendingUp,
    Activity,
    Shield,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LiveMap } from '../../components/dashboard/LiveMap';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { AlertCard } from '../../components/dashboard/SOSAlert';

export function AdminDashboard() {
    const { buses, stats, analytics, alerts, resolveAlert } = useAppStore((state) => ({
        buses: state.buses,
        stats: state.stats,
        analytics: state.analytics,
        alerts: state.alerts,
        resolveAlert: state.resolveAlert,
    }));

    const unresolvedAlerts = alerts.filter((a) => !a.resolved);

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
                <StatCard
                    title="Active Buses"
                    value={stats.activeBuses}
                    change="+2 from yesterday"
                    changeType="positive"
                    icon={Bus}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Drivers Online"
                    value={stats.driversOnline}
                    icon={Users}
                    iconColor="text-success"
                />
                <StatCard
                    title="Today's Ridership"
                    value={stats.todayRidership.toLocaleString()}
                    change="+12.3%"
                    changeType="positive"
                    icon={TrendingUp}
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendanceRate}%`}
                    icon={Activity}
                    iconColor="text-purple-500"
                />
                <StatCard
                    title="Active Alerts"
                    value={stats.activeAlerts}
                    icon={AlertTriangle}
                    iconColor={stats.activeAlerts > 0 ? 'text-destructive' : 'text-muted-foreground'}
                />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Fleet Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Fleet Overview
                                </CardTitle>
                                <Badge variant="success">{buses.length} Active</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <LiveMap buses={buses} className="h-[350px]" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Live Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                    SOS Alerts
                                </CardTitle>
                                {unresolvedAlerts.length > 0 && (
                                    <Badge variant="destructive">{unresolvedAlerts.length} Active</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {unresolvedAlerts.length > 0 ? (
                                    unresolvedAlerts.map((alert) => (
                                        <AlertCard
                                            key={alert.id}
                                            alert={alert}
                                            onResolve={() => resolveAlert(alert.id)}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <Shield className="h-12 w-12 text-success/50 mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">
                                            All clear - no active alerts
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Analytics Charts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid lg:grid-cols-2 gap-6"
            >
                <AnalyticsChart
                    data={analytics}
                    type="area"
                    title="Weekly Ridership"
                    dataKey="ridership"
                />
                <AnalyticsChart
                    data={analytics}
                    type="bar"
                    title="Attendance Trends"
                    dataKey="attendance"
                />
            </motion.div>

            {/* Fleet Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Fleet Status</CardTitle>
                            <Badge>{buses.length} Vehicles</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="table-header py-3 px-4">Bus</th>
                                        <th className="table-header py-3 px-4">Route</th>
                                        <th className="table-header py-3 px-4">Status</th>
                                        <th className="table-header py-3 px-4">Occupancy</th>
                                        <th className="table-header py-3 px-4">Speed</th>
                                        <th className="table-header py-3 px-4">Last Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buses.map((bus) => (
                                        <tr key={bus.id} className="border-b border-border last:border-0">
                                            <td className="table-cell font-medium">{bus.number}</td>
                                            <td className="table-cell text-muted-foreground">{bus.routeName}</td>
                                            <td className="table-cell">
                                                <Badge
                                                    variant={
                                                        bus.status === 'ACTIVE'
                                                            ? 'success'
                                                            : bus.status === 'MAINTENANCE'
                                                                ? 'warning'
                                                                : 'outline'
                                                    }
                                                >
                                                    {bus.status}
                                                </Badge>
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-surface rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{
                                                                width: `${((bus.currentOccupancy || 0) / bus.capacity) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {bus.currentOccupancy}/{bus.capacity}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="table-cell text-muted-foreground">
                                                {bus.location?.speed || 0} km/h
                                            </td>
                                            <td className="table-cell text-muted-foreground text-xs">
                                                Just now
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
