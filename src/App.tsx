import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { CompanyProvider, useCompany } from "./contexts/CompanyContext";
import { ErrorBoundary } from '@/components/ui/error-boundary';
import SecurityAuditTrail from '@/components/SecurityAuditTrail';
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
import EditClient from "./pages/EditClient";
import CompanySelection from "./pages/CompanySelection";
import Clients from "./pages/Clients";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { selectedBusiness, selectedClient } = useCompany();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated but hasn't selected a business, redirect to company selection
  const currentPath = window.location.pathname;
  const companyRelatedPaths = ['/company-selection', '/create-client', '/edit-client', '/profile-setup'];
  
  if (!selectedBusiness && !companyRelatedPaths.some(path => currentPath.includes(path))) {
    return <Navigate to="/company-selection" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  const { selectedBusiness, selectedClient } = useCompany();
  
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

  // Smart routing based on user authentication status
  const getDefaultRoute = () => {
    if (!user || !profile) return '/auth';
    
    // If no business is selected, go to company selection
    if (!selectedBusiness) {
      return '/company-selection';
    }
    
    // Otherwise go to dashboard
    return '/dashboard';
  };
  
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to={getDefaultRoute()} replace /> : <Auth />} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/edit-client/:companyId" element={<ProtectedRoute><EditClient /></ProtectedRoute>} />
      <Route path="/create-client" element={<ProtectedRoute><CreateClient /></ProtectedRoute>} />
      <Route path="/company-selection" element={<ProtectedRoute><CompanySelection /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
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
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CompanyProvider>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
              <SecurityAuditTrail />
            </CompanyProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
