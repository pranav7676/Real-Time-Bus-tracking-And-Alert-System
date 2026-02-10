import { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { AppLayout, ProtectedRoute, ErrorBoundary } from './components/layout';
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
} from './pages';

// Loading Component
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

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Set initial theme based on preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/watch-demo" element={<WatchDemoPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/start-trial" element={<StartTrialPage />} />

            {/* Role Selection */}
            <Route
              path="/select-role"
              element={
                <ProtectedRoute>
                  <RoleSelectionPage />
                </ProtectedRoute>
              }
            />

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/passenger" element={<DashboardPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;