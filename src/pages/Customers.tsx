import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  DollarSign
} from "lucide-react";

const Customers = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search customers..." 
          className="pl-10 w-64"
        />
      </div>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Customer
      </Button>
    </div>
  );

  const customers = [
    {
      name: "ABC Corporation",
      email: "contact@abccorp.com",
      phone: "(555) 123-4567",
      address: "123 Business St, City, ST 12345",
      balance: "$15,750.00",
      status: "Active"
    },
    {
      name: "XYZ Industries",
      email: "billing@xyzind.com",
      phone: "(555) 987-6543",
      address: "456 Industrial Ave, City, ST 12345",
      balance: "$8,250.00",
      status: "Active"
    },
    {
      name: "Tech Solutions LLC",
      email: "admin@techsol.com",
      phone: "(555) 456-7890",
      address: "789 Tech Park Dr, City, ST 12345",
      balance: "$22,100.00",
      status: "Active"
    }
  ];

  return (
    <MainLayout title="Customers" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Customer Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">156</div>
              <div className="flex items-center text-xs text-qb-green">
                +12 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">142</div>
              <div className="text-xs text-muted-foreground">91% active rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$46,100</div>
              <div className="text-xs text-destructive">Overdue: $8,945</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Invoice Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$1,850</div>
              <div className="text-xs text-qb-green">+5.2% vs last month</div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">{customer.name}</h3>
                      <span className="text-sm font-medium text-qb-green">{customer.balance}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {customer.address}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'Active' 
                          ? 'bg-qb-green/10 text-qb-green' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {customer.status}
                      </span>
                      
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Create Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Customers;