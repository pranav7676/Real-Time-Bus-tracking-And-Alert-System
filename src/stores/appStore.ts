import { create } from 'zustand';
import type { UserRole, BusWithLocation, SOSAlert, Attendance, DashboardStats, AnalyticsData } from '../types';

// Mock data for demonstration
const mockBuses: BusWithLocation[] = [
    {
        id: '1',
        number: 'BUS-001',
        routeName: 'Downtown Express',
        capacity: 45,
        status: 'ACTIVE',
        currentOccupancy: 32,
        location: {
            id: 'loc-1',
            busId: '1',
            latitude: 40.7128,
            longitude: -74.006,
            speed: 35,
            timestamp: new Date(),
        },
        eta: 5,
        distance: 1200,
    },
    {
        id: '2',
        number: 'BUS-002',
        routeName: 'Campus Shuttle',
        capacity: 30,
        status: 'ACTIVE',
        currentOccupancy: 18,
        location: {
            id: 'loc-2',
            busId: '2',
            latitude: 40.7148,
            longitude: -74.008,
            speed: 28,
            timestamp: new Date(),
        },
        eta: 12,
        distance: 2800,
    },
    {
        id: '3',
        number: 'BUS-003',
        routeName: 'Airport Link',
        capacity: 50,
        status: 'ACTIVE',
        currentOccupancy: 41,
        location: {
            id: 'loc-3',
            busId: '3',
            latitude: 40.7108,
            longitude: -74.004,
            speed: 45,
            timestamp: new Date(),
        },
        eta: 8,
        distance: 1900,
    },
];

const mockAlerts: SOSAlert[] = [
    {
        id: 'sos-1',
        userId: 'user-1',
        busId: '1',
        message: 'Medical emergency on bus',
        resolved: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        bus: mockBuses[0],
    },
];

const mockStats: DashboardStats = {
    activeBuses: 12,
    driversOnline: 10,
    todayRidership: 847,
    attendanceRate: 94.2,
    activeAlerts: 1,
};

const mockAnalytics: AnalyticsData[] = [
    { date: 'Mon', ridership: 720, attendance: 680 },
    { date: 'Tue', ridership: 850, attendance: 810 },
    { date: 'Wed', ridership: 790, attendance: 750 },
    { date: 'Thu', ridership: 920, attendance: 870 },
    { date: 'Fri', ridership: 880, attendance: 840 },
    { date: 'Sat', ridership: 450, attendance: 420 },
    { date: 'Sun', ridership: 380, attendance: 350 },
];

interface AppState {
    // Theme
    theme: 'light' | 'dark';
    toggleTheme: () => void;

    // Sidebar
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;

    // User
    userRole: UserRole | null;
    setUserRole: (role: UserRole) => void;

    // Buses
    buses: BusWithLocation[];
    updateBusLocation: (busId: string, lat: number, lng: number, speed: number) => void;

    // Alerts
    alerts: SOSAlert[];
    addAlert: (alert: SOSAlert) => void;
    resolveAlert: (alertId: string) => void;

    // Attendance
    attendanceRecords: Attendance[];
    addAttendance: (record: Attendance) => void;

    // Stats
    stats: DashboardStats;
    analytics: AnalyticsData[];

    // Trip State (Driver)
    isOnTrip: boolean;
    startTrip: () => void;
    endTrip: () => void;

    // Socket connection status
    isConnected: boolean;
    setConnected: (connected: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Theme - default to dark
    theme: 'dark',
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
    }),

    // Sidebar
    sidebarCollapsed: false,
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    // User
    userRole: null,
    setUserRole: (role) => set({ userRole: role }),

    // Buses
    buses: mockBuses,
    updateBusLocation: (busId, lat, lng, speed) => set((state) => ({
        buses: state.buses.map((bus) =>
            bus.id === busId
                ? {
                    ...bus,
                    location: {
                        id: `loc-${busId}`,
                        busId,
                        latitude: lat,
                        longitude: lng,
                        speed,
                        timestamp: new Date(),
                    },
                }
                : bus
        ),
    })),

    // Alerts
    alerts: mockAlerts,
    addAlert: (alert) => set((state) => ({
        alerts: [alert, ...state.alerts],
        stats: { ...state.stats, activeAlerts: state.stats.activeAlerts + 1 },
    })),
    resolveAlert: (alertId) => set((state) => ({
        alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)),
        stats: { ...state.stats, activeAlerts: Math.max(0, state.stats.activeAlerts - 1) },
    })),

    // Attendance
    attendanceRecords: [],
    addAttendance: (record) => set((state) => ({
        attendanceRecords: [record, ...state.attendanceRecords],
    })),

    // Stats
    stats: mockStats,
    analytics: mockAnalytics,

    // Trip State
    isOnTrip: false,
    startTrip: () => set({ isOnTrip: true }),
    endTrip: () => set({ isOnTrip: false }),

    // Socket
    isConnected: false,
    setConnected: (connected) => set({ isConnected: connected }),
}));

// Initialize theme on load
if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
}
