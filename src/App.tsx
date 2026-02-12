import { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { AppLayout, ErrorBoundary } from './components/layout';
import { AuthGuard } from './components/auth';
import {
  LandingPage,
  RoleSelectionPage,
  DashboardPage,
  MapPage,
  AlertsPage,
  AnalyticsPage,
  SettingsPage,
  RoutesPage,
  AttendancePage,
  WatchDemoPage,
  PricingPage,
  OrganizationPage,
  AboutPage,
  ContactPage,
  CareersPage,
  HelpCenterPage,
  BlogPage,
  SecurityPage,
  StartTrialPage,
  NotFoundPage,
  SignInPage,
  SignUpPage,
  OnboardingPage,
  OurJourneyPage,
  StudentDashboard,
  DriverDashboard,
  AdminDashboard,
} from './pages';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/our-journey" element={<OurJourneyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/watch-demo" element={<WatchDemoPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/start-trial" element={<StartTrialPage />} />

            {/* Auth Routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Role Selection - requires auth, no onboarding check */}
            <Route
              path="/select-role"
              element={
                <AuthGuard requireOnboarding={false}>
                  <RoleSelectionPage />
                </AuthGuard>
              }
            />

            {/* Onboarding - requires auth + role, no onboarding check */}
            <Route
              path="/onboarding"
              element={
                <AuthGuard requireOnboarding={false}>
                  <OnboardingPage />
                </AuthGuard>
              }
            />

            {/* Role Dashboards */}
            <Route
              path="/dashboard/student"
              element={
                <AuthGuard allowedRoles={['STUDENT']}>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<StudentDashboard />} />
            </Route>

            <Route
              path="/dashboard/driver"
              element={
                <AuthGuard allowedRoles={['DRIVER']}>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<DriverDashboard />} />
            </Route>

            <Route
              path="/dashboard/admin"
              element={
                <AuthGuard allowedRoles={['ADMIN']}>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Protected App Routes */}
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;