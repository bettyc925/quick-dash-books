import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  Receipt,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Accountant = () => {
  const { profile } = useAuth();

  // Only admin users can access accountant features
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const accountingTasks = [
    { title: "Chart of Accounts", icon: FileText, color: "bg-qb-blue" },
    { title: "Journal Entries", icon: Calculator, color: "bg-qb-green" },
    { title: "Financial Statements", icon: TrendingUp, color: "bg-accent" },
    { title: "Reconciliation", icon: DollarSign, color: "bg-primary" },
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        Export Reports
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        New Entry
      </Button>
    </div>
  );

  return (
    <MainLayout title="Accountant Tools" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Accounting Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Assets
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$125,430</div>
              <div className="flex items-center text-xs text-qb-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5.2%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Liabilities
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$45,200</div>
              <div className="flex items-center text-xs text-destructive">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.1%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equity
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$80,230</div>
              <div className="flex items-center text-xs text-qb-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                +7.3%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Month End
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">15 Days</div>
              <div className="text-xs text-muted-foreground">Until close</div>
            </CardContent>
          </Card>
        </div>

        {/* Accounting Tools */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Accounting Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {accountingTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <Button
                    key={task.title}
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-accent"
                  >
                    <div className={`rounded-full p-2 ${task.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center">{task.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Accounting Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Monthly depreciation entry
                  </p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Entry #1024
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Bank reconciliation completed
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="text-sm font-medium text-qb-green">
                  Balanced
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Accountant;