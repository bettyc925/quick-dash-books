import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface FinancialReportHeaderProps {
  reportTitle: string;
  reportPeriod?: string;
  reportDate?: Date;
  subtitle?: string;
}

const FinancialReportHeader = ({ 
  reportTitle, 
  reportPeriod = "Current Month", 
  reportDate = new Date(),
  subtitle 
}: FinancialReportHeaderProps) => {
  const { profile } = useAuth();
  
  return (
    <div className="text-center border-b border-border pb-6 mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        {profile?.company_name || "Your Company Name"}
      </h1>
      <h2 className="text-xl font-semibold text-foreground mb-1">
        {reportTitle}
      </h2>
      {subtitle && (
        <h3 className="text-lg text-muted-foreground mb-2">
          {subtitle}
        </h3>
      )}
      <p className="text-sm text-muted-foreground">
        For the period: {reportPeriod}
      </p>
      <p className="text-xs text-muted-foreground">
        Report prepared on: {format(reportDate, "MMMM dd, yyyy")}
      </p>
    </div>
  );
};

export default FinancialReportHeader;