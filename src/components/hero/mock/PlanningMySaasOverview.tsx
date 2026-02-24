import { useState, useEffect, useMemo } from "react";
import { FileText, Users, TrendingUp, BarChart3, Search, Loader2, ChevronLeft, ChevronRight, Eraser } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WizardRow {
  id: string;
  saas_name: string;
  client_email: string | null;
  industry: string | null;
  created_at: string;
  user_id: string;
}

interface ReportRow {
  id: string;
  wizard_id: string;
  status: string;
  hero_score_section: any;
  summary_section: any;
  created_at: string;
}

interface MergedCard {
  wizardId: string;
  reportId: string;
  saasName: string;
  clientEmail: string | null;
  industry: string | null;
  status: string;
  score: number | null;
  verdict: string | null;
  createdAt: string;
}

const getScoreColor = (score: number) => {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
};

const getVerdictStyle = (verdict: string | null) => {
  if (!verdict) return "bg-white/[0.06] text-white/40";
  const v = verdict.toLowerCase();
  if (v.includes("proceed") || v.includes("strong")) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  if (v.includes("caution") || v.includes("conditional")) return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-red-500/15 text-red-400 border-red-500/20";
};

const getStatusStyle = (status: string) => {
  const s = status.trim().toLowerCase();
  if (s === "completed") return "bg-emerald-500/15 text-emerald-400";
  if (s.includes("fail")) return "bg-red-500/15 text-red-400";
  return "bg-amber-500/15 text-amber-400";
};

const PlanningMySaasOverview = () => {
  const [wizards, setWizards] = useState<WizardRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [wizardRes, reportRes] = await Promise.all([
        supabase.from("tb_pms_wizard").select("id, saas_name, client_email, industry, created_at, user_id").order("created_at", { ascending: false }),
        supabase.from("tb_pms_reports").select("id, wizard_id, status, hero_score_section, summary_section, created_at").order("created_at", { ascending: false }),
      ]);
      setWizards(wizardRes.data || []);
      setReports(reportRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const cards: MergedCard[] = useMemo(() => {
    const reportMap = new Map<string, ReportRow>();
    for (const r of reports) {
      if (!reportMap.has(r.wizard_id)) reportMap.set(r.wizard_id, r);
    }

    return wizards
      .filter((w) => reportMap.has(w.id))
      .map((w) => {
        const r = reportMap.get(w.id)!;
        const score = r.hero_score_section?.overall_score ?? r.hero_score_section?.score ?? null;
        const verdict = r.summary_section?.verdict ?? r.hero_score_section?.verdict ?? null;
        return {
          wizardId: w.id,
          reportId: r.id,
          saasName: w.saas_name,
          clientEmail: w.client_email,
          industry: w.industry,
          status: r.status,
          score: typeof score === "number" ? score : null,
          verdict: typeof verdict === "string" ? verdict : null,
          createdAt: r.created_at,
        };
      });
  }, [wizards, reports]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || c.clientEmail?.toLowerCase().includes(s) || c.saasName.toLowerCase().includes(s);
      const matchStatus = statusFilter === "all" || (() => {
        const st = c.status.trim().toLowerCase();
        if (statusFilter === "completed") return st === "completed";
        if (statusFilter === "failed") return st.includes("fail");
        if (statusFilter === "pending") return st !== "completed" && !st.includes("fail");
        return true;
      })();
      return matchSearch && matchStatus;
    });
  }, [cards, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const completed = cards.filter((c) => c.status.trim().toLowerCase() === "completed");
    const scores = completed.map((c) => c.score).filter((s): s is number => s !== null);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const uniqueUsers = new Set(wizards.map((w) => w.user_id)).size;
    const completionRate = wizards.length ? Math.round((completed.length / cards.length) * 100) : 0;
    return [
      { label: "Total Reports", value: String(completed.length), icon: FileText },
      { label: "Avg. Score", value: scores.length ? `${avgScore}%` : "—", icon: BarChart3 },
      { label: "Total Users", value: String(uniqueUsers), icon: Users },
      { label: "Completion Rate", value: `${completionRate || 0}%`, icon: TrendingUp },
    ];
  }, [cards, wizards]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Planning My SaaS</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-uai-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-uai-500" />
                </div>
                <span className="text-sm text-white/50">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by email or project name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
          disabled={!searchTerm && statusFilter === "all"}
          title="Clear filters"
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-white/30" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <FileText className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-sm text-white/40">No reports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((card) => (
            <div
              key={card.reportId}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate" title={card.saasName}>{card.saasName}</h3>
                  <p className="text-xs text-white/40 truncate" title={card.clientEmail || ""}>{card.clientEmail || "—"}</p>
                </div>
                <Badge className={`text-[10px] shrink-0 ${getStatusStyle(card.status)}`}>
                  {card.status.trim().toLowerCase() === "completed" ? "Completed" : card.status.toLowerCase().includes("fail") ? "Failed" : "Pending"}
                </Badge>
              </div>

              {/* Industry */}
              {card.industry && (
                <p className="text-xs text-white/30">{card.industry}</p>
              )}

              {/* Score */}
              {card.score !== null ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Viability Score</span>
                    <span className="text-sm font-bold text-white font-mono">{card.score}%</span>
                  </div>
                  <Progress value={card.score} className="h-1.5 bg-white/[0.06]" indicatorClassName={getScoreColor(card.score)} />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Viability Score</span>
                  <span className="text-xs text-white/20">—</span>
                </div>
              )}

              {/* Verdict + Date */}
              <div className="flex items-center justify-between pt-1">
                {card.verdict ? (
                  <Badge className={`text-[10px] border ${getVerdictStyle(card.verdict)}`}>{card.verdict}</Badge>
                ) : (
                  <span />
                )}
                <span className="text-[10px] text-white/30">{formatDate(card.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-white/40">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="text-xs text-white/50">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningMySaasOverview;
