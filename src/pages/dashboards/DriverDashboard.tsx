import { useEffect, useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Square,
  MapPin,
  Users,
  AlertTriangle,
  Navigation,
  Gauge,
  Radio,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

export default function DriverDashboard() {
  const isOnTrip = useAppStore((state) => state.isOnTrip);
  const startTrip = useAppStore((state) => state.startTrip);
  const endTrip = useAppStore((state) => state.endTrip);
  const buses = useAppStore((state) => state.buses);
  const isConnected = useAppStore((state) => state.isConnected);

  const { joinRole, joinBus, sendLocation, triggerSOS, updateTrip } = useSocket();
  const geo = useGeolocation(isOnTrip);
  const [studentCount, setStudentCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const assignedBus = buses[0];

  useEffect(() => {
    joinRole('DRIVER');
    if (assignedBus) {
      joinBus(assignedBus.id);
    }
  }, [joinRole, joinBus, assignedBus?.id]);

  useEffect(() => {
    if (isOnTrip && geo.latitude && geo.longitude && assignedBus) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        sendLocation({
          busId: assignedBus.id,
          latitude: geo.latitude!,
          longitude: geo.longitude!,
          speed: geo.speed || 0,
          heading: geo.heading || 0,
        });
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOnTrip, geo.latitude, geo.longitude, geo.speed, geo.heading, assignedBus?.id, sendLocation]);

  const handleStartTrip = useCallback(() => {
    startTrip();
    if (assignedBus) {
      updateTrip({ busId: assignedBus.id, driverId: 'current-driver', action: 'start' });
    }
  }, [startTrip, assignedBus, updateTrip]);

  const handleEndTrip = useCallback(() => {
    endTrip();
    if (assignedBus) {
      updateTrip({ busId: assignedBus.id, driverId: 'current-driver', action: 'stop' });
    }
  }, [endTrip, assignedBus, updateTrip]);

  const handleSOS = useCallback(() => {
    if (!assignedBus) return;
    triggerSOS({
      userId: 'current-driver',
      busId: assignedBus.id,
      message: 'Driver emergency alert',
      latitude: geo.latitude || undefined,
      longitude: geo.longitude || undefined,
    });
  }, [assignedBus, triggerSOS, geo.latitude, geo.longitude]);

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
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">
            {assignedBus ? `Assigned: ${assignedBus.number} — ${assignedBus.routeName}` : 'No bus assigned'}
          </p>
        </div>
        <Badge variant={isOnTrip ? 'success' : 'outline'} className="text-sm px-4 py-1.5">
          {isOnTrip ? 'On Trip' : 'Off Duty'}
        </Badge>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Trip Status"
          value={isOnTrip ? 'Active' : 'Idle'}
          icon={<Radio className="h-5 w-5" />}
          description={isOnTrip ? 'Broadcasting GPS' : 'Waiting to start'}
        />
        <StatCard
          title="Students"
          value={studentCount.toString()}
          icon={<Users className="h-5 w-5" />}
          description="Currently on bus"
        />
        <StatCard
          title="Speed"
          value={`${geo.speed ? Math.round(geo.speed * 3.6) : 0} km/h`}
          icon={<Gauge className="h-5 w-5" />}
          description="Current speed"
        />
        <StatCard
          title="Connection"
          value={isConnected ? 'Online' : 'Offline'}
          icon={<Navigation className="h-5 w-5" />}
          description={isConnected ? 'WebSocket active' : 'Disconnected'}
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isOnTrip ? (
                  <Button size="lg" className="flex-1 gap-2" variant="success" onClick={handleStartTrip}>
                    <Play className="h-5 w-5" />
                    Start Trip
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1 gap-2" variant="destructive" onClick={handleEndTrip}>
                    <Square className="h-5 w-5" />
                    End Trip
                  </Button>
                )}
              </div>

              {isOnTrip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 rounded-lg bg-success/5 border border-success/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium text-success">GPS Broadcasting Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Location: {geo.latitude?.toFixed(6) || 'Acquiring...'},{' '}
                    {geo.longitude?.toFixed(6) || ''}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-surface rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {geo.latitude
                      ? `${geo.latitude.toFixed(6)}, ${geo.longitude?.toFixed(6)}`
                      : isOnTrip
                      ? 'Acquiring GPS signal...'
                      : 'Start a trip to begin tracking'}
                  </p>
                  {geo.accuracy && (
                    <p className="text-xs text-muted-foreground mt-1">Accuracy: ±{Math.round(geo.accuracy)}m</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                Student Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-primary mb-2">{studentCount}</p>
                <p className="text-sm text-muted-foreground mb-4">/ {assignedBus?.capacity || 45} capacity</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStudentCount((c) => Math.max(0, c - 1))}>
                    -
                  </Button>
                  <Button className="flex-1" onClick={() => setStudentCount((c) => c + 1)}>
                    +
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Alert admin immediately in case of an emergency.
              </p>
              <Button variant="destructive" className="w-full gap-2" onClick={handleSOS}>
                <AlertTriangle className="h-4 w-4" />
                Send Emergency Alert
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
