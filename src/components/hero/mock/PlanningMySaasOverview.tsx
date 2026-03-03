import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FileText, BarChart3, Globe, Building2, Search, Loader2, ChevronLeft, ChevronRight, Eraser, Eye, RefreshCw } from "lucide-react";
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

interface LpWizardRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  geographic_region: string | null;
  industry: string | null;
  industry_other: string | null;
  ideal_business_model: string | null;
  saas_name: string | null;
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
  reportId: string;
  wizardId: string;
  saasName: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  region: string | null;
  industry: string | null;
  businessModel: string | null;
  status: string;
  score: number | null;
  verdict: string | null;
  createdAt: string;
}

const getScoreColor = (score: number) => {
  if (score >= 70) return "bg-amber-500";
  if (score >= 40) return "bg-amber-400";
  return "bg-red-500";
};


const getStatusStyle = (status: string) => {
  const s = status.trim().toLowerCase();
  if (s === "completed") return "bg-amber-500/15 text-amber-400";
  if (s.includes("fail")) return "bg-red-500/15 text-red-400";
  return "bg-amber-500/15 text-amber-400";
};

const getMostFrequent = (arr: (string | null)[]): string => {
  const counts: Record<string, number> = {};
  for (const v of arr) {
    if (v) {
      counts[v] = (counts[v] || 0) + 1;
    }
  }
  let max = 0;
  let result = "—";
  for (const [key, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      result = key;
    }
  }
  return result;
};

const getDistinct = (arr: (string | null)[]): string[] => {
  const set = new Set<string>();
  for (const v of arr) {
    if (v && v.trim()) set.add(v.trim());
  }
  return Array.from(set).sort();
};

const PlanningMySaasOverview = () => {
  const [lpWizards, setLpWizards] = useState<LpWizardRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [reprocessingIds, setReprocessingIds] = useState<Set<string>>(new Set());
  const pollingIntervals = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Cleanup polling intervals on unmount
  useEffect(() => {
    return () => {
      pollingIntervals.current.forEach((interval) => clearInterval(interval));
      pollingIntervals.current.clear();
    };
  }, []);

  const handleReprocess = useCallback(async (card: MergedCard) => {
    const { reportId, wizardId } = card;

    // Add to reprocessing set
    setReprocessingIds((prev) => new Set(prev).add(reportId));

    // Update local status immediately
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "processing" } : r))
    );

    // Reset status in DB
    await supabase
      .from("tb_pms_reports")
      .update({ status: "processing" })
      .eq("id", reportId);

    // Call edge function with existing wizard_id (no new record created)
    await supabase.functions.invoke("pms-orchestrate-lp-report", {
      body: { wizard_id: wizardId },
    });

    // Start polling every 5s
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("tb_pms_reports")
        .select("status, hero_score_section, summary_section")
        .eq("id", reportId)
        .single();

      if (data) {
        const st = data.status.trim().toLowerCase();
        if (st === "completed" || st.includes("fail")) {
          clearInterval(interval);
          pollingIntervals.current.delete(reportId);
          setReprocessingIds((prev) => {
            const next = new Set(prev);
            next.delete(reportId);
            return next;
          });
          setReports((prev) =>
            prev.map((r) =>
              r.id === reportId
                ? { ...r, status: data.status, hero_score_section: data.hero_score_section, summary_section: data.summary_section }
                : r
            )
          );
        }
      }
    }, 5000);

    pollingIntervals.current.set(reportId, interval);

    // Safety timeout: stop polling after 5 minutes
    setTimeout(() => {
      if (pollingIntervals.current.has(reportId)) {
        clearInterval(pollingIntervals.current.get(reportId)!);
        pollingIntervals.current.delete(reportId);
        setReprocessingIds((prev) => {
          const next = new Set(prev);
          next.delete(reportId);
          return next;
        });
      }
    }, 5 * 60 * 1000);
  }, []);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [reportRes, lpRes] = await Promise.all([
        supabase.from("tb_pms_reports").select("id, wizard_id, status, hero_score_section, summary_section, created_at").order("created_at", { ascending: false }),
        supabase.from("tb_pms_lp_wizard").select("id, full_name, email, phone, country, geographic_region, industry, industry_other, ideal_business_model, saas_name"),
      ]);
      setReports(reportRes.data || []);
      setLpWizards(lpRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const cards: MergedCard[] = useMemo(() => {
    const lpMap = new Map<string, LpWizardRow>();
    for (const w of lpWizards) lpMap.set(w.id, w);

    return reports
      .filter((r) => lpMap.has(r.wizard_id))
      .map((r) => {
        const w = lpMap.get(r.wizard_id)!;
        const score = r.hero_score_section?.overall_score ?? r.hero_score_section?.score ?? null;
        const verdict = r.summary_section?.verdict ?? r.hero_score_section?.verdict ?? null;
        const industry = w.industry_other || w.industry;
        return {
          reportId: r.id,
          wizardId: w.id,
          saasName: w.saas_name,
          fullName: w.full_name,
          email: w.email,
          phone: w.phone,
          country: w.country,
          region: w.geographic_region,
          industry,
          businessModel: w.ideal_business_model,
          status: r.status,
          score: typeof score === "number" ? score : null,
          verdict: typeof verdict === "string" ? verdict : null,
          createdAt: r.created_at,
        };
      });
  }, [reports, lpWizards]);

  // Filter options
  const filterOptions = useMemo(() => ({
    countries: getDistinct(cards.map((c) => c.country)),
    regions: getDistinct(cards.map((c) => c.region)),
    industries: getDistinct(cards.map((c) => c.industry)),
    models: getDistinct(cards.map((c) => c.businessModel)),
  }), [cards]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || c.fullName.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || (c.saasName?.toLowerCase().includes(s) ?? false);
      const matchStatus = statusFilter === "all" || (() => {
        const st = c.status.trim().toLowerCase();
        if (statusFilter === "completed") return st === "completed";
        if (statusFilter === "failed") return st.includes("fail");
        if (statusFilter === "pending") return st !== "completed" && !st.includes("fail");
        return true;
      })();
      const matchCountry = countryFilter === "all" || c.country === countryFilter;
      const matchRegion = regionFilter === "all" || c.region === regionFilter;
      const matchIndustry = industryFilter === "all" || c.industry === industryFilter;
      const matchModel = modelFilter === "all" || c.businessModel === modelFilter;
      return matchSearch && matchStatus && matchCountry && matchRegion && matchIndustry && matchModel;
    });
  }, [cards, searchTerm, statusFilter, countryFilter, regionFilter, industryFilter, modelFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, countryFilter, regionFilter, industryFilter, modelFilter]);

  // Stats
  const stats = useMemo(() => {
    const completed = cards.filter((c) => c.status.trim().toLowerCase() === "completed");
    const scores = completed.map((c) => c.score).filter((s): s is number => s !== null);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const topIndustry = getMostFrequent(completed.map((c) => c.industry));
    const topRegion = getMostFrequent(completed.map((c) => c.region));
    return [
      { label: "Total Reports", value: String(completed.length), icon: FileText },
      { label: "Avg. Score", value: scores.length ? `${avgScore}%` : "—", icon: BarChart3 },
      { label: "Top Industry", value: topIndustry, icon: Building2 },
      { label: "Top Region", value: topRegion, icon: Globe },
    ];
  }, [cards]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const hasFilters = searchTerm || statusFilter !== "all" || countryFilter !== "all" || regionFilter !== "all" || industryFilter !== "all" || modelFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCountryFilter("all");
    setRegionFilter("all");
    setIndustryFilter("all");
    setModelFilter("all");
  };

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
              <p className="text-2xl font-bold text-white font-mono truncate" title={s.value}>{s.value}</p>
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
            placeholder="Search name, email or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
        {filterOptions.countries.length > 0 && (
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[140px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
              <SelectItem value="all">All Countries</SelectItem>
              {filterOptions.countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {filterOptions.regions.length > 0 && (
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[140px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
              <SelectItem value="all">All Regions</SelectItem>
              {filterOptions.regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {filterOptions.industries.length > 0 && (
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
              <SelectItem value="all">All Industries</SelectItem>
              {filterOptions.industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {filterOptions.models.length > 0 && (
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-[140px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
              <SelectItem value="all">All Models</SelectItem>
              {filterOptions.models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
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
          onClick={clearFilters}
          disabled={!hasFilters}
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
        <div className="rounded-xl border border-white/[0.06] overflow-x-auto overflow-y-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">SaaS Name</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Name</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Email</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Country / Region</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Industry</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Model</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Score</th>
                
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Status</th>
                <th className="text-left px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Date</th>
                <th className="text-center px-3 py-2.5 text-white/40 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((card) => (
                <tr key={card.reportId} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] transition-colors">
                  <td className="px-3 py-2.5 text-white font-medium truncate max-w-[140px]" title={card.saasName || "—"}>{card.saasName || "—"}</td>
                  <td className="px-3 py-2.5 text-white/70 truncate max-w-[120px]" title={card.fullName}>{card.fullName}</td>
                  <td className="px-3 py-2.5 text-white/50 truncate max-w-[160px]" title={card.email}>{card.email}</td>
                  <td className="px-3 py-2.5 text-white/50 whitespace-nowrap">{[card.country, card.region].filter(Boolean).join(" / ") || "—"}</td>
                  <td className="px-3 py-2.5 text-white/50 truncate max-w-[120px]" title={card.industry || "—"}>{card.industry || "—"}</td>
                  <td className="px-3 py-2.5 text-white/50 truncate max-w-[100px]" title={card.businessModel || "—"}>{card.businessModel || "—"}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {card.score !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono font-bold">{card.score}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className={`h-full rounded-full ${getScoreColor(card.score)}`} style={{ width: `${card.score}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge className={`text-[10px] ${getStatusStyle(card.status)}`}>
                      {card.status.trim().toLowerCase() === "completed" ? "Completed" : card.status.toLowerCase().includes("fail") ? "Failed" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-white/30 whitespace-nowrap">{formatDate(card.createdAt)}</td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {card.status.trim().toLowerCase() === "completed" && (
                        <button
                          onClick={() => window.open(`/hero/report/${card.reportId}`, '_blank')}
                          title="View report"
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-amber-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {reprocessingIds.has(card.reportId) ? (
                        <button disabled className="p-1.5 rounded-lg text-amber-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        </button>
                      ) : card.status.trim().toLowerCase().includes("fail") ? (
                        <button
                          onClick={() => handleReprocess(card)}
                          title="Reprocess report"
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-amber-400 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button disabled className="p-1.5 rounded-lg text-white/10">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
