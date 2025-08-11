import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AgentProvider } from "@/contexts/AgentContext";
import ChatwayWidget from "@/components/ChatwayWidget";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyPreview from "./pages/PropertyPreview";
import About from "./pages/About";
import Agent from "./pages/Agent";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./Admin/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const queryClient = new QueryClient();

// Layout component for main routes with Navbar and Footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Admin layout without Navbar and Footer
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">{children}</div>
);

// Component to handle conditional rendering of ChatwayWidget
const ChatwayWidgetWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPreviewRoute = location.pathname.includes('/preview');
  const isAllowedRoute = ['/', '/properties', '/property'].some(path => 
    location.pathname.startsWith(path)
  );
  
  const shouldShowWidget = !isAdminRoute && !isPreviewRoute && isAllowedRoute;
  
  if (!shouldShowWidget) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <ChatwayWidget />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AgentProvider>
          <BrowserRouter>
            <div className="relative">
              <Routes>
                <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                <Route path="/properties" element={<MainLayout><Properties /></MainLayout>} />
                <Route path="/properties/:id" element={<MainLayout><PropertyDetail /></MainLayout>} />
                <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                <Route path="/contact" element={<MainLayout><Agent /></MainLayout>} />
                <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
                {/* Admin Login Route - Standalone page without navbar/footer */}
                <Route path="/admin-login" element={<AdminLogin />} />
                {/* Protected Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/properties/:id/preview" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <PropertyPreview />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
              </Routes>
              <ChatwayWidgetWrapper />
              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </AgentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
