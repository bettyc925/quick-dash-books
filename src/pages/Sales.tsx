import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  FileText,
  Users,
  Package,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";

const Sales = () => {
  const salesSubNav = [
    { name: "Overview", href: "/sales" },
    { name: "Customers", href: "/sales/customers" },
    { name: "Invoices", href: "/sales/invoices" },
    { name: "Estimates", href: "/sales/estimates" },
    { name: "Products & Services", href: "/sales/products" },
  ];

  const salesStats = [
    {
      title: "Total Sales",
      value: "$45,234.00",
      icon: DollarSign,
    },
    {
      title: "Active Customers",
      value: "124",
      icon: Users,
    },
    {
      title: "Pending Invoices",
      value: "18",
      icon: FileText,
    },
    {
      title: "Products Sold",
      value: "342",
      icon: Package,
    },
  ];

  const recentInvoices = [
    {
      id: "INV-001",
      customer: "ABC Corporation",
      amount: "$2,500.00",
      status: "Paid",
      date: "Mar 15, 2024"
    },
    {
      id: "INV-002", 
      customer: "Tech Startup Inc",
      amount: "$1,750.00",
      status: "Pending",
      date: "Mar 14, 2024"
    },
    {
      id: "INV-003",
      customer: "Local Business LLC",
      amount: "$950.00",
      status: "Overdue",
      date: "Mar 10, 2024"
    },
    {
      id: "INV-004",
      customer: "Enterprise Corp",
      amount: "$5,200.00",
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
        Export
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Create Invoice
      </Button>
    </div>
  );

  return (
    <MainLayout 
      title="Sales" 
      headerActions={headerActions}
      subNavigation={salesSubNav}
    >
      <div className="space-y-6">
        {/* Sales Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {salesStats.map((stat) => {
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

        {/* Recent Invoices */}
        <Card className="shadow-qb-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
            <Button variant="outline" size="sm">
              View All Invoices
            </Button>
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
                      Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
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

        {/* Quick Sales Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create Invoice</h3>
              <p className="text-sm text-muted-foreground">Bill your customers and track payments</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manage Customers</h3>
              <p className="text-sm text-muted-foreground">Add and organize customer information</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Products & Services</h3>
              <p className="text-sm text-muted-foreground">Set up your product catalog</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sales;