-- Create task management tables for accounting close processes

-- Task templates for repetitive monthly tasks
CREATE TABLE public.task_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general', -- 'month_end_close', 'general', 'reconciliation', 'reporting'
  priority text NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  estimated_hours numeric DEFAULT 1.0,
  due_day_of_month integer DEFAULT 1, -- Which day of month it's due
  assigned_role text, -- 'admin', 'editor', 'viewer' or specific user_id
  is_recurring boolean NOT NULL DEFAULT true,
  checklist_items jsonb DEFAULT '[]'::jsonb, -- Array of checklist items
  automation_rules jsonb DEFAULT '{}'::jsonb, -- Automation configuration
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Individual task instances (generated from templates or created manually)
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  template_id uuid REFERENCES task_templates(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'blocked'
  estimated_hours numeric DEFAULT 1.0,
  actual_hours numeric DEFAULT 0.0,
  due_date date,
  assigned_to uuid, -- user_id
  assigned_by uuid,
  checklist_items jsonb DEFAULT '[]'::jsonb,
  completion_notes text,
  completed_at timestamp with time zone,
  completed_by uuid,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Task edit locks to prevent concurrent editing
CREATE TABLE public.task_locks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  locked_by uuid NOT NULL,
  locked_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '30 minutes'),
  UNIQUE(task_id)
);

-- Task comments and activity log
CREATE TABLE public.task_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  activity_type text NOT NULL, -- 'comment', 'status_change', 'assignment', 'completion', 'automation'
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Task automation logs
CREATE TABLE public.task_automations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  trigger_type text NOT NULL, -- 'monthly_close', 'date_based', 'task_completion', 'manual'
  trigger_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  action_type text NOT NULL, -- 'create_tasks', 'send_notification', 'update_status'
  action_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  last_run timestamp with time zone,
  next_run timestamp with time zone,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_automations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for task_templates
CREATE POLICY "Users can view task templates for their companies" 
ON public.task_templates 
FOR SELECT 
USING (company_id IN (
  SELECT uc.company_id FROM user_companies uc 
  WHERE uc.user_id = auth.uid()
));

CREATE POLICY "Users can manage task templates for companies they admin/edit" 
ON public.task_templates 
FOR ALL 
USING (company_id IN (
  SELECT uc.company_id FROM user_companies uc 
  WHERE uc.user_id = auth.uid() AND uc.role IN ('admin', 'editor')
));

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks for their companies" 
ON public.tasks 
FOR SELECT 
USING (company_id IN (
  SELECT uc.company_id FROM user_companies uc 
  WHERE uc.user_id = auth.uid()
));

CREATE POLICY "Users can manage tasks for companies they admin/edit" 
ON public.tasks 
FOR ALL 
USING (company_id IN (
  SELECT uc.company_id FROM user_companies uc 
  WHERE uc.user_id = auth.uid() AND uc.role IN ('admin', 'editor')
));

-- RLS Policies for task_locks
CREATE POLICY "Users can view locks for their company tasks" 
ON public.task_locks 
FOR SELECT 
USING (task_id IN (
  SELECT t.id FROM tasks t 
  JOIN user_companies uc ON t.company_id = uc.company_id 
  WHERE uc.user_id = auth.uid()
));

CREATE POLICY "Users can manage locks for tasks they can edit" 
ON public.task_locks 
FOR ALL 
USING (task_id IN (
  SELECT t.id FROM tasks t 
  JOIN user_companies uc ON t.company_id = uc.company_id 
  WHERE uc.user_id = auth.uid() AND uc.role IN ('admin', 'editor')
));

-- RLS Policies for task_activities
CREATE POLICY "Users can view activities for their company tasks" 
ON public.task_activities 
FOR SELECT 
USING (task_id IN (
  SELECT t.id FROM tasks t 
  JOIN user_companies uc ON t.company_id = uc.company_id 
  WHERE uc.user_id = auth.uid()
));

CREATE POLICY "Users can create activities for tasks they can access" 
ON public.task_activities 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() AND
  task_id IN (
    SELECT t.id FROM tasks t 
    JOIN user_companies uc ON t.company_id = uc.company_id 
    WHERE uc.user_id = auth.uid()
  )
);

-- RLS Policies for task_automations
CREATE POLICY "Users can view automations for their companies" 
ON public.task_automations 
FOR SELECT 
USING (company_id IN (
  SELECT uc.company_id FROM user_companies uc 
  WHERE uc.user_id = auth.uid()
));

CREATE POLICY "Users can manage automations for companies they admin" 
ON public.task_automations 
FOR ALL 
USING (company_id IN (
  SELECT uc.company_id FROM user_companies uc 
  WHERE uc.user_id = auth.uid() AND uc.role = 'admin'
));

-- Add update triggers
CREATE TRIGGER update_task_templates_updated_at
BEFORE UPDATE ON public.task_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_automations_updated_at
BEFORE UPDATE ON public.task_automations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to clean up expired task locks
CREATE OR REPLACE FUNCTION public.cleanup_expired_task_locks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.task_locks 
  WHERE expires_at < now();
END;
$$;

-- Insert default month-end close task templates
INSERT INTO public.task_templates (company_id, name, description, category, priority, due_day_of_month, estimated_hours, created_by, checklist_items) 
SELECT 
  c.id,
  template.name,
  template.description,
  template.category,
  template.priority,
  template.due_day,
  template.hours,
  uc.user_id,
  template.checklist::jsonb
FROM companies c
JOIN user_companies uc ON c.id = uc.company_id AND uc.role = 'admin'
CROSS JOIN (
  VALUES 
    ('Bank Reconciliation', 'Reconcile all bank accounts for the month', 'month_end_close', 'high', 5, 2.0, '["Download bank statements", "Match transactions", "Investigate discrepancies", "Finalize reconciliation"]'),
    ('Credit Card Reconciliation', 'Reconcile all credit card accounts', 'month_end_close', 'high', 5, 1.5, '["Download CC statements", "Match expenses", "Review unmatched items", "Complete reconciliation"]'),
    ('Accounts Receivable Review', 'Review and age outstanding receivables', 'month_end_close', 'medium', 10, 1.0, '["Run AR aging report", "Review past due accounts", "Send follow-up communications", "Update collection notes"]'),
    ('Accounts Payable Review', 'Review outstanding payables and accruals', 'month_end_close', 'medium', 10, 1.0, '["Run AP aging report", "Review vendor invoices", "Record accruals", "Prepare payment schedule"]'),
    ('Inventory Count & Valuation', 'Physical inventory count and valuation adjustments', 'month_end_close', 'high', 15, 4.0, '["Conduct physical count", "Update inventory records", "Calculate COGS", "Record adjusting entries"]'),
    ('Depreciation Calculation', 'Calculate and record monthly depreciation', 'month_end_close', 'medium', 20, 0.5, '["Review fixed asset schedule", "Calculate monthly depreciation", "Record journal entries", "Update asset records"]'),
    ('Accrual Entries', 'Record month-end accrual entries', 'month_end_close', 'medium', 25, 1.5, '["Review outstanding expenses", "Calculate accruals", "Prepare journal entries", "Review with management"]'),
    ('Financial Statement Preparation', 'Prepare monthly financial statements', 'month_end_close', 'high', 28, 3.0, '["Generate trial balance", "Review account balances", "Prepare P&L statement", "Prepare balance sheet", "Review with management"]')
  ) AS template(name, description, category, priority, due_day, hours, checklist)
WHERE NOT EXISTS (
  SELECT 1 FROM task_templates tt 
  WHERE tt.company_id = c.id AND tt.name = template.name
);