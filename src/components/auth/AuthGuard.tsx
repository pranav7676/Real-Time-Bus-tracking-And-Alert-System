import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import type { UserRole } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireOnboarding?: boolean;
}

export function AuthGuard({ children, allowedRoles, requireOnboarding = true }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const userRole = useAppStore((state) => state.userRole);
  const onboardingDone = useAppStore((state) => state.onboardingDone);

  // Wait for Clerk to fully load before making any routing decisions
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

  // Not signed in → send to sign-in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname;

  // Signed in but no role → send to role selection (unless already there)
  if (!userRole && currentPath !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  // Has role but onboarding not done → send to onboarding (unless already there)
  if (userRole && requireOnboarding && !onboardingDone && currentPath !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Role-based access control
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/dashboard/${userRole.toLowerCase()}`} replace />;
  }

  return <>{children}</>;
}
