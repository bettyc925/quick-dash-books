import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users,
  DollarSign,
  Calendar,
  FileText,
  Plus,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Payroll = () => {
  const { profile } = useAuth();

  // Only admin and manager users can access payroll features
  if (profile && !['admin', 'manager'].includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        Run Payroll
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
    </div>
  );

  const employees = [
    { name: "John Doe", position: "Developer", salary: "$75,000", status: "Active" },
    { name: "Jane Smith", position: "Designer", salary: "$65,000", status: "Active" },
    { name: "Mike Johnson", position: "Manager", salary: "$85,000", status: "Active" },
  ];

  return (
    <MainLayout title="Payroll Management" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Payroll Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="flex items-center text-xs text-qb-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Payroll
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$156,750</div>
              <div className="flex items-center text-xs text-qb-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5.2%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Payroll
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5 Days</div>
              <div className="text-xs text-muted-foreground">March 15th</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tax Filings
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-xs text-destructive">Due this month</div>
            </CardContent>
          </Card>
        </div>

        {/* Employee List */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Employee Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{employee.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{employee.salary}</p>
                    <p className="text-xs text-qb-green">{employee.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payroll Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Process Payroll
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Pay Stubs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Tax Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Payroll Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Payroll processed for February
                    </p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                  <div className="text-sm font-medium text-qb-green">
                    $154,200
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      New employee added
                    </p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Sarah Wilson
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Payroll;