import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReportFilters from "@/components/ReportFilters";
import FinancialReportHeader from "@/components/FinancialReportHeader";
import ReportFooter from "@/components/ReportFooter";
import { 
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Calendar,
  Download,
  Eye,
  Filter
} from "lucide-react";

const Financial = () => {
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

  const financialReports = [
    {
      name: "Profit & Loss Statement",
      description: "Revenue, expenses, and net income over time",
      icon: TrendingUp,
      lastGenerated: "2 hours ago",
      frequency: "Monthly"
    },
    {
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity at a point in time",
      icon: BarChart3,
      lastGenerated: "1 day ago",
      frequency: "Monthly"
    },
    {
      name: "Cash Flow Statement",
      description: "Cash receipts and payments during a period",
      icon: FileText,
      lastGenerated: "3 days ago",
      frequency: "Monthly"
    },
    {
      name: "Trial Balance",
      description: "List of all accounts and their balances",
      icon: PieChart,
      lastGenerated: "1 week ago",
      frequency: "Monthly"
    },
    {
      name: "General Ledger",
      description: "Detailed record of all financial transactions",
      icon: FileText,
      lastGenerated: "5 days ago",
      frequency: "Weekly"
    },
    {
      name: "Budget vs Actual",
      description: "Compare actual performance to budget",
      icon: BarChart3,
      lastGenerated: "1 day ago",
      frequency: "Monthly"
    },
    {
      name: "Accounts Receivable Aging",
      description: "Outstanding customer invoices by age",
      icon: TrendingUp,
      lastGenerated: "6 hours ago",
      frequency: "Weekly"
    },
    {
      name: "Accounts Payable Aging",
      description: "Outstanding vendor bills by age",
      icon: PieChart,
      lastGenerated: "12 hours ago",
      frequency: "Weekly"
    }
  ];

  const quickMetrics = [
    {
      title: "Net Income (MTD)",
      value: "$21,778.00",
      change: "+18.7%",
      trend: "up"
    },
    {
      title: "Total Assets",
      value: "$324,567.89",
      change: "+5.2%",
      trend: "up"
    },
    {
      title: "Total Liabilities",
      value: "$89,234.56",
      change: "-2.1%",
      trend: "down"
    },
    {
      title: "Working Capital",
      value: "$156,890.23",
      change: "+12.4%",
      trend: "up"
    }
  ];

  return (
    <MainLayout title="Financial Reports" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Financial Report Header */}
        <FinancialReportHeader 
          reportTitle="Financial Reports"
          reportPeriod="March 1, 2024 - March 31, 2024"
          subtitle="Core Financial Statements"
        />

        {/* Financial Report Filters */}
        <ReportFilters 
          onFiltersChange={(filters) => {
            // Apply financial report filters
          }}
          showCustomerFilter={false}
          showVendorFilter={false}
          showTransactionType={false}
        />

        {/* Quick Financial Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickMetrics.map((metric) => (
            <Card key={metric.title} className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className={`flex items-center text-xs ${
                  metric.trend === "up" ? "text-qb-green" : "text-destructive"
                }`}>
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {metric.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Financial Reports Grid */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {financialReports.map((report) => {
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
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Generated: {report.lastGenerated}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            Frequency: {report.frequency}
                          </span>
                        </div>
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
        
        {/* Report Footer */}
        <ReportFooter 
          disclaimer="These financial reports are prepared in accordance with Generally Accepted Accounting Principles (GAAP)."
        />
      </div>
    </MainLayout>
  );
};

export default Financial;