import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  User, 
  Calendar,
  MessageSquare,
  Lock,
  Unlock,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { sanitizeText, sanitizeTextArea } from '@/utils/inputSanitization';

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

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: () => void;
  currentUser: any;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onTaskUpdate, 
  currentUser 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [taskData, setTaskData] = useState<Partial<Task>>({});
  
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setTaskData(task);
      loadActivities();
    }
  }, [task]);

  const loadActivities = async () => {
    if (!task) return;

    try {
      const { data, error } = await supabase
        .from('task_activities')
        .select(`
          *,
          user_profile:profiles!task_activities_user_id_fkey(first_name, last_name)
        `)
        .eq('task_id', task.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error loading activities:', error);
    }
  };

  const handleSave = async () => {
    if (!task || !taskData) return;

    try {
      setIsLoading(true);

      // Sanitize inputs
      const sanitizedData = {
        ...taskData,
        name: sanitizeText(taskData.name || ''),
        description: sanitizeTextArea(taskData.description || ''),
        completion_notes: sanitizeTextArea(taskData.completion_notes || ''),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tasks')
        .update(sanitizedData)
        .eq('id', task.id);

      if (error) throw error;

      // Log the update activity
      await supabase
        .from('task_activities')
        .insert({
          task_id: task.id,
          user_id: currentUser.id,
          activity_type: 'task_updated',
          content: 'Task details updated',
          metadata: { updated_fields: Object.keys(taskData) }
        });

      toast({
        title: "Task updated",
        description: "Your changes have been saved successfully.",
      });

      setEditMode(false);
      onTaskUpdate();
      loadActivities();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving task",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;

    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = currentUser.id;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', task.id);

      if (error) throw error;

      // Log status change activity
      await supabase
        .from('task_activities')
        .insert({
          task_id: task.id,
          user_id: currentUser.id,
          activity_type: 'status_change',
          content: `Status changed to ${newStatus}`,
          metadata: { previous_status: task.status, new_status: newStatus }
        });

      toast({
        title: "Status updated",
        description: `Task status changed to ${newStatus}`,
      });

      onTaskUpdate();
      loadActivities();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    }
  };

  const handleChecklistUpdate = async (itemIndex: number, completed: boolean) => {
    if (!task || !taskData.checklist_items) return;

    const updatedChecklist = [...taskData.checklist_items];
    updatedChecklist[itemIndex] = {
      ...updatedChecklist[itemIndex],
      completed,
      completed_by: completed ? currentUser.id : null,
      completed_at: completed ? new Date().toISOString() : null
    };

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          checklist_items: updatedChecklist,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (error) throw error;

      setTaskData({ ...taskData, checklist_items: updatedChecklist });

      // Log checklist update
      await supabase
        .from('task_activities')
        .insert({
          task_id: task.id,
          user_id: currentUser.id,
          activity_type: 'checklist_update',
          content: `Checklist item ${completed ? 'completed' : 'unchecked'}: ${updatedChecklist[itemIndex].text}`,
          metadata: { item_index: itemIndex, completed }
        });

      onTaskUpdate();
      loadActivities();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating checklist",
        description: error.message,
      });
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;

    try {
      const sanitizedComment = sanitizeTextArea(newComment);
      
      const { error } = await supabase
        .from('task_activities')
        .insert({
          task_id: task.id,
          user_id: currentUser.id,
          activity_type: 'comment',
          content: sanitizedComment
        });

      if (error) throw error;

      setNewComment('');
      loadActivities();

      toast({
        title: "Comment added",
        description: "Your comment has been added to the task.",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: error.message,
      });
    }
  };

  const canEdit = task && (!task.is_locked || task.locked_by === currentUser.id);
  const isOwnerOfLock = task?.locked_by === currentUser.id;

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{task.name}</DialogTitle>
              <DialogDescription>
                Created {new Date(task.created_at).toLocaleDateString()}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {task.is_locked && (
                <Badge variant="outline" className="text-xs">
                  {isOwnerOfLock ? (
                    <><Unlock className="w-3 h-3 mr-1" /> You have edit lock</>
                  ) : (
                    <><Lock className="w-3 h-3 mr-1" /> Locked by {task.locked_by_name}</>
                  )}
                </Badge>
              )}
              <Badge className={task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                               task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                               'bg-blue-100 text-blue-800'}>
                {task.priority} priority
              </Badge>
              <Badge variant="outline">
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Task Details</CardTitle>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editMode ? handleSave() : setEditMode(true)}
                      disabled={isLoading}
                    >
                      {editMode ? (
                        <><Save className="w-4 h-4 mr-2" /> Save</>
                      ) : (
                        <>Edit</>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div>
                      <Label>Task Name</Label>
                      <Input
                        value={taskData.name || ''}
                        onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={taskData.description || ''}
                        onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Priority</Label>
                        <Select
                          value={taskData.priority}
                          onValueChange={(value) => setTaskData({ ...taskData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={taskData.due_date || ''}
                          onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {task.description || 'No description provided'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Estimated: {task.estimated_hours}h</span>
                      </div>
                      {task.assigned_to_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Assigned to: {task.assigned_to_name}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Checklist */}
            {task.checklist_items && task.checklist_items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {task.checklist_items.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Checkbox
                          checked={item.completed || false}
                          onCheckedChange={(checked) => handleChecklistUpdate(index, checked as boolean)}
                          disabled={!canEdit}
                        />
                        <div className="flex-1">
                          <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {typeof item === 'string' ? item : item.text || item}
                          </p>
                          {item.completed && item.completed_at && (
                            <p className="text-xs text-muted-foreground">
                              Completed {new Date(item.completed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Actions */}
            {canEdit && task.status !== 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <Button onClick={() => handleStatusChange('in_progress')}>
                        Start Task
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <Button onClick={() => handleStatusChange('completed')} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Task
                        </Button>
                        <Button variant="outline" onClick={() => handleStatusChange('pending')}>
                          Move to Pending
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            {/* Add Comment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Add Comment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddComment} 
                    disabled={!newComment.trim()}
                    size="sm"
                    className="w-full"
                  >
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border-l-2 border-muted pl-4 pb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                          {activity.user_profile?.first_name} {activity.user_profile?.last_name}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()} at{' '}
                          {new Date(activity.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{activity.content}</p>
                      {activity.activity_type === 'status_change' && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Status Change
                        </Badge>
                      )}
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No activity yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;