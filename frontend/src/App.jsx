/**
 * Main Application Component for New Gate Chapel
 * 
 * This is the root React component that sets up:
 * - React Router for client-side routing
 * - Code splitting via lazy loading for performance
 * - Authentication provider and protected routes
 * - Global UI elements (background, loader, scroll behavior)
 * 
 * Route Structure:
 * - / - Public pages (Home, About, Services, etc.)
 * - /admin/login - Admin authentication
 * - /admin/* - Protected admin panel (requires authentication)
 * - * - 404 Not Found page
 * 
 * Performance Optimization:
 * - All routes use React.lazy() for code splitting
 * - Suspense boundaries with loading states
 * - Separate chunks for admin vs public pages
 * 
 * @module App
 */

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';

import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackgroundBlobs from './components/common/BackgroundBlobs';
import ScrollToTop from './components/common/ScrollToTop';
import Loader from './components/Loader';
import { useLoader } from './hooks/useLoader';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/common/ErrorBoundary';

// =============================================================================
// LAZY-LOADED PAGE COMPONENTS - Public Pages
// =============================================================================

/**
 * Public pages loaded on-demand for better initial load performance.
 * Each page is code-split into its own chunk.
 */
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Ministries = lazy(() => import('./pages/Ministries'));
const Events = lazy(() => import('./pages/Events'));
const Contact = lazy(() => import('./pages/Contact'));
const Sermons = lazy(() => import('./pages/Sermons'));
const Giving = lazy(() => import('./pages/Giving'));
const LiveStream = lazy(() => import('./pages/LiveStream'));
const PrayerRequest = lazy(() => import('./pages/PrayerRequest'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages - loaded separately
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminRegister = lazy(() => import('./pages/admin/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Admin content management pages
const AboutManagement = lazy(() => import('./pages/admin/content/AboutManagement'));
const EventsManagement = lazy(() => import('./pages/admin/content/EventsManagement'));
const MinistriesManagement = lazy(() => import('./pages/admin/content/MinistriesManagement'));
const ScheduleManagement = lazy(() => import('./pages/admin/content/ScheduleManagement'));
const SermonManagement = lazy(() => import('./pages/admin/content/SermonManagement'));
const LiveStreamManagement = lazy(() => import('./pages/admin/content/LiveStreamManagement'));
const GivingManagement = lazy(() => import('./pages/admin/content/GivingManagement'));
const HomeManagement = lazy(() => import('./pages/admin/content/HomeManagement'));
const MessagesManagement = lazy(() => import('./pages/admin/content/MessagesManagement'));

// Loading fallback component
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <BackgroundBlobs />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "ministries", element: <Ministries /> },
      { path: "events", element: <Events /> },
      { path: "contact", element: <Contact /> },
      { path: "sermons", element: <Sermons /> },
      { path: "giving", element: <Giving /> },
      { path: "live", element: <LiveStream /> },
      { path: "prayer", element: <PrayerRequest /> },
    ]
  },
  {
    path: "/admin/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminRegister />
      </Suspense>
    )
  },
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLogin />
      </Suspense>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        )
      },
      { 
        path: "dashboard", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        )
      },
      { 
        path: "content/home", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomeManagement />
          </Suspense>
        )
      },
      { 
        path: "content/events", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <EventsManagement />
          </Suspense>
        )
      },
      { 
        path: "content/about", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutManagement />
          </Suspense>
        )
      },
      { 
        path: "content/ministries", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <MinistriesManagement />
          </Suspense>
        )
      },
      { 
        path: "content/schedule", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <ScheduleManagement />
          </Suspense>
        )
      },
      { 
        path: "content/sermons", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <SermonManagement />
          </Suspense>
        )
      },
      { 
        path: "content/live-stream", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <LiveStreamManagement />
          </Suspense>
        )
      },
      { 
        path: "content/giving", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <GivingManagement />
          </Suspense>
        )
      },
      { 
        path: "content/messages", 
        element: (
          <Suspense fallback={<PageLoader />}>
            <MessagesManagement />
          </Suspense>
        )
      },
    ]
  },
  // Catch-all route for 404 errors - must be last
  {
    path: "*",
    element: (
      <Layout>
        <BackgroundBlobs />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <NotFound />
        </Suspense>
      </Layout>
    )
  }
],
 {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

function App() {
  const { isLoading, loadingMessage } = useLoader(true, 800);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Loader show={isLoading} message={loadingMessage} />
          <RouterProvider 
            router={router} 
            future={{
              v7_startTransition: true,
            }}
          />
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;


