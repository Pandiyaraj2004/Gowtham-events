import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './auth/context/AuthContext';
import { PerfTierProvider } from './components/PerfTierProvider';

// Auth Guards
import { RequireAuth } from './auth/guards/RequireAuth';
import { RedirectIfAuthenticated } from './auth/guards/RedirectIfAuthenticated';

// Public Journey (Synchronous for instantaneous homepage delivery)
import Journey from './journey/Journey';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Portfolio from './pages/public/Portfolio';
import Gallery from './pages/public/Gallery';
import UpcomingEvents from './pages/public/UpcomingEvents';
import Contact from './pages/public/Contact';

// Lazy-loaded Auth Pages
const Login = lazy(() => import('./auth/pages/Login'));
const RegisterClient = lazy(() => import('./auth/pages/RegisterClient').then(m => ({ default: m.RegisterClient })));
const RegisterAdmin = lazy(() => import('./auth/pages/RegisterAdmin').then(m => ({ default: m.RegisterAdmin })));
const ForgotPassword = lazy(() => import('./auth/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Unauthorized = lazy(() => import('./auth/pages/Unauthorized').then(m => ({ default: m.Unauthorized })));

// Lazy-loaded Dashboard Layouts
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const ClientLayout = lazy(() => import('./layouts/ClientLayout'));
const PartnerLayout = lazy(() => import('./layouts/PartnerLayout'));

// Lazy-loaded Admin Pages
const AdminOverview = lazy(() => import('./pages/admin/Overview'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminEvents = lazy(() => import('./pages/admin/Events'));
const AdminClients = lazy(() => import('./pages/admin/Clients'));
const AdminPartners = lazy(() => import('./pages/admin/Partners'));
const AdminBookings = lazy(() => import('./pages/admin/Bookings'));
const AdminMedia = lazy(() => import('./pages/admin/Media'));
const AdminPortfolio = lazy(() => import('./pages/admin/Portfolio'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery'));
const AdminClosure = lazy(() => import('./pages/admin/Closure'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Lazy-loaded Client Pages
const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const ClientEvents = lazy(() => import('./pages/client/Events'));
const ClientDocuments = lazy(() => import('./pages/client/Documents'));
const ClientGallery = lazy(() => import('./pages/client/Gallery'));
const ClientMessages = lazy(() => import('./pages/client/Messages'));
const ClientProfile = lazy(() => import('./pages/client/Profile'));

// Lazy-loaded Partner Pages
const PartnerDashboard = lazy(() => import('./pages/partner/Dashboard'));
const PartnerProjects = lazy(() => import('./pages/partner/Projects'));
const PartnerMedia = lazy(() => import('./pages/partner/Media'));
const PartnerMessages = lazy(() => import('./pages/partner/Messages'));
const PartnerProfile = lazy(() => import('./pages/partner/Profile'));

// Lazy-loaded Placeholders
const AdminPayments = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.AdminPayments })));
const PartnerReports = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.PartnerReports })));
const PartnerPayments = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.PartnerPayments })));
const PartnerDocuments = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.PartnerDocuments })));
const ClientProgress = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.ClientProgress })));
const ClientPayments = lazy(() => import('./pages/dashboard/PlaceholderPages').then(m => ({ default: m.ClientPayments })));

// Minimal Loading Fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-amber-500">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
  </div>
);

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Continuous Experience */}
          <Route path="/" element={<Journey />} />

          {/* Public SEO & Deep Link Redirects */}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Page Routes (Redirect if already logged in) */}
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/register/client" element={<RedirectIfAuthenticated><RegisterClient /></RedirectIfAuthenticated>} />
          <Route path="/register/admin" element={<RedirectIfAuthenticated><RegisterAdmin /></RedirectIfAuthenticated>} />
          <Route path="/forgot-password" element={<RedirectIfAuthenticated><ForgotPassword /></RedirectIfAuthenticated>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Admin Console Routes */}
          <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout /></RequireAuth>}>
            <Route index element={<AdminOverview />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminClosure />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Protected Partner Panel Routes */}
          <Route path="/partner" element={<RequireAuth allowedRoles={['partner']}><PartnerLayout /></RequireAuth>}>
            <Route index element={<PartnerDashboard />} />
            <Route path="projects" element={<PartnerProjects />} />
            <Route path="media" element={<PartnerMedia />} />
            <Route path="messages" element={<PartnerMessages />} />
            <Route path="profile" element={<PartnerProfile />} />
            <Route path="reports" element={<PartnerReports />} />
            <Route path="payments" element={<PartnerPayments />} />
            <Route path="documents" element={<PartnerDocuments />} />
          </Route>

          {/* Protected Client Console Routes */}
          <Route path="/client" element={<RequireAuth allowedRoles={['client']}><ClientLayout /></RequireAuth>}>
            <Route index element={<ClientDashboard />} />
            <Route path="events" element={<ClientEvents />} />
            <Route path="documents" element={<ClientDocuments />} />
            <Route path="gallery" element={<ClientGallery />} />
            <Route path="messages" element={<ClientMessages />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="progress" element={<ClientProgress />} />
            <Route path="payments" element={<ClientPayments />} />
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default function App() {
  return (
    <PerfTierProvider>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    borderRadius: '16px',
                    padding: '12px 20px',
                  },
                }}
              />
            </BrowserRouter>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </PerfTierProvider>
  );
}
