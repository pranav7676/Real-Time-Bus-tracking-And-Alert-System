import { motion } from 'framer-motion';
import {
    Bus,
    MapPin,
    Clock,
    Users,
    AlertTriangle,
    QrCode,
    FileText,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LiveMap } from '../../components/dashboard/LiveMap';
import { SOSButton } from '../../components/dashboard/SOSAlert';
import { formatDistance, formatETA } from '../../lib/utils';

export function PassengerDashboard() {
    const { buses, stats } = useAppStore((state) => ({
        buses: state.buses,
        stats: state.stats,
    }));

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard
                    title="Nearby Buses"
                    value={buses.length}
                    icon={Bus}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Next Bus ETA"
                    value={`${Math.min(...buses.map((b) => b.eta || 99))} min`}
                    icon={Clock}
                    iconColor="text-success"
                />
                <StatCard
                    title="My Trips Today"
                    value={2}
                    icon={MapPin}
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendanceRate}%`}
                    change="+2.1%"
                    changeType="positive"
                    icon={Users}
                    iconColor="text-purple-500"
                />
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Live Bus Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <LiveMap buses={buses} className="h-[400px]" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start gap-3">
                                <QrCode className="h-5 w-5" />
                                Scan QR to Board
                            </Button>
                            <SOSButton busId={buses[0]?.id || '1'} />
                            <Button variant="outline" className="w-full justify-start gap-3">
                                <FileText className="h-5 w-5" />
                                Report Issue
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Nearby Buses */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Nearby Buses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {buses.slice(0, 3).map((bus) => (
                                <div
                                    key={bus.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Bus className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{bus.number}</p>
                                            <p className="text-xs text-muted-foreground">{bus.routeName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-primary">
                                            {formatETA(bus.eta || 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistance(bus.distance || 0)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Active Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-warning" />
                                Service Alerts
                            </CardTitle>
                            <Badge variant="warning">1 Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                            <p className="text-sm font-medium">Route Delay - Downtown Express</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Expected 10 minute delay due to traffic conditions. Updated 5 mins ago.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
