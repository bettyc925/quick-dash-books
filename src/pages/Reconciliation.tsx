import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Building,
  RefreshCw
} from "lucide-react";

const Reconciliation = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Start Reconciliation
      </Button>
    </div>
  );

  const reconciliationStats = [
    {
      title: "Reconciled Accounts",
      value: "5",
      icon: CheckCircle,
    },
    {
      title: "Pending Review",
      value: "2",
      icon: Clock,
    },
    {
      title: "Discrepancies",
      value: "1",
      icon: AlertTriangle,
    },
    {
      title: "Total Difference",
      value: "$245.67",
      icon: DollarSign,
    },
  ];

  const accountReconciliations = [
    {
      account: "Business Checking",
      bank: "Chase Bank",
      lastReconciled: "Mar 20, 2024",
      statementBalance: "$24,567.89",
      bookBalance: "$24,567.89",
      difference: "$0.00",
      status: "Reconciled",
      pendingItems: 0
    },
    {
      account: "Business Savings",
      bank: "Chase Bank",
      lastReconciled: "Mar 15, 2024",
      statementBalance: "$50,000.00",
      bookBalance: "$50,000.00",
      difference: "$0.00",
      status: "Reconciled",
      pendingItems: 0
    },
    {
      account: "Business Credit Card",
      bank: "American Express",
      lastReconciled: "Mar 10, 2024",
      statementBalance: "-$3,245.67",
      bookBalance: "-$3,000.00",
      difference: "$245.67",
      status: "Needs Review",
      pendingItems: 3
    },
    {
      account: "Petty Cash",
      bank: "Manual Account",
      lastReconciled: "Feb 28, 2024",
      statementBalance: "$500.00",
      bookBalance: "$500.00",
      difference: "$0.00",
      status: "Overdue",
      pendingItems: 0
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Reconciled: "bg-qb-green text-white",
      "Needs Review": "bg-qb-orange text-white",
      Overdue: "bg-destructive text-white",
      "In Progress": "bg-qb-blue text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Reconciliation" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Reconciliation Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reconciliationStats.map((stat) => {
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

        {/* Reconciliation Status */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Account Reconciliation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accountReconciliations.map((recon, index) => {
                const hasDifference = parseFloat(recon.difference.replace("$", "").replace(",", "")) !== 0;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-accent p-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{recon.account}</h3>
                        <p className="text-xs text-muted-foreground">{recon.bank}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last reconciled: {recon.lastReconciled}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Statement: </span>
                          <span className="font-medium">{recon.statementBalance}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Books: </span>
                          <span className="font-medium">{recon.bookBalance}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Difference: </span>
                          <span className={`font-medium ${
                            hasDifference ? "text-destructive" : "text-qb-green"
                          }`}>
                            {recon.difference}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(recon.status)}
                        {recon.pendingItems > 0 && (
                          <Badge variant="outline">
                            {recon.pendingItems} pending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          Reconcile
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start Reconciliation</h3>
              <p className="text-sm text-muted-foreground">Match bank statements with your records</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review Discrepancies</h3>
              <p className="text-sm text-muted-foreground">Investigate and resolve differences</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <RefreshCw className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Auto-Match</h3>
              <p className="text-sm text-muted-foreground">Automatically match similar transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reconciliation;