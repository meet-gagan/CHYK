import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Eagerly loaded for instant first paint
import { HomePage } from './pages/HomePage';

// Code-split secondary routes for fast initial load & small bundle size
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyActivityPage = lazy(() => import('./pages/MyActivityPage'));
const VerifyPassPage = lazy(() => import('./pages/VerifyPassPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const YourThoughtsPage = lazy(() => import('./pages/YourThoughtsPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const RouteMapPage = lazy(() => import('./pages/RouteMapPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const WellnessCentersPage = lazy(() => import('./pages/WellnessCentersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MarathonComingSoonPage = lazy(() => import('./pages/MarathonComingSoonPage'));

import { MarathonSiteSettingsProvider } from './context/MarathonSiteSettingsContext';
import { MarathonSiteAccessGate } from './components/MarathonSiteAccessGate';
import { useAuth } from './context/AuthContext';
import { RegistrationAuthModal } from './components/auth/RegistrationAuthModal';

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-3 border-[var(--orange)] border-t-transparent animate-spin" />
    </div>
  );
}

// Marathon Layout containing Marathon Navbar and Footer
function MarathonLayout() {
  const { authModalState, closeAuthModal } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[var(--orange)] selection:text-white w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20 w-full max-w-full overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />

      {/* Global Registration Auth Modal (Asks Sign Up or Login when clicking Register Now) */}
      <RegistrationAuthModal
        isOpen={Boolean(authModalState?.isOpen)}
        onClose={closeAuthModal}
        initialMode={authModalState?.mode || 'signup'}
        prefill={authModalState?.prefill || {}}
        onAuthSuccess={authModalState?.onAuthSuccess}
        pendingAction={authModalState?.pendingAction || 'REGISTER_NOW'}
        redirectUrl={authModalState?.redirectUrl || '/register'}
      />
    </div>
  );
}

// Scroll to top helper on route change, preserving anchor hash links
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        try {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        } catch (_) {}
      }, 50);
      return;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MarathonSiteSettingsProvider>
          <Router>
            <ScrollToTop />
            <MarathonSiteAccessGate>
              <Routes>
                {/* Standalone Coming Soon / Launch Routes */}
                <Route path="/coming-soon" element={<Suspense fallback={<PageLoader />}><MarathonComingSoonPage /></Suspense>} />
                <Route path="/comming-soon" element={<Suspense fallback={<PageLoader />}><MarathonComingSoonPage /></Suspense>} />
                <Route path="/launch" element={<Suspense fallback={<PageLoader />}><MarathonComingSoonPage /></Suspense>} />
                <Route path="/teaser" element={<Suspense fallback={<PageLoader />}><MarathonComingSoonPage /></Suspense>} />

                <Route element={<MarathonLayout />}>
                  {/* Marathon Landing Page */}
                  <Route path="/" element={<HomePage />} />

                  {/* Dedicated About The Marathon Page */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/about-us" element={<AboutPage />} />
                  <Route path="/about-the-marathon" element={<AboutPage />} />

              {/* Dedicated FAQs Page with Ask Your FAQ doubt submission */}
              <Route path="/faqs" element={<FaqPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/lets-connect" element={<Navigate to="/faqs" replace />} />
              <Route path="/contact" element={<Navigate to="/faqs" replace />} />

              {/* Dedicated Public Udaan (Videos) Page */}
              <Route path="/udaan" element={<VideosPage />} />
              <Route path="/videos" element={<VideosPage />} />

              {/* Dedicated Wellness Centers Directory Page */}
              <Route path="/wellness-centers" element={<WellnessCentersPage />} />
              <Route path="/wellness" element={<WellnessCentersPage />} />

              {/* Your Thoughts & Community Story Board */}
              <Route path="/your-thoughts" element={<YourThoughtsPage />} />
              <Route path="/story-board" element={<YourThoughtsPage />} />
              <Route path="/storyboard" element={<YourThoughtsPage />} />

              {/* Dedicated Route Map Page (Public - No signup/login required to view) */}
              <Route path="/route-map" element={<RouteMapPage />} />
              <Route path="/route" element={<RouteMapPage />} />
              <Route path="/marathon-map" element={<RouteMapPage />} />

              {/* Terms and Conditions Page */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/terms-conditions" element={<TermsPage />} />

              {/* Marathon Registration Page */}
              <Route path="/register" element={<RegistrationPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* User Account & Passes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-activity"
                element={
                  <ProtectedRoute>
                    <MyActivityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-registrations"
                element={
                  <ProtectedRoute>
                    <MyActivityPage />
                  </ProtectedRoute>
                }
              />

              {/* Entry Pass Verification Route (Opaque / QR Scan verification) */}
              <Route path="/verify-pass/:passId" element={<VerifyPassPage />} />
              <Route path="/pass/:passId/verify" element={<VerifyPassPage />} />
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MarathonSiteAccessGate>
      </Router>
    </MarathonSiteSettingsProvider>
  </AuthProvider>
</ThemeProvider>
  );
}

export default App;
