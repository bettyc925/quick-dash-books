import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Banking from "./pages/Banking";
import Reports from "./pages/Reports";
import Accountant from "./pages/Accountant";
import Payroll from "./pages/Payroll";
import Taxes from "./pages/Taxes";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import Estimates from "./pages/Estimates";
import Products from "./pages/Products";
import Bills from "./pages/Bills";
import Vendors from "./pages/Vendors";
import PurchaseOrders from "./pages/PurchaseOrders";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Reconciliation from "./pages/Reconciliation";
import Financial from "./pages/Financial";
import SalesReports from "./pages/SalesReports";
import ExpenseReports from "./pages/ExpenseReports";
import Consolidations from "./pages/Consolidations";
import CompanyMergeRequests from "./pages/CompanyMergeRequests";
import CustomReports from "./pages/CustomReports";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import CreateClient from "./pages/CreateClient";
import ClientList from "./pages/ClientList";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }
  
  // Redirect authenticated users who haven't completed profile setup
  const shouldRedirectToProfileSetup = user && profile && !profile.setup_completed && 
    !window.location.pathname.includes('/profile-setup') && 
    !window.location.pathname.includes('/auth');
  
  if (shouldRedirectToProfileSetup) {
    return <Navigate to="/profile-setup" replace />;
  }

  // Smart routing based on user role after authentication
  const getDefaultRoute = () => {
    if (!user || !profile) return '/auth';
    
    // Bookkeepers should see client list to select which company to manage
    if (profile.role.startsWith('bookkeeper')) {
      return '/client-list';
    }
    
    // Clients should see their company dashboard directly
    return '/dashboard';
  };
  
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to={getDefaultRoute()} replace /> : <Auth />} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/create-client" element={<ProtectedRoute><CreateClient /></ProtectedRoute>} />
      <Route path="/client-list" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Navigate to={getDefaultRoute()} replace /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/sales/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/sales/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/sales/estimates" element={<ProtectedRoute><Estimates /></ProtectedRoute>} />
      <Route path="/sales/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/expenses/bills" element={<ProtectedRoute><Bills /></ProtectedRoute>} />
      <Route path="/expenses/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
      <Route path="/expenses/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/banking/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
      <Route path="/banking/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/banking/reconcile" element={<ProtectedRoute><Reconciliation /></ProtectedRoute>} />
      <Route path="/reports/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
      <Route path="/reports/sales" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} />
      <Route path="/reports/expenses" element={<ProtectedRoute><ExpenseReports /></ProtectedRoute>} />
      <Route path="/reports/custom" element={<ProtectedRoute><CustomReports /></ProtectedRoute>} />
      <Route path="/consolidations" element={<ProtectedRoute><Consolidations /></ProtectedRoute>} />
      <Route path="/company-merge-requests" element={<ProtectedRoute><CompanyMergeRequests /></ProtectedRoute>} />
      <Route path="/banking" element={<ProtectedRoute><Banking /></ProtectedRoute>} />
      <Route path="/accountant" element={<ProtectedRoute><Accountant /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/taxes" element={<ProtectedRoute><Taxes /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
