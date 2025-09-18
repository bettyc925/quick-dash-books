import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Search,
  Package,
  Eye,
  Edit,
  Archive,
  Filter,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Boxes
} from "lucide-react";

const Products = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search products & services..." 
          className="pl-10 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Product/Service
      </Button>
    </div>
  );

  const productStats = [
    {
      title: "Total Products",
      value: "248",
      icon: Package,
    },
    {
      title: "Active Items",
      value: "231",
      icon: ShoppingCart,
    },
    {
      title: "Total Revenue",
      value: "$125,340.00",
      icon: DollarSign,
    },
    {
      title: "Top Seller",
      value: "Consulting Services",
      icon: BarChart3,
    },
  ];

  const products = [
    {
      name: "Web Development Service",
      type: "Service",
      sku: "WEB-DEV-001",
      price: "$150.00/hr",
      status: "Active",
      category: "Consulting",
      lastSold: "Mar 18, 2024"
    },
    {
      name: "Mobile App Development",
      type: "Service", 
      sku: "MOB-DEV-001",
      price: "$175.00/hr",
      status: "Active",
      category: "Consulting",
      lastSold: "Mar 20, 2024"
    },
    {
      name: "Website Hosting",
      type: "Product",
      sku: "HOST-001",
      price: "$25.00/mo",
      status: "Active",
      category: "Hosting",
      lastSold: "Mar 22, 2024"
    },
    {
      name: "Domain Registration",
      type: "Product",
      sku: "DOM-001", 
      price: "$15.00/yr",
      status: "Active",
      category: "Domain",
      lastSold: "Mar 15, 2024"
    },
    {
      name: "Legacy Support Service",
      type: "Service",
      sku: "LEG-SUP-001",
      price: "$125.00/hr",
      status: "Inactive",
      category: "Support",
      lastSold: "Feb 10, 2024"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Active: "bg-qb-green text-white",
      Inactive: "bg-muted text-muted-foreground",
      Discontinued: "bg-destructive text-white",
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      Product: "bg-qb-blue text-white",
      Service: "bg-qb-orange text-white",
    };
    
    return (
      <Badge variant="outline" className={typeStyles[type as keyof typeof typeStyles]}>
        {type}
      </Badge>
    );
  };

  return (
    <MainLayout title="Products & Services" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Product Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productStats.map((stat) => {
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

        {/* Products & Services Table */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Product & Service Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Last Sold
                    </th>
                    <th className="text-left py-3 px-1 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{product.name}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getTypeBadge(product.type)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{product.sku}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm font-medium text-foreground">{product.price}</span>
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{product.category}</span>
                      </td>
                      <td className="py-3 px-1">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="py-3 px-1">
                        <span className="text-sm text-muted-foreground">{product.lastSold}</span>
                      </td>
                      <td className="py-3 px-1">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Archive">
                            <Archive className="h-4 w-4" />
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
              <Package className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add Product</h3>
              <p className="text-sm text-muted-foreground">Add physical or digital products to your catalog</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Boxes className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add Service</h3>
              <p className="text-sm text-muted-foreground">Define services you offer with hourly or fixed rates</p>
            </CardContent>
          </Card>

          <Card className="shadow-qb-md hover:shadow-qb-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">View Reports</h3>
              <p className="text-sm text-muted-foreground">Analyze product performance and sales trends</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;