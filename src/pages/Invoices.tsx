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
  Download,
  Filter,
  Calendar,
  DollarSign
} from "lucide-react";

const Invoices = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search invoices..." 
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Create Invoice
      </Button>
    </div>
  );

  const invoiceStats = [
    {
      title: "Total Invoices",
      value: "342",
      icon: FileText,
    },
    {
      title: "Outstanding Amount",
      value: "$28,450.00",
      icon: DollarSign,
    },
    {
      title: "Paid This Month",
      value: "$45,200.00",
      icon: DollarSign,
    },
    {
      title: "Overdue",
      value: "12",
      icon: Calendar,
    },
  ];

  const invoices = [
    {
      id: "INV-001",
      customer: "ABC Corporation",
      amount: "$2,500.00",
      status: "Paid",
      date: "Mar 15, 2024",
      dueDate: "Apr 15, 2024"
    },
    {
      id: "INV-002", 
      customer: "Tech Startup Inc",
      amount: "$1,750.00",
      status: "Pending",
      date: "Mar 14, 2024",
      dueDate: "Apr 14, 2024"
    },
    {
      id: "INV-003",
      customer: "Local Business LLC",
      amount: "$950.00",
      status: "Overdue",
      date: "Mar 10, 2024",
      dueDate: "Apr 10, 2024"
    },
    {
      id: "INV-004",
      customer: "Enterprise Corp",
      amount: "$5,200.00",
      status: "Draft",
      date: "Mar 12, 2024",
      dueDate: "Apr 12, 2024"
    },
    {
      id: "INV-005",
      customer: "Global Solutions",
      amount: "$3,100.00",
      status: "Sent",
      date: "Mar 18, 2024",
      dueDate: "Apr 18, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Paid: "bg-qb-green text-white",
      Pending: "bg-qb-blue text-white", 
      Overdue: "bg-destructive text-white",
      Draft: "bg-muted text-muted-foreground",
      Sent: "bg-qb-orange text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Invoices" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Invoice Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {invoiceStats.map((stat) => {
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

        {/* Invoices Table */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Invoice #
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
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-primary">{invoice.id}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-foreground">{invoice.customer}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{invoice.date}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{invoice.dueDate}</span>
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
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="h-4 w-4" />
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

export default Invoices;