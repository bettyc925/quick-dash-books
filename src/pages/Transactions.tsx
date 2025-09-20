import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Download
} from "lucide-react";

const Transactions = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search transactions..." 
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  );

  const transactionStats = [
    {
      title: "Total Transactions",
      value: "1,245",
      icon: TrendingUp,
    },
    {
      title: "Total Inflow",
      value: "$185,430.00",
      icon: ArrowDownLeft,
    },
    {
      title: "Total Outflow",
      value: "$123,670.00",
      icon: ArrowUpRight,
    },
    {
      title: "Net Flow",
      value: "$61,760.00",
      icon: DollarSign,
    },
  ];

  const transactions = [
    {
      id: "TXN-001",
      description: "Payment from ABC Corporation",
      account: "Business Checking",
      category: "Sales Revenue",
      amount: "+$2,500.00",
      type: "deposit",
      date: "Mar 22, 2024",
      status: "Cleared"
    },
    {
      id: "TXN-002",
      description: "Office Supply Store Purchase",
      account: "Business Checking",
      category: "Office Supplies",
      amount: "-$156.78",
      type: "expense",
      date: "Mar 22, 2024",
      status: "Pending"
    },
    {
      id: "TXN-003",
      description: "Software License - Adobe",
      account: "Business Credit Card",
      category: "Software",
      amount: "-$299.00",
      type: "expense",
      date: "Mar 21, 2024",
      status: "Cleared"
    },
    {
      id: "TXN-004",
      description: "Client Payment - Invoice #102",
      account: "Business Checking",
      category: "Sales Revenue",
      amount: "+$1,750.00",
      type: "deposit",
      date: "Mar 21, 2024",
      status: "Cleared"
    },
    {
      id: "TXN-005",
      description: "Internet Service Monthly",
      account: "Business Checking",
      category: "Utilities",
      amount: "-$89.99",
      type: "expense",
      date: "Mar 20, 2024",
      status: "Cleared"
    },
  ];

  const getTransactionIcon = (type: string) => {
    return type === "deposit" ? (
      <ArrowDownLeft className="h-4 w-4 text-qb-green" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-destructive" />
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Cleared: "bg-qb-green text-white",
      Pending: "bg-qb-blue text-white",
      Failed: "bg-destructive text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Transactions" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Transaction Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {transactionStats.map((stat) => {
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

        {/* Transactions Table */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Account
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
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="text-sm text-foreground">{transaction.description}</span>
                        </div>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{transaction.account}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{transaction.category}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className={`text-sm font-medium ${
                          transaction.type === "deposit" ? "text-qb-green" : "text-destructive"
                        }`}>
                          {transaction.amount}
                        </span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{transaction.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Transactions;