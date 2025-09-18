import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Filter,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface ReportFiltersProps {
  onFiltersChange?: (filters: any) => void;
  showAccountFilter?: boolean;
  showCustomerFilter?: boolean;
  showVendorFilter?: boolean;
  showCategoryFilter?: boolean;
  showStatusFilter?: boolean;
  showAmountRange?: boolean;
  showTransactionType?: boolean;
}

const ReportFilters = ({
  onFiltersChange,
  showAccountFilter = true,
  showCustomerFilter = true,
  showVendorFilter = true,
  showCategoryFilter = true,
  showStatusFilter = true,
  showAmountRange = true,
  showTransactionType = true,
}: ReportFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    dateRange: "this-month",
    startDate: "",
    endDate: "",
    accounts: [] as string[],
    customers: [] as string[],
    vendors: [] as string[],
    categories: [] as string[],
    statuses: [] as string[],
    minAmount: "",
    maxAmount: "",
    transactionTypes: [] as string[],
  });

  const dateRangeOptions: FilterOption[] = [
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-quarter", label: "This Quarter" },
    { value: "this-year", label: "This Year" },
    { value: "last-week", label: "Last Week" },
    { value: "last-month", label: "Last Month" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "last-year", label: "Last Year" },
    { value: "year-to-date", label: "Year to Date" },
    { value: "custom", label: "Custom Range" },
  ];

  const accountOptions: FilterOption[] = [
    { value: "checking", label: "Business Checking" },
    { value: "savings", label: "Business Savings" },
    { value: "credit-card", label: "Business Credit Card" },
    { value: "petty-cash", label: "Petty Cash" },
    { value: "loan", label: "Equipment Loan" },
  ];

  const customerOptions: FilterOption[] = [
    { value: "abc-corp", label: "ABC Corporation" },
    { value: "tech-startup", label: "Tech Startup Inc" },
    { value: "local-business", label: "Local Business LLC" },
    { value: "enterprise-corp", label: "Enterprise Corp" },
    { value: "global-solutions", label: "Global Solutions" },
  ];

  const vendorOptions: FilterOption[] = [
    { value: "office-supply", label: "Office Supply Co." },
    { value: "software-solutions", label: "Software Solutions Inc" },
    { value: "marketing-agency", label: "Marketing Agency" },
    { value: "utility-company", label: "Utility Company" },
    { value: "internet-services", label: "Internet Services Inc" },
  ];

  const categoryOptions: FilterOption[] = [
    { value: "office-supplies", label: "Office Supplies" },
    { value: "software", label: "Software & Tools" },
    { value: "utilities", label: "Utilities" },
    { value: "marketing", label: "Marketing" },
    { value: "travel", label: "Travel" },
    { value: "meals", label: "Meals & Entertainment" },
    { value: "professional-services", label: "Professional Services" },
    { value: "rent", label: "Rent & Lease" },
  ];

  const statusOptions: FilterOption[] = [
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "partial", label: "Partial" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const transactionTypeOptions: FilterOption[] = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
    { value: "transfer", label: "Transfer" },
    { value: "deposit", label: "Deposit" },
    { value: "withdrawal", label: "Withdrawal" },
  ];

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    
    // Update active filters for badge display
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: any) => {
    const active: string[] = [];
    
    if (currentFilters.dateRange && currentFilters.dateRange !== "this-month") {
      active.push(`Date: ${dateRangeOptions.find(opt => opt.value === currentFilters.dateRange)?.label}`);
    }
    if (currentFilters.accounts.length > 0) {
      active.push(`Accounts: ${currentFilters.accounts.length}`);
    }
    if (currentFilters.customers.length > 0) {
      active.push(`Customers: ${currentFilters.customers.length}`);
    }
    if (currentFilters.vendors.length > 0) {
      active.push(`Vendors: ${currentFilters.vendors.length}`);
    }
    if (currentFilters.categories.length > 0) {
      active.push(`Categories: ${currentFilters.categories.length}`);
    }
    if (currentFilters.statuses.length > 0) {
      active.push(`Status: ${currentFilters.statuses.length}`);
    }
    if (currentFilters.minAmount || currentFilters.maxAmount) {
      active.push("Amount Range");
    }
    if (currentFilters.transactionTypes.length > 0) {
      active.push(`Types: ${currentFilters.transactionTypes.length}`);
    }
    
    setActiveFilters(active);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: "this-month",
      startDate: "",
      endDate: "",
      accounts: [],
      customers: [],
      vendors: [],
      categories: [],
      statuses: [],
      minAmount: "",
      maxAmount: "",
      transactionTypes: [],
    };
    
    setFilters(clearedFilters);
    setActiveFilters([]);
    onFiltersChange?.(clearedFilters);
  };

  const MultiSelectFilter = ({ 
    title, 
    options, 
    selectedValues, 
    onChange, 
    placeholder 
  }: {
    title: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{title}</label>
      <Select onValueChange={(value) => {
        if (!selectedValues.includes(value)) {
          onChange([...selectedValues, value]);
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge key={value} variant="secondary" className="text-xs">
                {option?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => onChange(selectedValues.filter(v => v !== value))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Card className="shadow-qb-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Filters</CardTitle>
            {activeFilters.length > 0 && (
              <Badge variant="outline">
                {activeFilters.length} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilters.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <RotateCcw className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date Range</label>
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => handleFilterChange("dateRange", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {filters.dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Account Filter */}
            {showAccountFilter && (
              <MultiSelectFilter
                title="Accounts"
                options={accountOptions}
                selectedValues={filters.accounts}
                onChange={(values) => handleFilterChange("accounts", values)}
                placeholder="Select accounts"
              />
            )}

            {/* Customer Filter */}
            {showCustomerFilter && (
              <MultiSelectFilter
                title="Customers"
                options={customerOptions}
                selectedValues={filters.customers}
                onChange={(values) => handleFilterChange("customers", values)}
                placeholder="Select customers"
              />
            )}

            {/* Vendor Filter */}
            {showVendorFilter && (
              <MultiSelectFilter
                title="Vendors"
                options={vendorOptions}
                selectedValues={filters.vendors}
                onChange={(values) => handleFilterChange("vendors", values)}
                placeholder="Select vendors"
              />
            )}

            {/* Category Filter */}
            {showCategoryFilter && (
              <MultiSelectFilter
                title="Categories"
                options={categoryOptions}
                selectedValues={filters.categories}
                onChange={(values) => handleFilterChange("categories", values)}
                placeholder="Select categories"
              />
            )}

            {/* Status Filter */}
            {showStatusFilter && (
              <MultiSelectFilter
                title="Status"
                options={statusOptions}
                selectedValues={filters.statuses}
                onChange={(values) => handleFilterChange("statuses", values)}
                placeholder="Select statuses"
              />
            )}

            {/* Transaction Type Filter */}
            {showTransactionType && (
              <MultiSelectFilter
                title="Transaction Type"
                options={transactionTypeOptions}
                selectedValues={filters.transactionTypes}
                onChange={(values) => handleFilterChange("transactionTypes", values)}
                placeholder="Select types"
              />
            )}

            {/* Amount Range Filter */}
            {showAmountRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min Amount"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Amount"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportFilters;