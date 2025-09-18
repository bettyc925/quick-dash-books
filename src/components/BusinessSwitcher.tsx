import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompany } from '@/contexts/CompanyContext';
import { useNavigate } from 'react-router-dom';

const BusinessSwitcher = () => {
  const { selectedBusiness, clearSelections } = useCompany();
  const navigate = useNavigate();

  const handleSwitchBusiness = () => {
    clearSelections();
    navigate('/company-selection');
  };

  if (!selectedBusiness) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-auto p-3 bg-gradient-accent text-white hover:bg-qb-teal/20 shadow-qb-md"
        >
          <div className="flex items-center space-x-2 min-w-0">
            <Building2 className="h-5 w-5 flex-shrink-0" />
            <span className="font-semibold truncate">{selectedBusiness.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem onClick={handleSwitchBusiness} className="cursor-pointer">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Switch Business</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BusinessSwitcher;