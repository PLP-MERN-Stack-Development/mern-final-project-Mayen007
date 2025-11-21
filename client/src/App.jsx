import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ActivityProvider } from "./context/ActivityContext";

// Pages (eager loading for critical routes)
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";

// Lazy loaded pages (non-critical routes)
const CreateReport = lazy(() => import("./pages/CreateReport"));
const ReportDetail = lazy(() => import("./pages/ReportDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Map = lazy(() => import("./pages/Map"));
const Admin = lazy(() => import("./pages/Admin"));

// Components
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import Navbar from "./components/Navbar";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
  </div>
);

// Layout wrapper to conditionally show Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ActivityProvider>
            <div id="main-content" className="min-h-screen bg-gray-50">
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route
                    path="/reports/:id"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <ReportDetail />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/leaderboard"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Leaderboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Map />
                      </Suspense>
                    }
                  />

                  {/* Protected User Routes (regular users only, admins redirected) */}
                  <Route
                    path="/dashboard"
                    element={
                      <UserRoute>
                        <Dashboard />
                      </UserRoute>
                    }
                  />
                  <Route
                    path="/create-report"
                    element={
                      <UserRoute>
                        <Suspense fallback={<PageLoader />}>
                          <CreateReport />
                        </Suspense>
                      </UserRoute>
                    }
                  />

                  {/* Profile - Both users and admins can access */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Profile />
                        </Suspense>
                      </PrivateRoute>
                    }
                  />

                  {/* Admin-Only Route */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Admin />
                        </Suspense>
                      </AdminRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </div>
          </ActivityProvider>
        </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
