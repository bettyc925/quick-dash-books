import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/contexts/CompanyContext';
import { Building2, Mail, Phone, MapPin, Plus, Search } from 'lucide-react';

// Mock data for now - in a real app, this would come from the database
const mockClients = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '(555) 123-4567',
    address: '123 Business St, City, ST 12345',
    industry: 'Technology',
    status: 'Active',
    lastActivity: '2024-01-15',
  },
  {
    id: '2',
    name: 'Smith & Associates',
    email: 'info@smithassoc.com',
    phone: '(555) 987-6543',
    address: '456 Professional Ave, City, ST 12345',
    industry: 'Consulting',
    status: 'Active',
    lastActivity: '2024-01-12',
  },
  {
    id: '3',
    name: 'Green Energy Solutions',
    email: 'hello@greenenergy.com',
    phone: '(555) 456-7890',
    address: '789 Eco Way, City, ST 12345',
    industry: 'Energy',
    status: 'Inactive',
    lastActivity: '2023-12-20',
  },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedBusiness, selectedClient } = useCompany();

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  return (
    <MainLayout title="Clients">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-qb-blue">Clients</h1>
            <p className="text-muted-foreground">
              Manage your client relationships for {selectedClient?.name || selectedBusiness?.name}
            </p>
          </div>
          <Button className="bg-qb-blue hover:bg-qb-blue-dark">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-qb-blue">
                    {client.name}
                  </CardTitle>
                  <Badge variant={getStatusVariant(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                <CardDescription>{client.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    Last activity: {new Date(client.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Clients Found</h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
            </p>
            <Button className="bg-qb-blue hover:bg-qb-blue-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Clients;