import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Square,
    Users,
    MapPin,
    Clock,
    Navigation,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { QRGenerator } from '../../components/dashboard/QRGenerator';
import { RouteTimeline } from '../../components/dashboard/RouteTimeline';
import type { RouteStop } from '../../types';

const mockStops: RouteStop[] = [
    { id: '1', name: 'Central Station', time: '08:00 AM', status: 'completed' },
    { id: '2', name: 'Market Street', time: '08:12 AM', status: 'completed' },
    { id: '3', name: 'University Ave', time: '08:25 AM', status: 'current' },
    { id: '4', name: 'Tech Park', time: '08:40 AM', status: 'upcoming' },
    { id: '5', name: 'Business District', time: '08:55 AM', status: 'upcoming' },
];

export function DriverDashboard() {
    const { isOnTrip, startTrip, endTrip } = useAppStore((state) => ({
        isOnTrip: state.isOnTrip,
        startTrip: state.startTrip,
        endTrip: state.endTrip,
    }));

    const [isLoading, setIsLoading] = useState(false);

    const handleTripToggle = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (isOnTrip) {
            endTrip();
        } else {
            startTrip();
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            {/* Trip Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 border ${isOnTrip
                        ? 'bg-success/10 border-success/30'
                        : 'bg-surface border-border'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOnTrip ? 'bg-success/20' : 'bg-surface'
                                }`}
                        >
                            <Navigation
                                className={`h-6 w-6 ${isOnTrip ? 'text-success' : 'text-muted-foreground'}`}
                            />
                        </div>
                        <div>
                            <p className="font-semibold">
                                {isOnTrip ? 'Trip In Progress' : 'Ready to Start'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {isOnTrip
                                    ? 'GPS is being shared with passengers'
                                    : 'Start trip to begin GPS streaming'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant={isOnTrip ? 'destructive' : 'success'}
                        size="lg"
                        onClick={handleTripToggle}
                        loading={isLoading}
                        className="gap-2"
                    >
                        {isOnTrip ? (
                            <>
                                <Square className="h-5 w-5" />
                                End Trip
                            </>
                        ) : (
                            <>
                                <Play className="h-5 w-5" />
                                Start Trip
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard
                    title="Today's Route"
                    value="Downtown Express"
                    icon={MapPin}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Passengers Onboard"
                    value={28}
                    icon={Users}
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Next Stop"
                    value="Tech Park"
                    icon={Navigation}
                    iconColor="text-success"
                />
                <StatCard
                    title="Remaining Stops"
                    value={2}
                    icon={Clock}
                    iconColor="text-purple-500"
                />
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Route Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle>Today's Route</CardTitle>
                                <Badge variant={isOnTrip ? 'success' : 'outline'}>
                                    {isOnTrip ? 'In Progress' : 'Not Started'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <RouteTimeline stops={mockStops} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* QR Generator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <QRGenerator busId="BUS-001" />
                </motion.div>
            </div>

            {/* Passenger List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Recent Check-ins
                            </CardTitle>
                            <Badge>28 Total</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="table-header py-3 px-4">Student</th>
                                        <th className="table-header py-3 px-4">Stop</th>
                                        <th className="table-header py-3 px-4">Time</th>
                                        <th className="table-header py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Alex Johnson', stop: 'Central Station', time: '08:02 AM', status: 'Boarded' },
                                        { name: 'Sarah Chen', stop: 'Central Station', time: '08:03 AM', status: 'Boarded' },
                                        { name: 'Mike Williams', stop: 'Market Street', time: '08:14 AM', status: 'Boarded' },
                                        { name: 'Emily Davis', stop: 'University Ave', time: '08:26 AM', status: 'Boarded' },
                                    ].map((passenger, i) => (
                                        <tr key={i} className="border-b border-border last:border-0">
                                            <td className="table-cell font-medium">{passenger.name}</td>
                                            <td className="table-cell text-muted-foreground">{passenger.stop}</td>
                                            <td className="table-cell text-muted-foreground">{passenger.time}</td>
                                            <td className="table-cell">
                                                <Badge variant="success">{passenger.status}</Badge>
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
