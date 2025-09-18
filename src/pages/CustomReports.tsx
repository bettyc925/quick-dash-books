import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReportFilters from "@/components/ReportFilters";
import FinancialReportHeader from "@/components/FinancialReportHeader";
import ReportFooter from "@/components/ReportFooter";
import { 
  Plus,
  Settings,
  Copy,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  BarChart3
} from "lucide-react";

const CustomReports = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <Settings className="mr-2 h-4 w-4" />
        Templates
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Create Custom Report
      </Button>
    </div>
  );

  const customReports = [
    {
      name: "Monthly Executive Summary",
      description: "Key metrics and KPIs for executive team",
      type: "Dashboard",
      lastRun: "Mar 22, 2024",
      frequency: "Monthly",
      status: "Active",
      creator: "Admin"
    },
    {
      name: "Vendor Performance Analysis",
      description: "Detailed vendor spending and performance metrics",
      type: "Analytical",
      lastRun: "Mar 20, 2024",
      frequency: "Weekly",
      status: "Active",
      creator: "Manager"
    },
    {
      name: "Customer Profitability Report",
      description: "Revenue and costs by customer with profit analysis",
      type: "Profitability",
      lastRun: "Mar 18, 2024",
      frequency: "Monthly",
      status: "Active",
      creator: "Admin"
    },
    {
      name: "Cash Flow Forecast",
      description: "Projected cash inflows and outflows",
      type: "Forecast",
      lastRun: "Mar 15, 2024",
      frequency: "Weekly",
      status: "Draft",
      creator: "Admin"
    },
    {
      name: "Tax Preparation Summary",
      description: "All tax-related transactions and deductions",
      type: "Tax",
      lastRun: "Mar 10, 2024",
      frequency: "Quarterly",
      status: "Inactive",
      creator: "Accountant"
    },
  ];

  const reportTemplates = [
    {
      name: "Budget Variance Analysis",
      description: "Compare actual vs budgeted amounts",
      category: "Financial"
    },
    {
      name: "Inventory Valuation",
      description: "Current inventory value and turnover",
      category: "Inventory"
    },
    {
      name: "Employee Cost Analysis",
      description: "Labor costs and productivity metrics",
      category: "Payroll"
    },
    {
      name: "Project Profitability",
      description: "Revenue and costs by project",
      category: "Project"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Active: "bg-qb-green text-white",
      Draft: "bg-qb-blue text-white",
      Inactive: "bg-muted text-muted-foreground",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      Dashboard: "bg-qb-orange text-white",
      Analytical: "bg-qb-blue text-white",
      Profitability: "bg-qb-green text-white",
      Forecast: "bg-purple-500 text-white",
      Tax: "bg-destructive text-white",
    };
    
    return (
      <Badge variant="outline" className={typeStyles[type as keyof typeof typeStyles]}>
        {type}
      </Badge>
    );
  };

  return (
    <MainLayout title="Custom Reports" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Custom Report Header */}
        <FinancialReportHeader 
          reportTitle="Custom Reports & Analytics"
          reportPeriod="User-Defined Period"
          subtitle="Customized Business Intelligence Reports"
        />

        {/* Custom Report Filters */}
        <ReportFilters 
          onFiltersChange={(filters) => console.log("Custom report filters:", filters)}
        />

        {/* Report Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reports
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-xs text-qb-green">+3 this month</div>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Reports
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">18</div>
              <div className="text-xs text-muted-foreground">75% active rate</div>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reports Run (MTD)
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">147</div>
              <div className="text-xs text-qb-green">+23% vs last month</div>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Runtime
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2.4s</div>
              <div className="text-xs text-qb-green">-15% faster</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Custom Reports List */}
          <div className="lg:col-span-2">
            <Card className="shadow-qb-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">My Custom Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customReports.map((report) => (
                    <div
                      key={report.name}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium text-foreground">{report.name}</h4>
                          {getTypeBadge(report.type)}
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Last run: {report.lastRun}</span>
                          <span>•</span>
                          <span>Frequency: {report.frequency}</span>
                          <span>•</span>
                          <span>Created by: {report.creator}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <Button variant="ghost" size="sm" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Copy">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Templates */}
          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.name}
                    className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground mb-1">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Report Footer */}
        <ReportFooter 
          disclaimer="Custom reports are user-generated and may contain personalized business logic and calculations."
        />
      </div>
    </MainLayout>
  );
};

export default CustomReports;