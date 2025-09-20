import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Send,
  Copy,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle
} from "lucide-react";

const Estimates = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search estimates..." 
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Create Estimate
      </Button>
    </div>
  );

  const estimateStats = [
    {
      title: "Total Estimates",
      value: "87",
      icon: FileText,
    },
    {
      title: "Pending Value",
      value: "$52,340.00",
      icon: DollarSign,
    },
    {
      title: "Accepted This Month",
      value: "18",
      icon: CheckCircle,
    },
    {
      title: "Conversion Rate",
      value: "68%",
      icon: Calendar,
    },
  ];

  const estimates = [
    {
      id: "EST-001",
      customer: "ABC Corporation",
      amount: "$4,500.00",
      status: "Pending",
      date: "Mar 20, 2024",
      validUntil: "Apr 20, 2024"
    },
    {
      id: "EST-002", 
      customer: "Tech Startup Inc",
      amount: "$2,750.00",
      status: "Accepted",
      date: "Mar 18, 2024",
      validUntil: "Apr 18, 2024"
    },
    {
      id: "EST-003",
      customer: "Local Business LLC",
      amount: "$1,850.00",
      status: "Sent",
      date: "Mar 15, 2024",
      validUntil: "Apr 15, 2024"
    },
    {
      id: "EST-004",
      customer: "Enterprise Corp",
      amount: "$8,200.00",
      status: "Draft",
      date: "Mar 22, 2024",
      validUntil: "Apr 22, 2024"
    },
    {
      id: "EST-005",
      customer: "Global Solutions",
      amount: "$3,600.00",
      status: "Declined",
      date: "Mar 10, 2024",
      validUntil: "Apr 10, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Accepted: "bg-qb-green text-white",
      Pending: "bg-qb-blue text-white", 
      Declined: "bg-destructive text-white",
      Draft: "bg-muted text-muted-foreground",
      Sent: "bg-qb-orange text-white",
      Expired: "bg-gray-500 text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Estimates" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Estimate Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {estimateStats.map((stat) => {
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

        {/* Estimates Table */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Estimate #
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Created Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Valid Until
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((estimate) => (
                    <tr key={estimate.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-primary">{estimate.id}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-foreground">{estimate.customer}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{estimate.amount}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(estimate.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{estimate.date}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{estimate.validUntil}</span>
                      </td>
                      <td className="py-3 px-1">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Send">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Convert to Invoice">
                            <Copy className="h-4 w-4" />
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create Estimate</h3>
              <p className="text-sm text-muted-foreground">Generate professional estimates for potential customers</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Copy className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Convert to Invoice</h3>
              <p className="text-sm text-muted-foreground">Turn accepted estimates into invoices</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Send className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Follow Up</h3>
              <p className="text-sm text-muted-foreground">Send reminders for pending estimates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Estimates;