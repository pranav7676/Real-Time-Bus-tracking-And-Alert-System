import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertCard } from '../components/dashboard/SOSAlert';

export function AlertsPage() {
    const { alerts, resolveAlert } = useAppStore((state) => ({
        alerts: state.alerts,
        resolveAlert: state.resolveAlert,
    }));

    const unresolvedAlerts = alerts.filter((a) => !a.resolved);
    const resolvedAlerts = alerts.filter((a) => a.resolved);

    return (
        <div className="space-y-6">
            {/* Active Alerts */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Active Alerts
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
                                className="text-center py-12"
                            >
                                <Shield className="h-16 w-16 text-success/50 mx-auto mb-4" />
                                <p className="text-lg font-medium text-success">All Clear</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    No active emergency alerts
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base text-muted-foreground">
                            Resolved Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {resolvedAlerts.map((alert) => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onResolve={() => { }}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
