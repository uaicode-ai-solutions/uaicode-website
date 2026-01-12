import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import ReportCard from "@/components/planningmysaas/reports/ReportCard";
import EmptyReports from "@/components/planningmysaas/reports/EmptyReports";
import DeleteReportDialog from "@/components/planningmysaas/reports/DeleteReportDialog";
import { 
  getReports, 
  deleteReport, 
  StoredReport, 
  getProjectDisplayName 
} from "@/lib/reportsStorage";
import { useToast } from "@/hooks/use-toast";

const PmsReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<StoredReport | null>(null);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleLogout = () => {
    navigate("/planningmysaas/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteClick = (id: string) => {
    const report = reports.find((r) => r.id === id);
    if (report) {
      setReportToDelete(report);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete.id);
      setReports(getReports());
      toast({
        title: "Report deleted",
        description: `"${getProjectDisplayName(reportToDelete)}" has been deleted.`,
      });
      setReportToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">My Reports</h1>
                <p className="text-xs text-muted-foreground">
                  {reports.length} {reports.length === 1 ? 'report' : 'reports'}
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              {/* New Report Button */}
              <Button 
                onClick={() => navigate("/planningmysaas/wizard")}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Report</span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
                  <DropdownMenuItem 
                    onClick={() => navigate("/planningmysaas/profile")}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {reports.length === 0 ? (
          <EmptyReports />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onDelete={handleDeleteClick}
              />
            ))}
            
            {/* Create New Card */}
            <Card 
              className="group cursor-pointer border-dashed border-2 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
              onClick={() => navigate("/planningmysaas/wizard")}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[180px] p-5">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Create New Report
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Delete Dialog */}
      <DeleteReportDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        projectName={reportToDelete ? getProjectDisplayName(reportToDelete) : ""}
      />
    </div>
  );
};

export default PmsReports;
