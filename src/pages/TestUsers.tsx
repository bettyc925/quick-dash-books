import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { testUsers, createAllTestUsers, createTestUser } from "@/utils/createTestUsers";
import { Users, Plus, CheckCircle, AlertCircle, Copy } from "lucide-react";

const TestUsers = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleCreateAllUsers = async () => {
    setIsCreating(true);
    try {
      const userResults = await createAllTestUsers();
      setResults(userResults);
      
      const successCount = userResults.filter(r => r.success).length;
      toast({
        title: "Test Users Created",
        description: `Successfully created ${successCount} out of ${userResults.length} test users.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create test users. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSingleUser = async (userData: typeof testUsers[0]) => {
    setIsCreating(true);
    try {
      const result = await createTestUser(userData);
      
      if (result.success) {
        toast({
          title: "User Created",
          description: `Successfully created ${userData.email}`,
        });
        setResults(prev => [...prev.filter(r => r.email !== userData.email), { email: userData.email, ...result }]);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    toast({
      title: "Copied!",
      description: "Login credentials copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Test Users Setup</h1>
          <p className="text-muted-foreground">
            Create test user accounts for your Betty's Books application
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Available Test Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {testUsers.map((user, index) => {
                const result = results.find(r => r.email === user.email);
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{user.company_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Password: {user.password}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCredentials(user.email, user.password)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        {result ? (
                          result.success ? (
                            <CheckCircle className="h-5 w-5 text-qb-green" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateSingleUser(user)}
                            disabled={isCreating}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Create
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {result && !result.success && (
                      <div className="mt-2 text-xs text-destructive">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                onClick={handleCreateAllUsers}
                disabled={isCreating}
                size="lg"
              >
                {isCreating ? "Creating Users..." : "Create All Test Users"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Badge className="mb-2">Admin</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Full access to all features</li>
                  <li>• Accountant module</li>
                  <li>• Taxes management</li>
                  <li>• All reports</li>
                </ul>
              </div>
              
              <div className="p-3 bg-accent/20 rounded-lg">
                <Badge variant="secondary" className="mb-2">Manager</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Dashboard, Sales, Expenses</li>
                  <li>• Banking, Payroll</li>
                  <li>• Most reports</li>
                  <li>• No Accountant/Taxes</li>
                </ul>
              </div>
              
              <div className="p-3 bg-accent/20 rounded-lg">
                <Badge variant="outline" className="mb-2">User</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Dashboard access</li>
                  <li>• Sales module</li>
                  <li>• Expenses module</li>
                  <li>• Limited reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>1. Click "Create All Test Users" to create all test accounts at once</p>
            <p>2. Or create individual users by clicking the "Create" button next to each user</p>
            <p>3. Use the provided email/password combinations to log in and test different role permissions</p>
            <p className="text-muted-foreground italic">
              Note: Email confirmation is disabled by default in Supabase for faster testing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestUsers;