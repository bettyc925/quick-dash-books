import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReportFilters from "@/components/ReportFilters";
import FinancialReportHeader from "@/components/FinancialReportHeader";
import ReportFooter from "@/components/ReportFooter";
import { 
  TrendingUp,
  Users,
  Package,
  FileText,
  Calendar,
  Download,
  Eye,
  Filter
} from "lucide-react";

const SalesReports = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <Calendar className="mr-2 h-4 w-4" />
        Date Range
      </Button>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export All
      </Button>
    </div>
  );

  const salesReports = [
    {
      name: "Sales by Customer",
      description: "Revenue breakdown and trends by customer",
      icon: Users,
      lastGenerated: "1 hour ago",
      insight: "Top customer: ABC Corp ($12,450)"
    },
    {
      name: "Sales by Product/Service",
      description: "Performance analysis of products and services",
      icon: Package,
      lastGenerated: "3 hours ago",
      insight: "Best seller: Consulting Services"
    },
    {
      name: "Invoice Aging Summary",
      description: "Outstanding invoices organized by age",
      icon: FileText,
      lastGenerated: "6 hours ago",
      insight: "$8,945 overdue (12 invoices)"
    },
    {
      name: "Sales Trends",
      description: "Monthly and yearly sales trend analysis",
      icon: TrendingUp,
      lastGenerated: "1 day ago",
      insight: "+23% growth vs last quarter"
    },
    {
      name: "Customer Balance Detail",
      description: "Detailed view of customer outstanding balances",
      icon: Users,
      lastGenerated: "2 hours ago",
      insight: "142 active customers"
    },
    {
      name: "Sales Tax Summary",
      description: "Sales tax collected by period and location",
      icon: FileText,
      lastGenerated: "4 hours ago",
      insight: "$2,156 tax collected this month"
    }
  ];

  const salesMetrics = [
    {
      title: "Total Sales (MTD)",
      value: "$45,234.00",
      change: "+18.2%",
      trend: "up"
    },
    {
      title: "Active Customers",
      value: "142",
      change: "+5 new",
      trend: "up"
    },
    {
      title: "Avg. Invoice Value",
      value: "$1,850.00",
      change: "+12.5%",
      trend: "up"
    },
    {
      title: "Collection Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up"
    }
  ];

  const topCustomers = [
    { name: "ABC Corporation", sales: "$12,450.00", invoices: 8 },
    { name: "Tech Solutions Inc", sales: "$8,750.00", invoices: 5 },
    { name: "Global Enterprises", sales: "$6,890.00", invoices: 12 },
    { name: "Local Business LLC", sales: "$4,230.00", invoices: 6 },
  ];

  return (
    <MainLayout title="Sales Reports" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Sales Report Header */}
        <FinancialReportHeader 
          reportTitle="Sales & Revenue Reports"
          reportPeriod="March 1, 2024 - March 31, 2024"
          subtitle="Customer & Product Performance Analysis"
        />

        {/* Sales Report Filters */}
        <ReportFilters 
          onFiltersChange={(filters) => console.log("Sales filters:", filters)}
          showVendorFilter={false}
          showTransactionType={false}
        />

        {/* Sales Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {salesMetrics.map((metric) => (
            <Card key={metric.title} className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="flex items-center text-xs text-qb-green">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {metric.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sales Reports */}
          <div className="lg:col-span-2">
            <Card className="shadow-qb-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Sales Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesReports.map((report) => {
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
                            <p className="text-xs text-qb-green font-medium mt-1">
                              {report.insight}
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Customers */}
          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Customers (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.invoices} invoices</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{customer.sales}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Report Footer */}
        <ReportFooter 
          disclaimer="Sales reports include all revenue transactions and customer activity for the specified period."
        />
      </div>
    </MainLayout>
  );
};

export default SalesReports;