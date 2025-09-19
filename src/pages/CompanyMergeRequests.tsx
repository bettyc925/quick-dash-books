import { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Merge, Plus, Shield, AlertTriangle, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MergeRequest {
  id: string;
  source_company_id: string;
  target_company_id: string;
  requested_by: string;
  reason: string;
  verification_code: string;
  status: string;
  approver_id?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  source_company: {
    name: string;
    currency: string;
  };
  target_company: {
    name: string;
    currency: string;
  };
}

interface Company {
  id: string;
  name: string;
  currency: string;
}

export default function CompanyMergeRequests() {
  const [requests, setRequests] = useState<MergeRequest[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MergeRequest | null>(null);
  const [approvalForm, setApprovalForm] = useState({
    verification_code: '',
    company_relationship_confirmed: false,
    notes: ''
  });
  const [newRequest, setNewRequest] = useState({
    source_company_id: '',
    target_company_id: '',
    reason: ''
  });
  const { toast } = useToast();

  const handleCreateMergeRequest = async () => {
    if (!newRequest.source_company_id || !newRequest.target_company_id || !newRequest.reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('company_merge_requests')
        .insert([{
          ...newRequest,
          requested_by: (await supabase.auth.getUser()).data.user?.id,
          verification_code: '' // Will be set by trigger
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Merge request created successfully. A verification code has been generated.",
      });

      setShowCreateDialog(false);
      setNewRequest({
        source_company_id: '',
        target_company_id: '',
        reason: ''
      });
      loadRequests();
    } catch (error: any) {
      toast({
        title: "Error creating request",
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
            Request Company Merge
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Company Merge</DialogTitle>
            <DialogDescription>
              Request to merge two related companies. This requires approval and verification to prevent accidental combinations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="source-company">Source Company (will be merged into target)</Label>
              <Select
                value={newRequest.source_company_id}
                onValueChange={(value) => setNewRequest({ ...newRequest, source_company_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source company" />
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
              <Label htmlFor="target-company">Target Company (will receive merged data)</Label>
              <Select
                value={newRequest.target_company_id}
                onValueChange={(value) => setNewRequest({ ...newRequest, target_company_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target company" />
                </SelectTrigger>
                <SelectContent>
                  {companies
                    .filter(c => c.id !== newRequest.source_company_id)
                    .map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name} ({company.currency})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reason">Reason for Merge</Label>
              <Textarea
                id="reason"
                placeholder="Explain why these companies should be merged (e.g., same business, acquisition, etc.)"
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMergeRequest}>Create Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );


  const approveRequest = async () => {
    if (!selectedRequest || !approvalForm.verification_code || !approvalForm.company_relationship_confirmed) {
      toast({
        title: "Missing information",
        description: "Please enter verification code and confirm company relationship",
        variant: "destructive",
      });
      return;
    }

    if (approvalForm.verification_code !== selectedRequest.verification_code) {
      toast({
        title: "Invalid verification code",
        description: "The verification code does not match",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create approval record
      const { error: approvalError } = await supabase
        .from('merge_request_approvals')
        .insert([{
          merge_request_id: selectedRequest.id,
          approver_id: (await supabase.auth.getUser()).data.user?.id,
          verification_code_entered: approvalForm.verification_code,
          company_relationship_confirmed: approvalForm.company_relationship_confirmed,
          notes: approvalForm.notes
        }]);

      if (approvalError) throw approvalError;

      // Update request status
      const { error: updateError } = await supabase
        .from('company_merge_requests')
        .update({
          status: 'approved',
          approver_id: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Merge request approved successfully",
      });

      setShowApprovalDialog(false);
      setSelectedRequest(null);
      setApprovalForm({
        verification_code: '',
        company_relationship_confirmed: false,
        notes: ''
      });
      loadRequests();
    } catch (error: any) {
      toast({
        title: "Error approving request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rejectRequest = async (requestId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('company_merge_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          approver_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Merge request rejected",
      });

      loadRequests();
    } catch (error: any) {
      toast({
        title: "Error rejecting request",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    loadRequests();
    loadCompanies();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('company_merge_requests')
        .select(`
          *,
          source_company:companies!source_company_id(name, currency),
          target_company:companies!target_company_id(name, currency)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error: any) {
      console.error('Error loading companies:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Company Merge Requests" headerActions={headerActions}>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Company Merge Requests" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Merge className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Shield className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <X className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Merge Requests */}
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Merge className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Merge Requests</h3>
                <p className="text-gray-600 text-center mb-4">
                  No company merge requests have been submitted yet.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Merge className="h-5 w-5" />
                        Merge Request #{request.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        Created: {new Date(request.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-900 mb-2">Source Company (to be merged)</h4>
                        <p className="text-red-800">{request.source_company.name}</p>
                        <p className="text-sm text-red-700">Currency: {request.source_company.currency}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Target Company (will receive data)</h4>
                        <p className="text-green-800">{request.target_company.name}</p>
                        <p className="text-sm text-green-700">Currency: {request.target_company.currency}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Reason for Merge</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.reason}</p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-yellow-900 mb-1">Security Verification Required</h4>
                            <p className="text-yellow-800 text-sm mb-2">
                              A secure verification code has been generated for this request.
                            </p>
                            <p className="text-yellow-700 text-sm">
                              The verification code must be entered during approval to confirm you have authorization to merge these companies. Contact the request creator for the verification code.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejection_reason && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-900 mb-1">Rejection Reason</h4>
                        <p className="text-red-800 text-sm">{request.rejection_reason}</p>
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApprovalDialog(true);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <AlertDialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Merge Request</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject this merge request? Please provide a reason.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="my-4">
                              <Textarea placeholder="Reason for rejection..." />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => rejectRequest(request.id, "User rejected")}>
                                Reject Request
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Merge Request</DialogTitle>
              <DialogDescription>
                Please verify the merge request details and enter the verification code to approve.
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">Important Security Check</h4>
                      <p className="text-yellow-800 text-sm">
                        You are about to merge <strong>{selectedRequest.source_company.name}</strong> into{' '}
                        <strong>{selectedRequest.target_company.name}</strong>. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="Enter the verification code shown in the request"
                    value={approvalForm.verification_code}
                    onChange={(e) => setApprovalForm({ ...approvalForm, verification_code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="relationship-confirmed"
                    checked={approvalForm.company_relationship_confirmed}
                    onCheckedChange={(checked) => 
                      setApprovalForm({ ...approvalForm, company_relationship_confirmed: checked as boolean })
                    }
                  />
                  <Label htmlFor="relationship-confirmed" className="text-sm">
                    I confirm these companies are related and should be merged
                  </Label>
                </div>

                <div>
                  <Label htmlFor="approval-notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="approval-notes"
                    placeholder="Any additional notes about this approval..."
                    value={approvalForm.notes}
                    onChange={(e) => setApprovalForm({ ...approvalForm, notes: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={approveRequest}>Approve Merge</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}