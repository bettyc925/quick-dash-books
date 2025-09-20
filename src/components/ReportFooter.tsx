import { format } from "date-fns";

interface ReportFooterProps {
  generatedAt?: Date;
  pageNumber?: number;
  totalPages?: number;
  disclaimer?: string;
}

const ReportFooter = ({ 
  generatedAt = new Date(),
  pageNumber = 1,
  totalPages = 1,
  disclaimer = "This report is generated from Betty's Books data and is for internal use only."
}: ReportFooterProps) => {
  return (
    <div className="border-t border-border mt-8 pt-4 text-xs text-muted-foreground">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p>
            <strong>Generated:</strong> {format(generatedAt, "MMMM dd, yyyy 'at' h:mm:ss a")}
          </p>
          <p>
            <strong>Page:</strong> {pageNumber} of {totalPages}
          </p>
        </div>
        <div className="max-w-md text-right">
          <p className="italic">
            {disclaimer}
          </p>
        </div>
      </div>
      
      <div className="text-center mt-4 pt-2 border-t border-border">
        <p className="text-xs">
          © {new Date().getFullYear()} Betty's Books Pro. All financial data is confidential and proprietary.
        </p>
      </div>
    </div>
  );
};

export default ReportFooter;