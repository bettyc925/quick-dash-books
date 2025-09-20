import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle
} from "lucide-react";

const Bills = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search bills..." 
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Create Bill
      </Button>
    </div>
  );

  const billStats = [
    {
      title: "Total Bills",
      value: "156",
      icon: FileText,
    },
    {
      title: "Outstanding Amount",
      value: "$18,750.00",
      icon: DollarSign,
    },
    {
      title: "Due This Week",
      value: "8",
      icon: Calendar,
    },
    {
      title: "Overdue",
      value: "3",
      icon: AlertCircle,
    },
  ];

  const bills = [
    {
      id: "BILL-001",
      vendor: "Office Supply Co.",
      amount: "$1,250.00",
      status: "Open",
      dueDate: "Mar 25, 2024",
      issueDate: "Mar 15, 2024"
    },
    {
      id: "BILL-002",
      vendor: "Internet Services Inc",
      amount: "$450.00",
      status: "Overdue",
      dueDate: "Mar 20, 2024",
      issueDate: "Mar 10, 2024"
    },
    {
      id: "BILL-003",
      vendor: "Software License Ltd",
      amount: "$2,100.00",
      status: "Paid",
      dueDate: "Mar 30, 2024",
      issueDate: "Mar 18, 2024"
    },
    {
      id: "BILL-004",
      vendor: "Utility Company",
      amount: "$890.50",
      status: "Partial",
      dueDate: "Mar 28, 2024",
      issueDate: "Mar 14, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Paid: "bg-qb-green text-white",
      Open: "bg-qb-blue text-white",
      Overdue: "bg-destructive text-white",
      Partial: "bg-qb-orange text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Bills" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Bill Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {billStats.map((stat) => {
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

        {/* Bills Table */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Bill #
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Vendor
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Issue Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-primary">{bill.id}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-foreground">{bill.vendor}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{bill.amount}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{bill.issueDate}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{bill.dueDate}</span>
                      </td>
                      <td className="py-3 px-1">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Pay">
                            <Send className="h-4 w-4" />
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
      </div>
    </MainLayout>
  );
};

export default Bills;