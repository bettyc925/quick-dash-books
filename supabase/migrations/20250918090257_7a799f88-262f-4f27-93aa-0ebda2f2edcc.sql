-- Add currency support to companies
ALTER TABLE public.companies 
ADD COLUMN currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
ADD COLUMN fiscal_year_end DATE DEFAULT '2024-12-31',
ADD COLUMN gaap_standard VARCHAR(10) DEFAULT 'US_GAAP' CHECK (gaap_standard IN ('US_GAAP', 'IFRS', 'OTHER'));

-- Create consolidation groups table
CREATE TABLE public.consolidation_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    reporting_currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    gaap_standard VARCHAR(10) DEFAULT 'US_GAAP' CHECK (gaap_standard IN ('US_GAAP', 'IFRS', 'OTHER')),
    parent_company_id UUID REFERENCES public.companies(id),
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on consolidation_groups
ALTER TABLE public.consolidation_groups ENABLE ROW LEVEL SECURITY;

-- Create consolidation group members table
CREATE TABLE public.consolidation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.consolidation_groups(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    ownership_percentage DECIMAL(5,2) DEFAULT 100.00 CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    consolidation_method VARCHAR(20) DEFAULT 'full' CHECK (consolidation_method IN ('full', 'proportional', 'equity')),
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(group_id, company_id)
);

-- Enable RLS on consolidation_members
ALTER TABLE public.consolidation_members ENABLE ROW LEVEL SECURITY;

-- Create company merge requests table (without generated column)
CREATE TABLE public.company_merge_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_company_id UUID REFERENCES public.companies(id) NOT NULL,
    target_company_id UUID REFERENCES public.companies(id) NOT NULL,
    requested_by UUID NOT NULL,
    reason TEXT NOT NULL,
    verification_code TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    approver_id UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- Prevent merging a company with itself
    CHECK (source_company_id != target_company_id)
);

-- Enable RLS on company_merge_requests
ALTER TABLE public.company_merge_requests ENABLE ROW LEVEL SECURITY;

-- Create merge request approvals table for additional validation
CREATE TABLE public.merge_request_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merge_request_id UUID REFERENCES public.company_merge_requests(id) ON DELETE CASCADE NOT NULL,
    approver_id UUID NOT NULL,
    verification_code_entered TEXT NOT NULL,
    company_relationship_confirmed BOOLEAN DEFAULT false,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT
);

-- Enable RLS on merge_request_approvals
ALTER TABLE public.merge_request_approvals ENABLE ROW LEVEL SECURITY;

-- Create exchange rates table for currency conversion
CREATE TABLE public.exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15,6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(from_currency, to_currency, effective_date)
);

-- Enable RLS on exchange_rates
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Add triggers for updated_at
CREATE TRIGGER update_consolidation_groups_updated_at
    BEFORE UPDATE ON public.consolidation_groups
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_merge_requests_updated_at
    BEFORE UPDATE ON public.company_merge_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for consolidation_groups
CREATE POLICY "Users can view consolidation groups for their companies" 
ON public.consolidation_groups 
FOR SELECT 
USING (
    created_by = auth.uid() OR
    parent_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
);

CREATE POLICY "Users can create consolidation groups" 
ON public.consolidation_groups 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update consolidation groups they created or have admin access" 
ON public.consolidation_groups 
FOR UPDATE 
USING (
    created_by = auth.uid() OR
    parent_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
);

-- RLS Policies for consolidation_members
CREATE POLICY "Users can view consolidation members for their groups" 
ON public.consolidation_members 
FOR SELECT 
USING (
    group_id IN (
        SELECT id FROM consolidation_groups 
        WHERE created_by = auth.uid() OR parent_company_id IN (
            SELECT company_id FROM user_companies 
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    )
);

CREATE POLICY "Users can manage consolidation members for their groups" 
ON public.consolidation_members 
FOR ALL 
USING (
    group_id IN (
        SELECT id FROM consolidation_groups 
        WHERE created_by = auth.uid() OR parent_company_id IN (
            SELECT company_id FROM user_companies 
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    )
);

-- RLS Policies for company_merge_requests
CREATE POLICY "Users can view merge requests for their companies" 
ON public.company_merge_requests 
FOR SELECT 
USING (
    requested_by = auth.uid() OR
    source_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin')
    ) OR
    target_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin')
    )
);

CREATE POLICY "Users can create merge requests for companies they have admin access to" 
ON public.company_merge_requests 
FOR INSERT 
WITH CHECK (
    requested_by = auth.uid() AND
    source_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin')
    )
);

CREATE POLICY "Admins can update merge requests for their companies" 
ON public.company_merge_requests 
FOR UPDATE 
USING (
    source_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin')
    ) OR
    target_company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid() AND role IN ('admin')
    )
);

-- RLS Policies for merge_request_approvals
CREATE POLICY "Users can view approvals for merge requests they're involved in" 
ON public.merge_request_approvals 
FOR SELECT 
USING (
    approver_id = auth.uid() OR
    merge_request_id IN (
        SELECT id FROM company_merge_requests 
        WHERE requested_by = auth.uid() OR
        source_company_id IN (
            SELECT company_id FROM user_companies 
            WHERE user_id = auth.uid() AND role IN ('admin')
        ) OR
        target_company_id IN (
            SELECT company_id FROM user_companies 
            WHERE user_id = auth.uid() AND role IN ('admin')
        )
    )
);

CREATE POLICY "Users can create approvals for merge requests" 
ON public.merge_request_approvals 
FOR INSERT 
WITH CHECK (approver_id = auth.uid());

-- RLS Policies for exchange_rates (view only for authenticated users)
CREATE POLICY "Authenticated users can view exchange rates" 
ON public.exchange_rates 
FOR SELECT 
TO authenticated 
USING (true);

-- Insert some common exchange rates (USD base)
INSERT INTO public.exchange_rates (from_currency, to_currency, rate, effective_date) VALUES
('USD', 'USD', 1.000000, CURRENT_DATE),
('EUR', 'USD', 1.100000, CURRENT_DATE),
('GBP', 'USD', 1.250000, CURRENT_DATE),
('CAD', 'USD', 0.740000, CURRENT_DATE),
('JPY', 'USD', 0.007000, CURRENT_DATE),
('USD', 'EUR', 0.909091, CURRENT_DATE),
('USD', 'GBP', 0.800000, CURRENT_DATE),
('USD', 'CAD', 1.351351, CURRENT_DATE),
('USD', 'JPY', 142.857143, CURRENT_DATE);