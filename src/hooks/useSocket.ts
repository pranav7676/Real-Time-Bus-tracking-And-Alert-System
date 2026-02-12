import { useEffect, useRef, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAppStore } from '../stores/appStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(WS_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socketInstance;
}

export function useSocket() {
  const socketRef = useRef<Socket>(getSocket());
  const setConnected = useAppStore((state) => state.setConnected);
  const updateBusLocation = useAppStore((state) => state.updateBusLocation);
  const addAlert = useAppStore((state) => state.addAlert);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onLocationUpdated = (data: {
      busId: string;
      latitude: number;
      longitude: number;
      speed: number;
    }) => {
      updateBusLocation(data.busId, data.latitude, data.longitude, data.speed);
    };

    const onSOSAlert = (data: {
      id: string;
      userId: string;
      busId: string;
      message: string;
      timestamp: string;
    }) => {
      addAlert({
        id: data.id,
        userId: data.userId,
        busId: data.busId,
        message: data.message,
        resolved: false,
        createdAt: new Date(data.timestamp),
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('location:updated', onLocationUpdated);
    socket.on('sos:alert', onSOSAlert);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('location:updated', onLocationUpdated);
      socket.off('sos:alert', onSOSAlert);
    };
  }, [setConnected, updateBusLocation, addAlert]);

  const joinRole = useCallback((role: string) => {
    socketRef.current.emit('join:role', role);
  }, []);

  const joinBus = useCallback((busId: string) => {
    socketRef.current.emit('join:bus', busId);
  }, []);

  const subscribeBus = useCallback((busId: string) => {
    socketRef.current.emit('subscribe:bus', busId);
  }, []);

  const sendLocation = useCallback(
    (data: { busId: string; latitude: number; longitude: number; speed: number; heading: number }) => {
      socketRef.current.emit('location:update', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    },
    []
  );

  const triggerSOS = useCallback(
    (data: { userId: string; busId: string; message: string; latitude?: number; longitude?: number }) => {
      socketRef.current.emit('sos:trigger', data);
    },
    []
  );

  const updateTrip = useCallback(
    (data: { busId: string; driverId: string; action: 'start' | 'stop' }) => {
      socketRef.current.emit('trip:update', data);
    },
    []
  );

  const scanAttendance = useCallback((data: { userId: string; busId: string }) => {
    socketRef.current.emit('attendance:scan', data);
  }, []);

  return {
    socket: socketRef.current,
    joinRole,
    joinBus,
    subscribeBus,
    sendLocation,
    triggerSOS,
    updateTrip,
    scanAttendance,
  };
}
