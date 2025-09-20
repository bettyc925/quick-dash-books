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
  FileText,
  Calendar,
  DollarSign,
  Package
} from "lucide-react";

const PurchaseOrders = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search purchase orders..." 
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Create PO
      </Button>
    </div>
  );

  const poStats = [
    {
      title: "Total POs",
      value: "67",
      icon: FileText,
    },
    {
      title: "Pending Value",
      value: "$32,450.00",
      icon: DollarSign,
    },
    {
      title: "Awaiting Delivery",
      value: "12",
      icon: Package,
    },
    {
      title: "This Month",
      value: "15",
      icon: Calendar,
    },
  ];

  const purchaseOrders = [
    {
      id: "PO-001",
      vendor: "Office Supply Co.",
      amount: "$2,450.00",
      status: "Approved",
      orderDate: "Mar 20, 2024",
      deliveryDate: "Mar 25, 2024"
    },
    {
      id: "PO-002",
      vendor: "Tech Equipment Ltd",
      amount: "$5,890.00",
      status: "Delivered",
      orderDate: "Mar 18, 2024",
      deliveryDate: "Mar 22, 2024"
    },
    {
      id: "PO-003",
      vendor: "Software Licensing Inc",
      amount: "$1,200.00",
      status: "Draft",
      orderDate: "Mar 22, 2024",
      deliveryDate: "Mar 28, 2024"
    },
    {
      id: "PO-004",
      vendor: "Furniture Solutions",
      amount: "$8,750.00",
      status: "Pending",
      orderDate: "Mar 15, 2024",
      deliveryDate: "Mar 30, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Approved: "bg-qb-green text-white",
      Pending: "bg-qb-blue text-white",
      Delivered: "bg-qb-orange text-white",
      Draft: "bg-muted text-muted-foreground",
      Cancelled: "bg-destructive text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <MainLayout title="Purchase Orders" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Purchase Order Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {poStats.map((stat) => {
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

        {/* Purchase Orders Table */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      PO #
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
                      Order Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Delivery Date
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-primary">{po.id}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-foreground">{po.vendor}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{po.amount}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(po.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{po.orderDate}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{po.deliveryDate}</span>
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

export default PurchaseOrders;