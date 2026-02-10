import { motion } from 'framer-motion';
import { ClipboardCheck, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';

const attendanceRecords = [
    { id: '1', user: 'Alex Johnson', bus: 'BUS-001', route: 'Downtown Express', time: '08:02 AM', date: 'Today' },
    { id: '2', user: 'Sarah Chen', bus: 'BUS-001', route: 'Downtown Express', time: '08:03 AM', date: 'Today' },
    { id: '3', user: 'Mike Williams', bus: 'BUS-002', route: 'Campus Shuttle', time: '08:14 AM', date: 'Today' },
    { id: '4', user: 'Emily Davis', bus: 'BUS-001', route: 'Downtown Express', time: '08:26 AM', date: 'Today' },
    { id: '5', user: 'James Wilson', bus: 'BUS-003', route: 'Airport Link', time: '08:30 AM', date: 'Today' },
];

export function AttendancePage() {
    return (
        <div className="space-y-6">
            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <StatCard
                    title="Today's Check-ins"
                    value={847}
                    change="+12%"
                    changeType="positive"
                    icon={ClipboardCheck}
                    iconColor="text-primary"
                />
                <StatCard
                    title="This Week"
                    value="5,234"
                    icon={Calendar}
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Unique Passengers"
                    value={312}
                    icon={User}
                    iconColor="text-purple-500"
                />
            </motion.div>

            {/* Records Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Attendance</CardTitle>
                            <Badge>Today</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="table-header py-3 px-4">Passenger</th>
                                        <th className="table-header py-3 px-4">Bus</th>
                                        <th className="table-header py-3 px-4">Route</th>
                                        <th className="table-header py-3 px-4">Time</th>
                                        <th className="table-header py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceRecords.map((record) => (
                                        <tr key={record.id} className="border-b border-border last:border-0">
                                            <td className="table-cell font-medium">{record.user}</td>
                                            <td className="table-cell text-muted-foreground">{record.bus}</td>
                                            <td className="table-cell text-muted-foreground">{record.route}</td>
                                            <td className="table-cell text-muted-foreground">{record.time}</td>
                                            <td className="table-cell">
                                                <Badge variant="success">Verified</Badge>
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
