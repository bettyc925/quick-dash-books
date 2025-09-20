import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Zap, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Bell,
  Settings,
  PlayCircle,
  PauseCircle 
} from 'lucide-react';

interface TaskAutomation {
  id: string;
  name: string;
  trigger_type: string;
  trigger_config: any;
  action_type: string;
  action_config: any;
  is_active: boolean;
  last_run?: string;
  next_run?: string;
  created_at: string;
}

interface TaskAutomationPanelProps {
  companyId: string;
  onAutomationChange: () => void;
}

const TaskAutomationPanel: React.FC<TaskAutomationPanelProps> = ({
  companyId,
  onAutomationChange
}) => {
  const [automations, setAutomations] = useState<TaskAutomation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger_type: 'monthly_close',
    trigger_config: {},
    action_type: 'create_tasks',
    action_config: {}
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (companyId) {
      loadAutomations();
    }
  }, [companyId]);

  const loadAutomations = async () => {
    if (!companyId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('task_automations')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading automations",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('task_automations')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', automationId);

      if (error) throw error;

      toast({
        title: `Automation ${isActive ? 'enabled' : 'disabled'}`,
        description: `The automation has been ${isActive ? 'activated' : 'deactivated'}.`,
      });

      loadAutomations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating automation",
        description: error.message,
      });
    }
  };

  const createAutomation = async () => {
    if (!user || !companyId) return;

    try {
      const { error } = await supabase
        .from('task_automations')
        .insert([{
          ...newAutomation,
          company_id: companyId,
          created_by: user.id,
          trigger_config: newAutomation.trigger_config || {},
          action_config: newAutomation.action_config || {}
        }]);

      if (error) throw error;

      toast({
        title: "Automation created!",
        description: "Your new automation has been set up successfully.",
      });

      setNewAutomation({
        name: '',
        trigger_type: 'monthly_close',
        trigger_config: {},
        action_type: 'create_tasks',
        action_config: {}
      });

      setShowCreateDialog(false);
      loadAutomations();
      onAutomationChange();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating automation",
        description: error.message,
      });
    }
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'monthly_close': return Calendar;
      case 'date_based': return Clock;
      case 'task_completion': return CheckCircle;
      default: return Zap;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create_tasks': return Plus;
      case 'send_notification': return Bell;
      default: return Settings;
    }
  };

  const formatTriggerType = (triggerType: string) => {
    return triggerType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPresetAutomations = () => [
    {
      name: 'Monthly Close Task Generation',
      trigger_type: 'monthly_close',
      action_type: 'create_tasks',
      description: 'Automatically create month-end close tasks on the 1st of each month'
    },
    {
      name: 'Overdue Task Notifications',
      trigger_type: 'date_based', 
      action_type: 'send_notification',
      description: 'Send notifications for tasks that are overdue'
    },
    {
      name: 'Task Completion Workflow',
      trigger_type: 'task_completion',
      action_type: 'create_tasks',
      description: 'Create follow-up tasks when specific tasks are completed'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qb-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Task Automations</h3>
          <p className="text-sm text-muted-foreground">
            Automate repetitive tasks and workflows
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Automation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Automation</DialogTitle>
              <DialogDescription>
                Set up a new automation to streamline your workflow
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Automation Name</Label>
                <Input
                  id="name"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  placeholder="Enter automation name"
                />
              </div>

              <div>
                <Label htmlFor="trigger_type">Trigger Type</Label>
                <Select
                  value={newAutomation.trigger_type}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly_close">Monthly Close</SelectItem>
                    <SelectItem value="date_based">Date Based</SelectItem>
                    <SelectItem value="task_completion">Task Completion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="action_type">Action Type</Label>
                <Select
                  value={newAutomation.action_type}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, action_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create_tasks">Create Tasks</SelectItem>
                    <SelectItem value="send_notification">Send Notification</SelectItem>
                    <SelectItem value="update_status">Update Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={createAutomation} disabled={!newAutomation.name.trim()} className="flex-1">
                  Create Automation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Automations */}
      {automations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {automations.map((automation) => {
            const TriggerIcon = getTriggerIcon(automation.trigger_type);
            const ActionIcon = getActionIcon(automation.action_type);
            
            return (
              <Card key={automation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{automation.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <TriggerIcon className="h-3 w-3" />
                        <span>{formatTriggerType(automation.trigger_type)}</span>
                        <span>→</span>
                        <ActionIcon className="h-3 w-3" />
                        <span>{formatActionType(automation.action_type)}</span>
                      </CardDescription>
                    </div>
                    <Switch
                      checked={automation.is_active}
                      onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={automation.is_active ? "default" : "secondary"}>
                      {automation.is_active ? (
                        <><PlayCircle className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><PauseCircle className="h-3 w-3 mr-1" /> Inactive</>
                      )}
                    </Badge>
                    
                    {automation.last_run && (
                      <span className="text-muted-foreground">
                        Last run: {new Date(automation.last_run).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Automations Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create automations to streamline your accounting workflow
            </p>
            
            {/* Preset Automation Suggestions */}
            <div className="space-y-3 max-w-md mx-auto">
              <h4 className="font-medium text-sm">Suggested Automations:</h4>
              {getPresetAutomations().map((preset, index) => (
                <div key={index} className="text-left p-3 bg-muted rounded-lg">
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {preset.description}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-6 text-xs"
                    onClick={() => {
                      setNewAutomation({
                        name: preset.name,
                        trigger_type: preset.trigger_type,
                        action_type: preset.action_type,
                        trigger_config: {},
                        action_config: {}
                      });
                      setShowCreateDialog(true);
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskAutomationPanel;
