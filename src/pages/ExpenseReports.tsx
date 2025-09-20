import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReportFilters from "@/components/ReportFilters";
import FinancialReportHeader from "@/components/FinancialReportHeader";
import ReportFooter from "@/components/ReportFooter";
import { 
  TrendingDown,
  Users,
  PieChart,
  FileText,
  Calendar,
  Download,
  Eye,
  Filter
} from "lucide-react";

const ExpenseReports = () => {
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

  const expenseReports = [
    {
      name: "Expenses by Vendor",
      description: "Spending breakdown and trends by vendor",
      icon: Users,
      lastGenerated: "2 hours ago",
      insight: "Top vendor: Office Supply Co. ($3,450)"
    },
    {
      name: "Expenses by Category",
      description: "Expense analysis across all categories",
      icon: PieChart,
      lastGenerated: "4 hours ago",
      insight: "Office Supplies: 28% of expenses"
    },
    {
      name: "Vendor Balance Summary",
      description: "Outstanding balances owed to vendors",
      icon: FileText,
      lastGenerated: "1 hour ago",
      insight: "$18,540 total outstanding"
    },
    {
      name: "Expense Trends",
      description: "Monthly and yearly expense trend analysis",
      icon: TrendingDown,
      lastGenerated: "6 hours ago",
      insight: "-5.2% vs last month"
    },
    {
      name: "1099 Contractor Report",
      description: "Payments to contractors for tax reporting",
      icon: FileText,
      lastGenerated: "1 day ago",
      insight: "12 contractors, $34,500 paid"
    },
    {
      name: "Mileage & Travel Report",
      description: "Business travel and mileage tracking",
      icon: FileText,
      lastGenerated: "3 hours ago",
      insight: "2,450 miles, $1,225 deduction"
    }
  ];

  const expenseMetrics = [
    {
      title: "Total Expenses (MTD)",
      value: "$23,456.00",
      change: "-5.2%",
      trend: "down"
    },
    {
      title: "Active Vendors",
      value: "67",
      change: "+3 new",
      trend: "up"
    },
    {
      title: "Avg. Transaction",
      value: "$285.60",
      change: "+8.1%",
      trend: "up"
    },
    {
      title: "Outstanding Bills",
      value: "12",
      change: "Due this week",
      trend: "neutral"
    }
  ];

  const topVendors = [
    { name: "Office Supply Co.", spent: "$3,450.00", transactions: 15 },
    { name: "Software Solutions Inc", spent: "$2,890.00", transactions: 8 },
    { name: "Utility Company", spent: "$1,750.00", transactions: 3 },
    { name: "Marketing Agency", spent: "$1,200.00", transactions: 2 },
  ];

  const expenseCategories = [
    { category: "Office Supplies", amount: "$6,234.50", percentage: "28%" },
    { category: "Software & Tools", amount: "$4,899.00", percentage: "22%" },
    { category: "Utilities", amount: "$3,765.30", percentage: "17%" },
    { category: "Marketing", amount: "$2,800.00", percentage: "13%" },
    { category: "Travel", amount: "$1,950.20", percentage: "9%" },
    { category: "Other", amount: "$2,343.00", percentage: "11%" },
  ];

  return (
    <MainLayout title="Expense Reports" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Expense Report Header */}
        <FinancialReportHeader 
          reportTitle="Expense & Vendor Reports"
          reportPeriod="March 1, 2024 - March 31, 2024"
          subtitle="Business Expense Analysis & Vendor Performance"
        />

        {/* Expense Report Filters */}
        <ReportFilters 
          onFiltersChange={(filters) => {
            // Apply expense report filters
          }}
          showCustomerFilter={false}
        />

        {/* Expense Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {expenseMetrics.map((metric) => (
            <Card key={metric.title} className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className={`flex items-center text-xs ${
                  metric.trend === "up" ? "text-qb-green" : 
                  metric.trend === "down" ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {metric.trend !== "neutral" && <TrendingDown className="mr-1 h-3 w-3" />}
                  {metric.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Expense Reports */}
          <div className="lg:col-span-2">
            <Card className="shadow-qb-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Expense Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseReports.map((report) => {
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

          {/* Top Vendors & Categories */}
          <div className="space-y-6">
            <Card className="shadow-qb-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Top Vendors (MTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVendors.map((vendor, index) => (
                    <div key={vendor.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">{vendor.transactions} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{vendor.spent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-qb-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Categories (MTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenseCategories.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">{cat.percentage} of total</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{cat.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Report Footer */}
        <ReportFooter 
          disclaimer="Expense reports include all business expenditures and vendor transactions for tax and compliance purposes."
        />
      </div>
    </MainLayout>
  );
};

export default ExpenseReports;