import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Receipt, 
  CreditCard, 
  Banknote, 
  FileText, 
  Users, 
  Settings,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Sales", href: "/sales", icon: Receipt },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Banking", href: "/banking", icon: Banknote },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Customers", href: "/customers", icon: Users },
];

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  headerActions?: React.ReactNode;
  subNavigation?: Array<{
    name: string;
    href: string;
    isActive?: boolean;
  }>;
}

export default function MainLayout({ 
  children, 
  title, 
  headerActions, 
  subNavigation 
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b bg-gradient-qb">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-primary-foreground">
                QuickBooks
              </h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-primary-foreground hover:bg-qb-green-light"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    sidebarOpen ? "mr-3" : "mx-auto"
                  )} />
                  {sidebarOpen && item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t">
            <NavLink
              to="/settings"
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                sidebarOpen ? "" : "justify-center"
              )}
            >
              <Settings className={cn(
                "h-5 w-5 flex-shrink-0",
                sidebarOpen ? "mr-3" : ""
              )} />
              {sidebarOpen && "Settings"}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        {/* Header */}
        <header className="bg-card border-b shadow-qb-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
            </div>
            {headerActions && (
              <div className="flex items-center space-x-4">
                {headerActions}
              </div>
            )}
          </div>

          {/* Sub Navigation */}
          {subNavigation && (
            <div className="border-t bg-qb-gray-50">
              <nav className="flex space-x-8 px-6">
                {subNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors",
                      item.isActive || location.pathname === item.href
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    )}
                  >
                    {item.name}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}