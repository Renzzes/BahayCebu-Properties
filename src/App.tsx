import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AgentProvider } from "@/contexts/AgentContext";
import ChatwayWidget from "@/components/ChatwayWidget";

import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Agent from "./pages/Agent";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./Admin/Dashboard";

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
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return <ChatwayWidget />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AgentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/properties" element={<MainLayout><Properties /></MainLayout>} />
              <Route path="/properties/:id" element={<MainLayout><PropertyDetail /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Agent /></MainLayout>} />
              <Route path="/admin/*" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
            <ChatwayWidgetWrapper />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </AgentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
