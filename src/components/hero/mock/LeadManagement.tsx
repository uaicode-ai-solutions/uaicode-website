import { useState, useEffect, useMemo } from "react";
import { Search, Eye, Download, UserCheck, Loader2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Lead = Tables<"tb_crm_leads">;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const DetailRow = ({ label, value, href }: { label: string; value: string | number | null; href?: string }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-white/40">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
          {String(value)} <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <span className="text-xs text-white/80 text-right max-w-[60%] truncate">{String(value)}</span>
      )}
    </div>
  );
};

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("tb_crm_leads")
        .select("*")
        .order("created_at", { ascending: false });
      setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const sources = useMemo(() => [...new Set(leads.map((l) => l.source).filter(Boolean))].sort(), [leads]);
  const countries = useMemo(() => [...new Set(leads.map((l) => l.country).filter(Boolean))].sort(), [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || (l.full_name?.toLowerCase().includes(s) || l.email?.toLowerCase().includes(s));
      const matchSource = sourceFilter === "all" || l.source === sourceFilter;
      const matchCountry = countryFilter === "all" || l.country === countryFilter;
      return matchSearch && matchSource && matchCountry;
    });
  }, [leads, searchTerm, sourceFilter, countryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sourceFilter, countryFilter]);

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Company", "Job Title", "Country", "Source", "Phone", "LinkedIn", "Created"];
    const rows = filtered.map((l) => [
      l.full_name, l.email, l.company_name, l.job_title, l.country, l.source, l.phone, l.linkedin_profile, l.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">
          Lead Management
          {!loading && <span className="ml-2 text-sm font-normal text-white/40">({filtered.length})</span>}
        </h2>
        <button
          onClick={downloadCSV}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm text-white/70 hover:bg-white/[0.10] hover:text-white transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((s) => (
              <SelectItem key={s} value={s!}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.06] text-white/70 text-sm">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c!}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[18%]">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[22%]">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[15%]">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[17%]">Job Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[10%]">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[12%]">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 w-[6%]"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={7} className="px-4 py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white/30 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white/20" />
                      </div>
                      <p className="text-sm text-white/40">No leads found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm text-white/80 truncate" title={lead.full_name || ""}>{lead.full_name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/60 truncate" title={lead.email || ""}>{lead.email || "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/60 truncate" title={lead.company_name || ""}>{lead.company_name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/60 truncate" title={lead.job_title || ""}>{lead.job_title || "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{lead.country || "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-white/80 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
            <span className="text-xs text-white/50">
              {currentPage} / {totalPages}
            </span>
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="bg-[#12121f] border-white/[0.08] text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              {selectedLead?.full_name || "Lead Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-5 mt-2">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-2">Contact</h4>
                <div className="rounded-lg bg-white/[0.03] p-3 space-y-0.5">
                  <DetailRow label="Email" value={selectedLead.email} />
                  <DetailRow label="Phone" value={selectedLead.phone} />
                  <DetailRow label="LinkedIn" value={selectedLead.linkedin_profile} href={selectedLead.linkedin_profile || undefined} />
                  <DetailRow label="Facebook" value={selectedLead.facebook_url} href={selectedLead.facebook_url || undefined} />
                  <DetailRow label="Twitter" value={selectedLead.twitter_url} href={selectedLead.twitter_url || undefined} />
                  <DetailRow label="GitHub" value={selectedLead.github_url} href={selectedLead.github_url || undefined} />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-2">Company</h4>
                <div className="rounded-lg bg-white/[0.03] p-3 space-y-0.5">
                  <DetailRow label="Name" value={selectedLead.company_name} />
                  <DetailRow label="Website" value={selectedLead.company_website} href={selectedLead.company_website || undefined} />
                  <DetailRow label="Industry" value={selectedLead.industry} />
                  <DetailRow label="Size" value={selectedLead.company_size} />
                  <DetailRow label="Revenue" value={selectedLead.company_revenue} />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-2">Location</h4>
                <div className="rounded-lg bg-white/[0.03] p-3 space-y-0.5">
                  <DetailRow label="City" value={selectedLead.city} />
                  <DetailRow label="State" value={selectedLead.state} />
                  <DetailRow label="Country" value={selectedLead.country} />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-2">Role</h4>
                <div className="rounded-lg bg-white/[0.03] p-3 space-y-0.5">
                  <DetailRow label="Job Title" value={selectedLead.job_title} />
                  <DetailRow label="Seniority" value={selectedLead.seniority} />
                  <DetailRow label="Departments" value={selectedLead.departments} />
                  <DetailRow label="Source" value={selectedLead.source} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
