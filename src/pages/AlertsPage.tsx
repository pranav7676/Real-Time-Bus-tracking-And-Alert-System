import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertCard } from '../components/dashboard/SOSAlert';
import { useLanguage } from '../context/LanguageContext';

export function AlertsPage() {
    const { t } = useLanguage();
    const { alerts, resolveAlert } = useAppStore((state) => ({
        alerts: state.alerts,
        resolveAlert: state.resolveAlert,
    }));

    const unresolvedAlerts = alerts.filter((a) => !a.resolved);
    const resolvedAlerts = alerts.filter((a) => a.resolved);

    return (
        <div className="space-y-6">
            {/* Active Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
                                {t('alerts.activeAlerts')}
                            </CardTitle>
                            {unresolvedAlerts.length > 0 && (
                                <Badge variant="destructive">{unresolvedAlerts.length} {t('common.active')}</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {unresolvedAlerts.length > 0 ? (
                                unresolvedAlerts.map((alert, index) => (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <AlertCard
                                            alert={alert}
                                            onResolve={() => resolveAlert(alert.id)}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                    role="status"
                                    aria-label={t('alerts.allClear')}
                                >
                                    <Shield className="h-16 w-16 text-success/50 mx-auto mb-4" aria-hidden="true" />
                                    <p className="text-lg font-medium text-success">{t('alerts.allClear')}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {t('alerts.noActiveAlerts')}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base text-muted-foreground">
                                {t('alerts.resolvedAlerts')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {resolvedAlerts.map((alert, index) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AlertCard
                                        alert={alert}
                                        onResolve={() => { }}
                                    />
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
