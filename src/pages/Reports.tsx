import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReportFilters from "@/components/ReportFilters";
import { 
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Eye,
  Plus
} from "lucide-react";

const Reports = () => {
  const reportsSubNav = [
    { name: "Overview", href: "/reports" },
    { name: "Financial", href: "/reports/financial" },
    { name: "Sales", href: "/reports/sales" },
    { name: "Expenses", href: "/reports/expenses" },
    { name: "Custom", href: "/reports/custom" },
  ];

  const reportCategories = [
    {
      title: "Financial Reports",
      description: "Core financial statements and analysis",
      reports: [
        { name: "Profit & Loss", description: "Revenue and expenses over time", icon: TrendingUp },
        { name: "Balance Sheet", description: "Assets, liabilities, and equity", icon: BarChart3 },
        { name: "Cash Flow", description: "Money in and out of your business", icon: FileText },
        { name: "Trial Balance", description: "All accounts and their balances", icon: PieChart },
      ]
    },
    {
      title: "Sales Reports",
      description: "Customer and sales performance insights", 
      reports: [
        { name: "Sales by Customer", description: "Revenue breakdown by customer", icon: TrendingUp },
        { name: "Sales by Product", description: "Product performance analysis", icon: BarChart3 },
        { name: "Invoice Details", description: "Detailed invoice information", icon: FileText },
        { name: "Customer Balance", description: "Outstanding customer balances", icon: PieChart },
      ]
    },
    {
      title: "Expense Reports",
      description: "Spending analysis and vendor insights",
      reports: [
        { name: "Expenses by Vendor", description: "Spending breakdown by vendor", icon: TrendingUp },
        { name: "Expenses by Category", description: "Expense category analysis", icon: PieChart },
        { name: "Vendor Balance", description: "Outstanding vendor balances", icon: BarChart3 },
        { name: "1099 Details", description: "Tax form preparation data", icon: FileText },
      ]
    },
  ];

  const quickReports = [
    {
      title: "This Month P&L",
      description: "Profit & Loss for current month",
      value: "$21,778.00",
      change: "+18.7%",
      trend: "up"
    },
    {
      title: "Cash on Hand",
      description: "Available cash across all accounts",
      value: "$74,567.89", 
      change: "+12.3%",
      trend: "up"
    },
    {
      title: "A/R Outstanding",
      description: "Accounts receivable balance",
      value: "$8,945.00",
      change: "-5.3%",
      trend: "down"
    },
    {
      title: "A/P Outstanding", 
      description: "Accounts payable balance",
      value: "$4,231.56",
      change: "+8.9%",
      trend: "up"
    },
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <Calendar className="mr-2 h-4 w-4" />
        Date Range
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export All
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Custom Report
      </Button>
    </div>
  );

  return (
    <MainLayout 
      title="Reports" 
      headerActions={headerActions}
      subNavigation={reportsSubNav}
    >
      <div className="space-y-6">
        {/* Report Filters */}
        <ReportFilters 
          onFiltersChange={(filters) => console.log('Filters changed:', filters)}
        />

        {/* Quick Report Summary */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickReports.map((report) => {
            const TrendIcon = report.trend === "up" ? TrendingUp : TrendingUp;
            return (
              <Card key={report.title} className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {report.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{report.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{report.value}</div>
                  <div className={`flex items-center text-xs ${
                    report.trend === "up" ? "text-qb-green" : "text-destructive"
                  }`}>
                    <TrendIcon className="mr-1 h-3 w-3" />
                    {report.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Report Categories */}
        {reportCategories.map((category) => (
          <Card key={category.title} className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{category.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {category.reports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.name}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{report.name}</h4>
                          <p className="text-xs text-muted-foreground">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Recently Generated Reports */}
        <Card className="shadow-qb-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recently Generated Reports</CardTitle>
            <Button variant="outline" size="sm">
              View All Reports
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Profit & Loss - March 2024",
                  type: "Financial",
                  generated: "2 hours ago",
                  size: "1.2 MB"
                },
                {
                  name: "Sales by Customer - Q1 2024", 
                  type: "Sales",
                  generated: "1 day ago",
                  size: "856 KB"
                },
                {
                  name: "Balance Sheet - February 2024",
                  type: "Financial",
                  generated: "3 days ago",
                  size: "743 KB"
                },
                {
                  name: "Expenses by Category - March 2024",
                  type: "Expenses", 
                  generated: "5 days ago",
                  size: "1.1 MB"
                },
              ].map((report) => (
                <div key={report.name} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.type} • Generated {report.generated} • {report.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;