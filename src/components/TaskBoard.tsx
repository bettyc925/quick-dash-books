import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  User, 
  Calendar,
  Lock,
  Unlock,
  Edit,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  MessageSquare
} from 'lucide-react';
import TaskDetailModal from '@/components/TaskDetailModal';

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

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  currentUser: any;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskUpdate, currentUser }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const { toast } = useToast();

  const columns = [
    { id: 'pending', title: 'Pending', color: 'border-gray-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-orange-300' },
    { id: 'completed', title: 'Completed', color: 'border-green-300' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'month_end_close': return 'bg-purple-100 text-purple-800';
      case 'reconciliation': return 'bg-blue-100 text-blue-800';
      case 'reporting': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const isOverdue = (dueDate?: string, status?: string) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        actual_hours: 0
      };

      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = currentUser.id;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      // Add activity log
      await supabase
        .from('task_activities')
        .insert({
          task_id: taskId,
          user_id: currentUser.id,
          activity_type: 'status_change',
          content: `Status changed to ${newStatus}`,
          metadata: { new_status: newStatus }
        });

      toast({
        title: "Task updated",
        description: `Task status changed to ${newStatus}`,
      });

      onTaskUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating task",
        description: error.message,
      });
    }
  };

  const toggleTaskLock = async (taskId: string, isLocked: boolean) => {
    try {
      if (isLocked) {
        // Unlock task
        const { error } = await supabase
          .from('task_locks')
          .delete()
          .eq('task_id', taskId)
          .eq('locked_by', currentUser.id);

        if (error) throw error;

        toast({
          title: "Task unlocked",
          description: "Task is now available for editing by others.",
        });
      } else {
        // Lock task
        const { error } = await supabase
          .from('task_locks')
          .insert({
            task_id: taskId,
            locked_by: currentUser.id
          });

        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            toast({
              variant: "destructive",
              title: "Task is already locked",
              description: "Another user is currently editing this task.",
            });
            return;
          }
          throw error;
        }

        toast({
          title: "Task locked",
          description: "You now have exclusive editing rights for 30 minutes.",
        });
      }

      onTaskUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating task lock",
        description: error.message,
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const calculateProgress = (checklist: any[]) => {
    if (!checklist || checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className="space-y-4">
            <div className={`border-b-2 ${column.color} pb-2`}>
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <p className="text-sm text-muted-foreground">
                {getTasksByStatus(column.id).length} tasks
              </p>
            </div>

            <div className="space-y-3">
              {getTasksByStatus(column.id).map(task => (
                <Card 
                  key={task.id} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    isOverdue(task.due_date, task.status) ? 'border-red-300 bg-red-50' : ''
                  }`}
                  onClick={() => handleTaskClick(task)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium truncate">
                          {task.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={getCategoryColor(task.category)}>
                            {task.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {task.is_locked && (
                          <div className="flex items-center">
                            {task.locked_by === currentUser.id ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTaskLock(task.id, true);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Unlock className="h-3 w-3 text-green-600" />
                              </Button>
                            ) : (
                              <Lock className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                        )}
                        
                        {!task.is_locked && task.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskLock(task.id, false);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Checklist Progress */}
                    {task.checklist_items && task.checklist_items.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Checklist Progress</span>
                          <span>{calculateProgress(task.checklist_items)}%</span>
                        </div>
                        <Progress value={calculateProgress(task.checklist_items)} className="h-1" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(task.due_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.estimated_hours}h</span>
                      </div>
                    </div>

                    {task.assigned_to_name && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{task.assigned_to_name}</span>
                      </div>
                    )}

                    {/* Quick Status Actions */}
                    {task.status !== 'completed' && !task.is_locked && (
                      <div className="flex gap-1 pt-2">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, 'in_progress');
                            }}
                            className="h-6 text-xs"
                          >
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(task.id, 'pending');
                              }}
                              className="h-6 text-xs"
                            >
                              <PauseCircle className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(task.id, 'completed');
                              }}
                              className="h-6 text-xs"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {task.is_locked && task.locked_by !== currentUser.id && (
                      <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded">
                        🔒 Currently being edited by {task.locked_by_name}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {getTasksByStatus(column.id).length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center h-20">
                    <p className="text-sm text-muted-foreground">No {column.title.toLowerCase()} tasks</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={showTaskDetail}
        onClose={() => {
          setShowTaskDetail(false);
          setSelectedTask(null);
        }}
        onTaskUpdate={onTaskUpdate}
        currentUser={currentUser}
      />
    </>
  );
};

export default TaskBoard;