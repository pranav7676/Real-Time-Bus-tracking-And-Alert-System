import { useAppStore } from '../stores/appStore';
import { PassengerDashboard } from '../pages/dashboards/PassengerDashboard';
import { DriverDashboard } from './dashboards/DriverDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

export function DashboardPage() {
    const userRole = useAppStore((state) => state.userRole);

    switch (userRole) {
        case 'DRIVER':
            return <DriverDashboard />;
        case 'ADMIN':
            return <AdminDashboard />;
        case 'PASSENGER':
        default:
            return <PassengerDashboard />;
    }
}
