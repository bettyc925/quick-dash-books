import React, { useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCompany } from '@/contexts/CompanyContext';

const ClientSwitcher = () => {
  const { selectedBusiness, selectedClient, setSelectedClient } = useCompany();

  // Mock clients for demo - in real app, this would come from database
  const mockClients = [
    { id: '1', name: 'Acme Corporation' },
    { id: '2', name: 'Smith & Associates' },
    { id: '3', name: 'Green Energy Solutions' },
  ];

  if (!selectedBusiness) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="justify-between min-w-48 bg-card border-border hover:bg-accent"
        >
          <div className="flex items-center space-x-2 min-w-0">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {selectedClient ? selectedClient.name : 'Select Client'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {!selectedClient && (
          <>
            <DropdownMenuItem className="text-muted-foreground">
              Choose a client company
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {mockClients.map((client) => (
          <DropdownMenuItem 
            key={client.id}
            onClick={() => setSelectedClient({ 
              id: client.id, 
              name: client.name,
              user_role: 'client',
              created_at: new Date().toISOString()
            })}
            className="cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{client.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
        {selectedClient && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setSelectedClient(null)}
              className="cursor-pointer text-muted-foreground"
            >
              Clear Selection
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientSwitcher;