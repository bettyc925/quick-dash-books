import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  CreditCard,
  FileText,
  Plus,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const quickStats = [
    {
      title: "Total Revenue",
      value: "$45,234.00",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Expenses", 
      value: "$23,456.00",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Net Profit",
      value: "$21,778.00",
      change: "+18.7%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Outstanding Invoices",
      value: "$8,945.00",
      change: "-5.3%",
      trend: "down",
      icon: Receipt,
    },
  ];

  const quickActions = [
    { title: "Create Invoice", icon: FileText, color: "bg-primary" },
    { title: "Add Expense", icon: CreditCard, color: "bg-qb-blue" },
    { title: "Record Payment", icon: DollarSign, color: "bg-qb-green" },
    { title: "New Customer", icon: Plus, color: "bg-accent" },
  ];

  const recentTransactions = [
    { id: 1, description: "Payment from ABC Corp", amount: "+$2,500.00", date: "Today", type: "income" },
    { id: 2, description: "Office Supplies", amount: "-$156.78", date: "Yesterday", type: "expense" },
    { id: 3, description: "Monthly Software License", amount: "-$99.00", date: "2 days ago", type: "expense" },
    { id: 4, description: "Consulting Services", amount: "+$1,200.00", date: "3 days ago", type: "income" },
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        Export
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        New Transaction
      </Button>
    </div>
  );

  return (
    <MainLayout title="Dashboard" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            
            return (
              <Card key={stat.title} className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className={`flex items-center text-xs ${
                    stat.trend === "up" ? "text-qb-green" : "text-destructive"
                  }`}>
                    <TrendIcon className="mr-1 h-3 w-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-accent"
                  >
                    <div className={`rounded-full p-2 ${action.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Reports */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <Card className="shadow-qb-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.type === "income" ? "text-qb-green" : "text-destructive"
                    }`}>
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Chart Placeholder */}
          <Card className="shadow-qb-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cash Flow Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-card rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Cash flow chart coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;