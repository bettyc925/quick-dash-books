import { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Settings, TrendingUp, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsolidationGroup {
  id: string;
  name: string;
  reporting_currency: string;
  gaap_standard: string;
  parent_company_id: string;
  created_at: string;
  companies?: {
    name: string;
    currency: string;
  };
  consolidation_members?: Array<{
    company_id: string;
    ownership_percentage: number;
    consolidation_method: string;
    companies: {
      name: string;
      currency: string;
    };
  }>;
}

interface Company {
  id: string;
  name: string;
  currency: string;
  gaap_standard: string;
}

export default function Consolidations() {
  const [groups, setGroups] = useState<ConsolidationGroup[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    reporting_currency: 'USD',
    gaap_standard: 'US_GAAP',
    parent_company_id: ''
  });
  const { toast } = useToast();

  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.parent_company_id) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('consolidation_groups')
        .insert([{
          ...newGroup,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consolidation group created successfully",
      });

      setShowCreateDialog(false);
      setNewGroup({
        name: '',
        reporting_currency: 'USD',
        gaap_standard: 'US_GAAP',
        parent_company_id: ''
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Consolidation Group
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Consolidation Group</DialogTitle>
            <DialogDescription>
              Set up a new consolidation group for GAAP reporting across multiple companies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="e.g., ABC Holdings Consolidation"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="parent-company">Parent Company</Label>
              <Select
                value={newGroup.parent_company_id}
                onValueChange={(value) => setNewGroup({ ...newGroup, parent_company_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} ({company.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Reporting Currency</Label>
              <Select
                value={newGroup.reporting_currency}
                onValueChange={(value) => setNewGroup({ ...newGroup, reporting_currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gaap">GAAP Standard</Label>
              <Select
                value={newGroup.gaap_standard}
                onValueChange={(value) => setNewGroup({ ...newGroup, gaap_standard: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US_GAAP">US GAAP</SelectItem>
                  <SelectItem value="IFRS">IFRS</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load consolidation groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('consolidation_groups')
        .select(`
          *,
          companies!parent_company_id(name, currency),
          consolidation_members(
            company_id,
            ownership_percentage,
            consolidation_method,
            companies(name, currency)
          )
        `);

      if (groupsError) throw groupsError;

      // Load available companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (companiesError) throw companiesError;

      setGroups(groupsData || []);
      setCompanies(companiesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const getGaapBadgeColor = (standard: string) => {
    switch (standard) {
      case 'US_GAAP': return 'bg-blue-100 text-blue-800';
      case 'IFRS': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="GAAP Consolidations" headerActions={headerActions}>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="GAAP Consolidations" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold">{groups.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Currencies</p>
                <p className="text-2xl font-bold">
                  {new Set(companies.map(c => c.currency)).size}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{groups.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consolidation Groups */}
        <div className="grid gap-4">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Consolidation Groups</h3>
                <p className="text-gray-600 text-center mb-4">
                  Create your first consolidation group to start managing multi-company GAAP reporting.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            groups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>
                        Parent: {group.companies?.name} | Created: {new Date(group.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getGaapBadgeColor(group.gaap_standard)}>
                        {group.gaap_standard}
                      </Badge>
                      <Badge variant="outline">{group.reporting_currency}</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Consolidated Companies</h4>
                      {group.consolidation_members?.length === 0 ? (
                        <p className="text-sm text-gray-600">No companies added to this consolidation group yet.</p>
                      ) : (
                        <div className="grid gap-2">
                          {group.consolidation_members?.map((member) => (
                            <div key={member.company_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">{member.companies.name}</span>
                                <Badge variant="outline">{member.companies.currency}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{member.ownership_percentage}%</Badge>
                                <Badge variant="outline">{member.consolidation_method}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}