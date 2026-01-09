import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roiData, breakEvenData, mrrEvolutionData } from "@/lib/dashboardMockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, ReferenceLine } from "recharts";

const ROICharts = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-accent/10"><TrendingUp className="h-5 w-5 text-accent" /></div>
      <div><h2 className="text-lg font-semibold text-foreground">ROI & Growth Analysis</h2><p className="text-sm text-muted-foreground">Financial projections and break-even analysis</p></div>
    </div>
    <Card className="bg-card/50 border-border/50">
      <CardHeader><CardTitle className="text-lg">ROI Estimate (12 Months)</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={roiData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="month" stroke="#888" /><YAxis stroke="#888" /><Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} /><ReferenceLine y={0} stroke="#666" /><Area type="monotone" dataKey="cumulative" stroke="#FFD700" fill="#FFD700" fillOpacity={0.2} name="Cumulative P&L" /></AreaChart></ResponsiveContainer></div>
      </CardContent>
    </Card>
    <Card className="bg-card/50 border-border/50">
      <CardHeader><CardTitle className="text-lg">Break-Even Analysis</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={breakEvenData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="month" stroke="#888" /><YAxis stroke="#888" /><Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} formatter={(v) => `$${v.toLocaleString()}`} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" /><Line type="monotone" dataKey="costs" stroke="#EF4444" strokeWidth={2} name="Costs" /></LineChart></ResponsiveContainer></div>
        <p className="text-sm text-muted-foreground text-center mt-4">Break-even projected at month 9 with ~450 customers</p>
      </CardContent>
    </Card>
    <Card className="bg-card/50 border-border/50">
      <CardHeader><CardTitle className="text-lg">3-Year MRR Evolution</CardTitle></CardHeader>
      <CardContent>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={mrrEvolutionData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="month" stroke="#888" angle={-45} textAnchor="end" height={60} /><YAxis stroke="#888" /><Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }} formatter={(v) => `$${v.toLocaleString()}`} /><Legend /><Bar dataKey="mrr" fill="#FFD700" name="MRR" /><Bar dataKey="customers" fill="#3B82F6" name="Customers" /></BarChart></ResponsiveContainer></div>
      </CardContent>
    </Card>
  </div>
);

export default ROICharts;
