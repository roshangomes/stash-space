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
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
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
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="bookings" element={<div className="p-6"><h1 className="text-2xl font-bold">Bookings Page</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="orders" element={<div className="p-6"><h1 className="text-2xl font-bold">Orders Page</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics Page</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile Page</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings Page</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
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
