import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Receipt,
  CreditCard,
  Users,
  Calendar,
  Eye,
  Edit,
  MoreHorizontal,
  Upload
} from "lucide-react";

const Expenses = () => {
  const expensesSubNav = [
    { name: "Overview", href: "/expenses" },
    { name: "Expenses", href: "/expenses/all" },
    { name: "Vendors", href: "/expenses/vendors" },
    { name: "Bills", href: "/expenses/bills" },
    { name: "Purchase Orders", href: "/expenses/purchase-orders" },
  ];

  const expenseStats = [
    {
      title: "Total Expenses",
      value: "$23,456.00",
      icon: CreditCard,
    },
    {
      title: "Active Vendors",
      value: "67",
      icon: Users,
    },
    {
      title: "Pending Bills",
      value: "12",
      icon: Receipt,
    },
    {
      title: "This Month",
      value: "$4,892.00",
      icon: Calendar,
    },
  ];

  const recentExpenses = [
    {
      id: "EXP-001",
      vendor: "Office Supply Co.",
      category: "Office Supplies",
      amount: "$156.78",
      status: "Paid",
      date: "Mar 15, 2024"
    },
    {
      id: "EXP-002",
      vendor: "Software Solutions Inc",
      category: "Software",
      amount: "$99.00",
      status: "Pending",
      date: "Mar 14, 2024"
    },
    {
      id: "EXP-003",
      vendor: "Utility Company",
      category: "Utilities",
      amount: "$245.50",
      status: "Overdue",
      date: "Mar 10, 2024"
    },
    {
      id: "EXP-004",
      vendor: "Marketing Agency",
      category: "Marketing",
      amount: "$1,200.00",
      status: "Draft",
      date: "Mar 12, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Paid: "bg-qb-green text-white",
      Pending: "bg-qb-blue text-white", 
      Overdue: "bg-destructive text-white",
      Draft: "bg-muted text-muted-foreground",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <Upload className="mr-2 h-4 w-4" />
        Upload Receipt
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Expense
      </Button>
    </div>
  );

  return (
    <MainLayout 
      title="Expenses" 
      headerActions={headerActions}
      subNavigation={expensesSubNav}
    >
      <div className="space-y-6">
        {/* Expense Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {expenseStats.map((stat) => {
            const Icon = stat.icon;
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Expenses */}
        <Card className="shadow-qb-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
            <Button variant="outline" size="sm">
              View All Expenses
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Expense #
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Vendor
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-primary">{expense.id}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-foreground">{expense.vendor}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{expense.category}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{expense.amount}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(expense.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{expense.date}</span>
                      </td>
                      <td className="py-3 px-1">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories Overview */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Expense Categories This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { category: "Office Supplies", amount: "$1,234.50", percentage: "25%" },
                { category: "Software & Tools", amount: "$899.00", percentage: "18%" },
                { category: "Utilities", amount: "$765.30", percentage: "16%" },
                { category: "Marketing", amount: "$1,200.00", percentage: "24%" },
                { category: "Travel", amount: "$450.20", percentage: "9%" },
                { category: "Other", amount: "$343.00", percentage: "7%" },
              ].map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage} of total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Expense Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Receipt className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add Expense</h3>
              <p className="text-sm text-muted-foreground">Record a new business expense</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manage Vendors</h3>
              <p className="text-sm text-muted-foreground">Add and organize vendor information</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Bills & Payments</h3>
              <p className="text-sm text-muted-foreground">Track bills and payment schedules</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Expenses;