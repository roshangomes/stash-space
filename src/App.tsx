import React from 'react';
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from './store/store';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { CustomerSignupPage } from './pages/auth/CustomerSignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { BrowseEquipment } from './pages/customer/BrowseEquipment';
import { MyBookings } from './pages/customer/MyBookings';
import { LandingPage } from './pages/LandingPage';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Vendor Auth Routes */}
            <Route path="/vendor/login" element={<LoginPage />} />
            <Route path="/login" element={<Navigate to="/vendor/login" replace />} />

            {/* Customer Auth Routes */}
            <Route path="/customer/login" element={<CustomerLoginPage />} />
            <Route path="/customer/register" element={<CustomerSignupPage />} />

            {/* Vendor Protected Routes */}
            <Route element={<ProtectedRoute requiredRole="vendor"><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/bookings" element={<div className="p-6"><h1 className="text-2xl font-bold">Vendor Bookings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/orders" element={<div className="p-6"><h1 className="text-2xl font-bold">Orders</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Vendor Profile</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            </Route>

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute requiredRole="customer"><CustomerLayout /></ProtectedRoute>}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/browse" element={<BrowseEquipment />} />
              <Route path="/customer/bookings" element={<MyBookings />} />
              <Route path="/customer/favorites" element={<div className="p-6"><h1 className="text-2xl font-bold">Favorites</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/customer/profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Customer Profile</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
