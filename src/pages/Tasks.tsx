import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Calendar,
  Users,
  BarChart3,
  Settings,
  PlayCircle,
  PauseCircle,
  Lock,
  Unlock
} from 'lucide-react';
import TaskBoard from '@/components/TaskBoard';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskAutomationPanel from '@/components/TaskAutomationPanel';

interface Task {
  id: string;
  name: string;
  description?: string;
  category: string;
  priority: string;
  status: string;
  estimated_hours: number;
  actual_hours: number;
  due_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  checklist_items: any[];
  completion_notes?: string;
  completed_at?: string;
  created_at: string;
  is_locked?: boolean;
  locked_by?: string;
  locked_by_name?: string;
}

interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
  total_hours: number;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    total_hours: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  const { user } = useAuth();
  const { selectedBusiness } = useCompany();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!selectedBusiness) {
      navigate('/company-selection');
      return;
    }

    loadTasks();
    
    // Set up real-time subscription for task updates
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `company_id=eq.${selectedBusiness.id}`
      }, () => {
        loadTasks();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'task_locks'
      }, () => {
        loadTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [user, selectedBusiness, navigate]);

  const loadTasks = async () => {
    if (!selectedBusiness || !user) return;

    try {
      setIsLoading(true);

      // Clean up expired locks first
      await supabase.rpc('cleanup_expired_task_locks');

      // Load tasks with assignee and lock information
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to_profile:profiles(first_name, last_name),
          task_locks(locked_by, locked_at, expires_at,
            locked_by_profile:profiles(first_name, last_name)
          )
        `)
        .eq('company_id', selectedBusiness.id)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('priority', { ascending: false });

      if (tasksError) throw tasksError;

      const processedTasks = tasksData?.map(task => ({
        ...task,
        checklist_items: Array.isArray(task.checklist_items) ? task.checklist_items : [],
        assigned_to_name: 'User',
        is_locked: false,
        locked_by: undefined,
        locked_by_name: undefined
      })) || [];

      setTasks(processedTasks);

      // Calculate stats
      const stats = processedTasks.reduce((acc, task) => {
        acc.total++;
        acc[task.status as keyof TaskStats]++;
        acc.total_hours += task.estimated_hours || 0;

        // Check if overdue
        if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed') {
          acc.overdue++;
        }

        return acc;
      }, {
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0,
        total_hours: 0
      });

      setTaskStats(stats);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading tasks",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthlyTasks = async () => {
    if (!selectedBusiness || !user) return;

    try {
      // Get current month and year
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Load task templates
      const { data: templates, error: templatesError } = await supabase
        .from('task_templates')
        .select('*')
        .eq('company_id', selectedBusiness.id)
        .eq('is_recurring', true);

      if (templatesError) throw templatesError;

      if (!templates || templates.length === 0) {
        toast({
          title: "No templates found",
          description: "Create some task templates first to generate monthly tasks.",
        });
        return;
      }

      // Generate tasks for each template
      const tasksToCreate = templates.map(template => {
        const dueDate = new Date(year, month - 1, template.due_day_of_month || 1);
        
        return {
          company_id: selectedBusiness.id,
          template_id: template.id,
          name: template.name,
          description: template.description,
          category: template.category,
          priority: template.priority,
          estimated_hours: template.estimated_hours,
          due_date: dueDate.toISOString().split('T')[0],
          checklist_items: template.checklist_items,
          created_by: user.id
        };
      });

      const { error: insertError } = await supabase
        .from('tasks')
        .insert(tasksToCreate);

      if (insertError) throw insertError;

      toast({
        title: "Monthly tasks generated!",
        description: `Created ${tasksToCreate.length} tasks for ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}.`,
      });

      loadTasks();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating tasks",
        description: error.message,
      });
    }
  };

  const getStatsCards = () => [
    {
      title: "Total Tasks",
      value: taskStats.total,
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "Pending",
      value: taskStats.pending,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "In Progress", 
      value: taskStats.in_progress,
      icon: PlayCircle,
      color: "text-orange-600"
    },
    {
      title: "Completed",
      value: taskStats.completed,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Overdue",
      value: taskStats.overdue,
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={generateMonthlyTasks}>
        <Calendar className="mr-2 h-4 w-4" />
        Generate Monthly Tasks
      </Button>
      <Button onClick={() => setShowCreateModal(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout title="Task Management" headerActions={headerActions}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qb-blue"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Task Management" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          {getStatsCards().map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-6">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="board">Task Board</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-4">
            <TaskBoard 
              tasks={tasks} 
              onTaskUpdate={loadTasks}
              currentUser={user}
            />
          </TabsContent>

          <TabsContent value="automations" className="space-y-4">
            <TaskAutomationPanel 
              companyId={selectedBusiness?.id || ''}
              onAutomationChange={loadTasks}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={loadTasks}
        companyId={selectedBusiness?.id || ''}
      />
    </MainLayout>
  );
}