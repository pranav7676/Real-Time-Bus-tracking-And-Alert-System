import { useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  QrCode,
  AlertTriangle,
  Bus,
  Navigation,
  Wifi,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { formatETA, formatDistance } from '../../lib/utils';

export default function StudentDashboard() {
  const buses = useAppStore((state) => state.buses);
  const isConnected = useAppStore((state) => state.isConnected);
  const { joinRole, subscribeBus, triggerSOS } = useSocket();

  useEffect(() => {
    joinRole('STUDENT');
    // Subscribe to first bus for demo
    if (buses.length > 0) {
      subscribeBus(buses[0].id);
    }
  }, [joinRole, subscribeBus, buses.length]);

  const nearestBus = useMemo(() => buses[0], [buses]);

  const handleSOS = useCallback(() => {
    if (!nearestBus) return;
    triggerSOS({
      userId: 'current-user',
      busId: nearestBus.id,
      message: 'Emergency SOS triggered by student',
    });
  }, [nearestBus, triggerSOS]);

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
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Track your bus and stay connected</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface">
          <Wifi className={`h-4 w-4 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
          <span className={`text-xs font-medium ${isConnected ? 'text-success' : 'text-muted-foreground'}`}>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Bus"
          value={nearestBus?.number || 'N/A'}
          icon={<Bus className="h-5 w-5" />}
          description={nearestBus?.routeName}
        />
        <StatCard
          title="ETA"
          value={nearestBus?.eta ? formatETA(nearestBus.eta) : '--'}
          icon={<Clock className="h-5 w-5" />}
          description="Estimated arrival"
          trend={nearestBus?.eta && nearestBus.eta < 5 ? 'Arriving soon!' : undefined}
        />
        <StatCard
          title="Distance"
          value={nearestBus?.distance ? formatDistance(nearestBus.distance) : '--'}
          icon={<Navigation className="h-5 w-5" />}
          description="From your location"
        />
        <StatCard
          title="Speed"
          value={`${nearestBus?.location?.speed || 0} km/h`}
          icon={<MapPin className="h-5 w-5" />}
          description="Current speed"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Map Placeholder */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-surface rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">Live Map View</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nearestBus?.location
                        ? `${nearestBus.location.latitude.toFixed(4)}, ${nearestBus.location.longitude.toFixed(4)}`
                        : 'Waiting for GPS data...'}
                    </p>
                  </div>
                </div>
                {/* Bus marker indicator */}
                {nearestBus?.location && (
                  <motion.div
                    className="absolute w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"
                    animate={{
                      x: [200, 210, 220, 215, 225],
                      y: [150, 145, 155, 150, 140],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={item} className="space-y-4">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="h-5 w-5 text-primary" />
                QR Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-surface rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Scan to mark attendance</p>
                </div>
              </div>
              <Button className="w-full gap-2">
                <QrCode className="h-4 w-4" />
                Open Scanner
              </Button>
            </CardContent>
          </Card>

          {/* SOS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Emergency SOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Press the button below to send an emergency alert to the admin and driver.
              </p>
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={handleSOS}
              >
                <AlertTriangle className="h-4 w-4" />
                Send SOS Alert
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Buses */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Active Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{bus.number}</p>
                      <p className="text-sm text-muted-foreground">{bus.routeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{bus.eta ? formatETA(bus.eta) : '--'}</p>
                      <p className="text-xs text-muted-foreground">ETA</p>
                    </div>
                    <Badge variant={bus.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {bus.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
