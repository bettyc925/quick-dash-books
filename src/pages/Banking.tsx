import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Banknote,
  CreditCard,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  Wallet
} from "lucide-react";

const Banking = () => {
  const bankingSubNav = [
    { name: "Overview", href: "/banking" },
    { name: "Bank Accounts", href: "/banking/accounts" },
    { name: "Transactions", href: "/banking/transactions" },
    { name: "Reconcile", href: "/banking/reconcile" },
    { name: "Rules", href: "/banking/rules" },
  ];

  const accountBalances = [
    {
      name: "Business Checking",
      bank: "Chase Bank",
      balance: "$24,567.89",
      type: "checking",
      lastSync: "2 minutes ago"
    },
    {
      name: "Business Savings",
      bank: "Chase Bank", 
      balance: "$50,000.00",
      type: "savings",
      lastSync: "5 minutes ago"
    },
    {
      name: "Business Credit Card",
      bank: "American Express",
      balance: "-$3,245.67",
      type: "credit",
      lastSync: "1 hour ago"
    },
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      description: "Payment from ABC Corp",
      amount: "+$2,500.00",
      type: "deposit",
      account: "Business Checking",
      date: "Mar 15, 2024",
      status: "Cleared"
    },
    {
      id: "TXN-002",
      description: "Office Supply Store",
      amount: "-$156.78",
      type: "expense",
      account: "Business Checking", 
      date: "Mar 15, 2024",
      status: "Pending"
    },
    {
      id: "TXN-003",
      description: "Software License Fee",
      amount: "-$99.00",
      type: "expense",
      account: "Business Credit Card",
      date: "Mar 14, 2024",
      status: "Cleared"
    },
    {
      id: "TXN-004",
      description: "Client Payment - Invoice #002",
      amount: "+$1,750.00",
      type: "deposit",
      account: "Business Checking",
      date: "Mar 14, 2024",
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

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Sync Banks
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Account
      </Button>
    </div>
  );

  return (
    <MainLayout 
      title="Banking" 
      headerActions={headerActions}
      subNavigation={bankingSubNav}
    >
      <div className="space-y-6">
        {/* Account Balances */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accountBalances.map((account) => {
            const isNegative = account.balance.startsWith("-");
            return (
              <Card key={account.name} className="shadow-qb-md hover:shadow-qb-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {account.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{account.bank}</p>
                  </div>
                  <div className="rounded-full bg-accent p-2">
                    {account.type === "credit" ? (
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    ) : account.type === "savings" ? (
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    isNegative ? "text-destructive" : "text-foreground"
                  }`}>
                    {account.balance}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last sync: {account.lastSync}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-qb-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All Transactions
            </Button>
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
                  {recentTransactions.map((transaction) => (
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

        {/* Banking Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Plus className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add Account</h3>
              <p className="text-sm text-muted-foreground">Connect a new bank account</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <RefreshCw className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reconcile</h3>
              <p className="text-sm text-muted-foreground">Match transactions with records</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Banknote className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transfer Money</h3>
              <p className="text-sm text-muted-foreground">Transfer between accounts</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Import Transactions</h3>
              <p className="text-sm text-muted-foreground">Upload bank statements</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Banking;