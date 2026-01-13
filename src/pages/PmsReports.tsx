import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, LogOut, Settings, Sparkles, TrendingUp, Calendar, BarChart3, Loader2 } from "lucide-react";
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
import ReportCardSkeleton from "@/components/planningmysaas/skeletons/ReportCardSkeleton";
import StatsCardSkeleton from "@/components/planningmysaas/skeletons/StatsCardSkeleton";
import { 
  getReports, 
  deleteReport, 
  StoredReport, 
  getProjectDisplayName 
} from "@/lib/reportsStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import uaicodeLogo from "@/assets/uaicode-logo.png";

const PmsReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, pmsUser } = useAuthContext();
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<StoredReport | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReports(getReports());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    if (reports.length === 0) return null;
    
    const totalReports = reports.length;
    const scores = reports
      .map(r => r.reportData?.viabilityScore || 0)
      .filter(s => s > 0);
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length) 
      : 0;
    
    const sortedReports = [...reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const latestReport = sortedReports[0];
    const daysSinceLatest = Math.floor(
      (Date.now() - new Date(latestReport.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return { totalReports, avgScore, daysSinceLatest };
  }, [reports]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/planningmysaas/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even on error, navigate to login (signOut is resilient now)
      navigate("/planningmysaas/login");
    } finally {
      setIsLoggingOut(false);
    }
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 aurora-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />
      
      {/* Header Premium */}
      <header className="sticky top-0 z-50 glass-premium border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <img 
                src={uaicodeLogo} 
                alt="Uaicode" 
                className="h-9 w-9 rounded-lg"
              />
              <div>
                <span className="text-lg font-bold text-foreground">
                  Planning<span className="text-accent">My</span>SaaS
                </span>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              {/* New Report Button */}
              <Button 
                onClick={() => navigate("/planningmysaas/wizard")}
                className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Report</span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-accent/10 border border-border/50 rounded-full transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 glass-premium border-accent/20"
                >
                  {/* User info */}
                  {pmsUser && (
                    <>
                      <div className="px-2 py-2 text-sm">
                        <p className="font-medium text-foreground truncate">{pmsUser.full_name}</p>
                        <p className="text-muted-foreground text-xs truncate">{pmsUser.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-border/50" />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={() => navigate("/planningmysaas/profile")}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 mr-2" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="animate-smooth-fade">
            {/* Hero Skeleton */}
            <section className="mb-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">AI-Powered Validation</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Your Reports
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Track and manage your SaaS validation reports in one place
                </p>
              </div>

              {/* Stats Skeletons */}
              <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </div>
            </section>

            {/* Report Cards Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <ReportCardSkeleton />
              <ReportCardSkeleton />
              <ReportCardSkeleton />
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="animate-smooth-fade">
            <EmptyReports />
          </div>
        ) : (
          <div className="animate-smooth-fade">
            {/* Hero Section with Stats */}
            <section className="mb-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">AI-Powered Validation</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Your Reports
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Track and manage your SaaS validation reports in one place
                </p>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
                  <div className="glass-card rounded-xl p-4 text-center border border-accent/10 hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-accent" />
                      <span className="text-2xl font-bold text-foreground">{stats.totalReports}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Reports</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center border border-accent/10 hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-2xl font-bold text-foreground">{stats.avgScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg. Viability</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center border border-accent/10 hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="text-2xl font-bold text-foreground">
                        {stats.daysSinceLatest === 0 ? 'Today' : `${stats.daysSinceLatest}d`}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Last Created</p>
                  </div>
                </div>
              )}
            </section>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map((report) => (
                <ReportCard 
                  key={report.id}
                  report={report} 
                  onDelete={handleDeleteClick}
                />
              ))}
              
              {/* Create New Card - Premium */}
              <Card 
                className="group cursor-pointer relative overflow-hidden 
                  border-2 border-dashed border-accent/30 hover:border-accent/60 
                  bg-gradient-to-br from-accent/5 to-transparent
                  transition-all duration-500 hover:-translate-y-1 
                  hover:shadow-[0_0_40px_hsla(45,100%,55%,0.1)]"
                onClick={() => navigate("/planningmysaas/wizard")}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent 
                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <CardContent className="relative flex flex-col items-center justify-center h-full min-h-[280px] p-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 
                    flex items-center justify-center mb-4 
                    group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                    <Plus className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-1">
                    Create New Report
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Validate your next SaaS idea
                  </p>
                </CardContent>
              </Card>
            </div>
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
