import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainSite } from "./components/MainSite";

const Login = lazy(() => import("./components/admin/Login").then((m) => ({ default: m.Login })));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import("./components/admin/Dashboard").then((m) => ({ default: m.Dashboard })));
const ProjectsManager = lazy(() => import("./components/admin/ProjectsManager").then((m) => ({ default: m.ProjectsManager })));
const ServicesManager = lazy(() => import("./components/admin/ServicesManager").then((m) => ({ default: m.ServicesManager })));
const FaqManager = lazy(() => import("./components/admin/FaqManager").then((m) => ({ default: m.FaqManager })));
const TestimonialsManager = lazy(() => import("./components/admin/TestimonialsManager").then((m) => ({ default: m.TestimonialsManager })));
const SocialLinksManager = lazy(() => import("./components/admin/SocialLinksManager").then((m) => ({ default: m.SocialLinksManager })));
const SiteSettings = lazy(() => import("./components/admin/SiteSettings").then((m) => ({ default: m.SiteSettings })));
const ProtectedRoute = lazy(() => import("./components/ui/ProtectedRoute").then((m) => ({ default: m.ProtectedRoute })));

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="faqs" element={<FaqManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="social-links" element={<SocialLinksManager />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
