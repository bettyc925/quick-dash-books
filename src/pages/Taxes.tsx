import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText,
  Calendar,
  AlertTriangle,
  DollarSign,
  Plus,
  TrendingUp,
  Receipt
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Taxes = () => {
  const { profile } = useAuth();

  // Only admin users can access tax features
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        Export Tax Data
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        New Filing
      </Button>
    </div>
  );

  const upcomingFilings = [
    { form: "Form 941", description: "Quarterly Employment Tax", dueDate: "April 30, 2024", amount: "$12,450" },
    { form: "Form 1120", description: "Corporate Income Tax", dueDate: "March 15, 2024", amount: "$8,750" },
    { form: "Sales Tax", description: "Monthly Sales Tax", dueDate: "March 20, 2024", amount: "$3,200" },
  ];

  return (
    <MainLayout title="Tax Management" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Tax Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                YTD Tax Liability
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$45,650</div>
              <div className="flex items-center text-xs text-destructive">
                <TrendingUp className="mr-1 h-3 w-3" />
                +15.2%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tax Payments Made
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$38,200</div>
              <div className="flex items-center text-xs text-qb-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                On schedule
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding Balance
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">$7,450</div>
              <div className="text-xs text-muted-foreground">Due soon</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Filing
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12 Days</div>
              <div className="text-xs text-muted-foreground">Form 941</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tax Filings */}
        <Card className="shadow-qb-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Upcoming Tax Filings</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFilings.map((filing, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {filing.form}
                      </p>
                      <p className="text-xs text-muted-foreground">{filing.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{filing.amount}</p>
                    <p className="text-xs text-muted-foreground">{filing.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Tools and Reports */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tax Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Tax Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Tax Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Make Tax Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="mr-2 h-4 w-4" />
                  View Tax History
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Tax Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Q4 2023 Form 941 filed
                    </p>
                    <p className="text-xs text-muted-foreground">2 weeks ago</p>
                  </div>
                  <div className="text-sm font-medium text-qb-green">
                    Completed
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Sales tax payment processed
                    </p>
                    <p className="text-xs text-muted-foreground">1 month ago</p>
                  </div>
                  <div className="text-sm font-medium text-qb-green">
                    $2,850
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Annual tax return submitted
                    </p>
                    <p className="text-xs text-muted-foreground">2 months ago</p>
                  </div>
                  <div className="text-sm font-medium text-qb-green">
                    Filed
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

export default Taxes;