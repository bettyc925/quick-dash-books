import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Building,
  CreditCard,
  Wallet,
  Eye,
  Edit,
  RefreshCw,
  DollarSign
} from "lucide-react";

const Accounts = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Sync All
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Account
      </Button>
    </div>
  );

  const accountStats = [
    {
      title: "Total Assets",
      value: "$124,567.89",
      icon: DollarSign,
    },
    {
      title: "Total Liabilities",
      value: "$23,245.67",
      icon: CreditCard,
    },
    {
      title: "Net Worth",
      value: "$101,322.22",
      icon: Building,
    },
    {
      title: "Active Accounts",
      value: "8",
      icon: Wallet,
    },
  ];

  const accounts = [
    {
      name: "Business Checking",
      bank: "Chase Bank",
      type: "Checking",
      balance: "$24,567.89",
      status: "Active",
      lastSync: "2 minutes ago",
      accountNumber: "****1234"
    },
    {
      name: "Business Savings",
      bank: "Chase Bank",
      type: "Savings", 
      balance: "$50,000.00",
      status: "Active",
      lastSync: "5 minutes ago",
      accountNumber: "****5678"
    },
    {
      name: "Business Credit Card",
      bank: "American Express",
      type: "Credit Card",
      balance: "-$3,245.67",
      status: "Active",
      lastSync: "1 hour ago",
      accountNumber: "****9012"
    },
    {
      name: "Petty Cash",
      bank: "Manual Account",
      type: "Cash",
      balance: "$500.00",
      status: "Active",
      lastSync: "Manual",
      accountNumber: "N/A"
    },
    {
      name: "Equipment Loan",
      bank: "Wells Fargo",
      type: "Loan",
      balance: "-$15,000.00",
      status: "Active",
      lastSync: "1 day ago",
      accountNumber: "****3456"
    },
  ];

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "Credit Card":
        return <CreditCard className="h-5 w-5 text-muted-foreground" />;
      case "Savings":
        return <Wallet className="h-5 w-5 text-muted-foreground" />;
      case "Cash":
        return <DollarSign className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Building className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Active: "bg-qb-green text-white",
      Inactive: "bg-muted text-muted-foreground",
      Disconnected: "bg-destructive text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Bank Accounts" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Account Summary Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {accountStats.map((stat) => {
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

        {/* Account List */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account, index) => {
                const isNegative = account.balance.startsWith("-");
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-accent p-3">
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{account.name}</h3>
                        <p className="text-xs text-muted-foreground">{account.bank} • {account.accountNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{account.type}</Badge>
                          {getStatusBadge(account.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isNegative ? "text-destructive" : "text-foreground"
                      }`}>
                        {account.balance}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last sync: {account.lastSync}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Accounts;