import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './auth/context/AuthContext';
import { PerfTierProvider } from './components/PerfTierProvider';

// Auth Guards & Pages
import { RequireAuth } from './auth/guards/RequireAuth';
import { RedirectIfAuthenticated } from './auth/guards/RedirectIfAuthenticated';
import Login from './auth/pages/Login';
import { RegisterClient } from './auth/pages/RegisterClient';
import { RegisterAdmin } from './auth/pages/RegisterAdmin';
import { ForgotPassword } from './auth/pages/ForgotPassword';
import { Unauthorized } from './auth/pages/Unauthorized';

// Public Journey & Redirects
import Journey from './journey/Journey';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Portfolio from './pages/public/Portfolio';
import Gallery from './pages/public/Gallery';
import UpcomingEvents from './pages/public/UpcomingEvents';
import Contact from './pages/public/Contact';

// Dashboard Layouts
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import PartnerLayout from './layouts/PartnerLayout';

// Admin Core Modules (Phase 4 Admin Workspace Pages)
import AdminOverview from './pages/admin/Overview';
import AdminAnalytics from './pages/admin/Analytics';
import AdminEvents from './pages/admin/Events';
import AdminClients from './pages/admin/Clients';
import AdminPartners from './pages/admin/Partners';
import AdminBookings from './pages/admin/Bookings';
import AdminMedia from './pages/admin/Media';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminGallery from './pages/admin/Gallery';
import AdminClosure from './pages/admin/Closure';
import AdminSettings from './pages/admin/Settings';

// Client Core Modules (Phase 4 Client Workspace Pages)
import ClientDashboard from './pages/client/Dashboard';
import ClientEvents from './pages/client/Events';
import ClientDocuments from './pages/client/Documents';
import ClientGallery from './pages/client/Gallery';
import ClientMessages from './pages/client/Messages';
import ClientProfile from './pages/client/Profile';

// Partner Core Modules (Phase 4 Partner Workspace Pages)
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerProjects from './pages/partner/Projects';
import PartnerMedia from './pages/partner/Media';
import PartnerMessages from './pages/partner/Messages';
import PartnerProfile from './pages/partner/Profile';

// Leftover Core Dashboards Placeholders
import {
  AdminPayments,
  PartnerReports,
  PartnerPayments,
  PartnerDocuments,
  ClientProgress,
  ClientPayments
} from './pages/dashboard/PlaceholderPages';

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
      <Routes>
        {/* Public Journey (One Continuous 3D Experience) */}
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
          
          {/* Legacy links */}
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
