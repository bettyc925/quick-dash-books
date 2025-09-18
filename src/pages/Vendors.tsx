import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus,
  Search,
  Users,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  DollarSign
} from "lucide-react";

const Vendors = () => {
  const headerActions = (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search vendors..." 
          className="pl-10 w-64"
        />
      </div>
      <Button size="sm" className="bg-primary">
        <Plus className="mr-2 h-4 w-4" />
        Add Vendor
      </Button>
    </div>
  );

  const vendors = [
    {
      name: "Office Supply Co.",
      email: "billing@officesupply.com",
      phone: "(555) 123-4567",
      address: "123 Business St, City, ST 12345",
      balance: "$2,450.00",
      status: "Active"
    },
    {
      name: "Software Solutions Inc",
      email: "accounts@softwaresol.com",
      phone: "(555) 987-6543",
      address: "456 Tech Ave, City, ST 12345",
      balance: "$890.00",
      status: "Active"
    },
    {
      name: "Marketing Agency LLC",
      email: "finance@marketingco.com",
      phone: "(555) 456-7890",
      address: "789 Creative Dr, City, ST 12345",
      balance: "$5,200.00",
      status: "Active"
    }
  ];

  return (
    <MainLayout title="Vendors" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Vendor Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Vendors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="flex items-center text-xs text-qb-green">
                +5 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Vendors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">82</div>
              <div className="text-xs text-muted-foreground">92% active rate</div>
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
              <div className="text-2xl font-bold text-foreground">$18,540</div>
              <div className="text-xs text-destructive">Overdue: $3,200</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$1,250</div>
              <div className="text-xs text-qb-green">+8.2% vs last month</div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor List */}
        <Card className="shadow-qb-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Vendor Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">{vendor.name}</h3>
                      <span className="text-sm font-medium text-destructive">{vendor.balance}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {vendor.address}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'Active' 
                          ? 'bg-qb-green/10 text-qb-green' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {vendor.status}
                      </span>
                      
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
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

export default Vendors;