// Reports Storage - Utility functions for managing reports in localStorage

export interface StoredReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  planType: "starter" | "pro" | "enterprise";
  wizardData: {
    fullName: string;
    email: string;
    companyName: string;
    phone: string;
    saasType: string;
    saasTypeOther: string;
    industry: string;
    industryOther: string;
    description: string;
    customerTypes: string[];
    marketSize: string;
    selectedFeatures: string[];
    selectedTier: string;
    goal: string;
    budget: string;
    timeline: string;
  };
  reportData: {
    projectName: string;
    viabilityScore: number;
    complexityScore: number;
  };
}

const STORAGE_KEY = "pms-reports";

export const getReports = (): StoredReport[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading reports:", e);
  }
  return [];
};

export const getReportById = (id: string): StoredReport | null => {
  const reports = getReports();
  return reports.find((r) => r.id === id) || null;
};

export const saveReport = (report: StoredReport): void => {
  const reports = getReports();
  const existingIndex = reports.findIndex((r) => r.id === report.id);
  
  if (existingIndex >= 0) {
    reports[existingIndex] = { ...report, updatedAt: new Date().toISOString() };
  } else {
    reports.unshift(report);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const deleteReport = (id: string): void => {
  const reports = getReports();
  const filtered = reports.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const generateReportId = (): string => {
  return crypto.randomUUID();
};

// Helper to get display name from wizard data
export const getProjectDisplayName = (report: StoredReport): string => {
  if (report.reportData?.projectName) {
    return report.reportData.projectName;
  }
  // Fallback: generate name from saasType or description
  const saasType = report.wizardData.saasType === "other" 
    ? report.wizardData.saasTypeOther 
    : report.wizardData.saasType;
  return saasType || "Untitled Project";
};

// Helper to get industry display name
export const getIndustryDisplayName = (report: StoredReport): string => {
  return report.wizardData.industry === "other"
    ? report.wizardData.industryOther
    : report.wizardData.industry;
};
