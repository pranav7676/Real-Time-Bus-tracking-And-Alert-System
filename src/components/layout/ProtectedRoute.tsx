import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isSignedIn, isLoaded } = useAuth();
    const location = useLocation();
    const userRole = useAppStore((state) => state.userRole);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If no role selected yet, redirect to role selection
    if (!userRole && location.pathname !== '/select-role') {
        return <Navigate to="/select-role" replace />;
    }

    // If roles are restricted and user doesn't have permission
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
