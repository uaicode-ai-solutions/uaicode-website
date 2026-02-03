import jsPDF from "jspdf";
import { BusinessPlanSection } from "@/types/report";

// ==========================================
// Brand Colors (UaiCode Premium)
// ==========================================
const COLORS = {
  gold: [245, 158, 11] as [number, number, number],       // #F59E0B - Accent
  darkGray: [35, 39, 41] as [number, number, number],     // #232729 - Headings
  textLight: [60, 60, 60] as [number, number, number],    // #3C3C3C - Body text
  muted: [100, 100, 100] as [number, number, number],     // #646464 - Footer
  green: [34, 197, 94] as [number, number, number],       // #22C55E - Viability High
  yellow: [234, 179, 8] as [number, number, number],      // #EAB308 - Viability Medium
  red: [239, 68, 68] as [number, number, number],         // #EF4444 - Viability Low
  white: [255, 255, 255] as [number, number, number],
  lightGray: [245, 245, 245] as [number, number, number], // Table backgrounds
};

// ==========================================
// PDF Configuration
// ==========================================
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const FOOTER_HEIGHT = 15;
const LINE_HEIGHT = 7;

// ==========================================
// Helper Functions
// ==========================================

const getViabilityColor = (score: number): [number, number, number] => {
  if (score >= 80) return COLORS.green;
  if (score >= 60) return COLORS.yellow;
  return COLORS.red;
};

const sanitizeTextForPDF = (text: string): string => {
  return text
    // Remove emojis and Unicode symbols
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    // Replace special characters with ASCII equivalents
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[•·]/g, "-")
    .replace(/[→←↑↓]/g, "->")
    .replace(/[✓✔]/g, "[x]")
    .replace(/[✗✘]/g, "[_]")
    .replace(/[★☆]/g, "*")
    .replace(/©/g, "(c)")
    .replace(/®/g, "(R)")
    .replace(/™/g, "(TM)")
    .replace(/°/g, " deg")
    .replace(/[^\x00-\x7F]/g, "");
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "_");
};

// ==========================================
// Page Management
// ==========================================

const addPageFooter = (pdf: jsPDF, pageNumber: number): void => {
  const y = PAGE_HEIGHT - 10;
  
  pdf.setDrawColor(...COLORS.lightGray);
  pdf.setLineWidth(0.2);
  pdf.line(MARGIN, y - 5, PAGE_WIDTH - MARGIN, y - 5);
  
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.muted);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Page ${pageNumber}`, MARGIN, y);
  pdf.text("uaicode.ai | PlanningMySaaS", PAGE_WIDTH - MARGIN, y, { align: "right" });
};

const checkPageBreak = (
  pdf: jsPDF,
  currentY: number,
  requiredHeight: number,
  pageNumber: { value: number }
): number => {
  if (currentY + requiredHeight > PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT) {
    addPageFooter(pdf, pageNumber.value);
    pdf.addPage();
    pageNumber.value++;
    return MARGIN + 10;
  }
  return currentY;
};

// ==========================================
// Section Renderers
// ==========================================

const renderCoverPage = (
  pdf: jsPDF,
  businessPlan: BusinessPlanSection,
  projectName: string,
  pageNumber: { value: number }
): void => {
  let y = 60;

  // Title: "BUSINESS PLAN"
  pdf.setFontSize(32);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLORS.gold);
  pdf.text("BUSINESS PLAN", PAGE_WIDTH / 2, y, { align: "center" });
  y += 20;

  // Project Title
  pdf.setFontSize(24);
  pdf.setTextColor(...COLORS.darkGray);
  const sanitizedTitle = sanitizeTextForPDF(businessPlan.title || projectName);
  const titleLines = pdf.splitTextToSize(sanitizedTitle, CONTENT_WIDTH);
  titleLines.forEach((line: string) => {
    pdf.text(line, PAGE_WIDTH / 2, y, { align: "center" });
    y += 12;
  });
  y += 15;

  // Viability Score Badge
  const viabilityColor = getViabilityColor(businessPlan.viability_score || 0);
  const badgeWidth = 120;
  const badgeHeight = 20;
  const badgeX = (PAGE_WIDTH - badgeWidth) / 2;

  pdf.setFillColor(...viabilityColor);
  pdf.roundedRect(badgeX, y - 5, badgeWidth, badgeHeight, 4, 4, "F");

  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.white);
  pdf.setFont("helvetica", "bold");
  const sanitizedLabel = sanitizeTextForPDF(businessPlan.viability_label || "Unknown");
  pdf.text(
    `Viability Score: ${businessPlan.viability_score || 0}/100 - ${sanitizedLabel}`,
    PAGE_WIDTH / 2,
    y + 7,
    { align: "center" }
  );
  y += 35;

  // Subtitle
  if (businessPlan.subtitle) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLORS.textLight);
    const sanitizedSubtitle = sanitizeTextForPDF(businessPlan.subtitle);
    const subtitleLines = pdf.splitTextToSize(sanitizedSubtitle, CONTENT_WIDTH - 20);
    subtitleLines.forEach((line: string) => {
      pdf.text(line, PAGE_WIDTH / 2, y, { align: "center" });
      y += 7;
    });
  }
  y += 20;

  // Metadata
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.muted);
  pdf.text(
    `Generated: ${formatDate(businessPlan.generated_at || new Date().toISOString())}`,
    PAGE_WIDTH / 2,
    y,
    { align: "center" }
  );

  addPageFooter(pdf, pageNumber.value);
};

const renderExecutiveSummary = (
  pdf: jsPDF,
  businessPlan: BusinessPlanSection,
  startY: number,
  pageNumber: { value: number }
): number => {
  let y = startY;

  // Section Title
  y = checkPageBreak(pdf, y, 30, pageNumber);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLORS.gold);
  pdf.text("Executive Summary", MARGIN, y);
  y += 15;

  // Executive Narrative
  if (businessPlan.ai_executive_narrative) {
    const sanitizedNarrative = sanitizeTextForPDF(businessPlan.ai_executive_narrative);
    const narrativeLines = pdf.splitTextToSize(sanitizedNarrative, CONTENT_WIDTH);
    
    y = checkPageBreak(pdf, y, narrativeLines.length * LINE_HEIGHT, pageNumber);
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLORS.textLight);
    
    narrativeLines.forEach((line: string) => {
      y = checkPageBreak(pdf, y, LINE_HEIGHT, pageNumber);
      pdf.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    });
  }
  y += 10;

  // Section Insights (if available)
  const insights = businessPlan.ai_section_insights;
  if (insights) {
    y = checkPageBreak(pdf, y, 40, pageNumber);
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLORS.darkGray);
    pdf.text("Key Insights", MARGIN, y);
    y += 10;

    const insightItems = [
      { label: "Market", value: insights.market_insight },
      { label: "Competition", value: insights.competition_insight },
      { label: "Customer", value: insights.customer_insight },
      { label: "Financial", value: insights.financial_insight },
    ].filter(item => item.value);

    pdf.setFontSize(11);
    
    insightItems.forEach(({ label, value }) => {
      if (value) {
        const sanitizedValue = sanitizeTextForPDF(value);
        const lines = pdf.splitTextToSize(`${label}: ${sanitizedValue}`, CONTENT_WIDTH - 10);
        
        y = checkPageBreak(pdf, y, lines.length * LINE_HEIGHT + 5, pageNumber);
        
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.darkGray);
        pdf.text("-", MARGIN, y);
        
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.textLight);
        lines.forEach((line: string, idx: number) => {
          pdf.text(line, MARGIN + 8, y + (idx * LINE_HEIGHT));
        });
        y += lines.length * LINE_HEIGHT + 3;
      }
    });
  }

  return y + 10;
};

const renderStrategicVerdict = (
  pdf: jsPDF,
  businessPlan: BusinessPlanSection,
  startY: number,
  pageNumber: { value: number }
): number => {
  let y = startY;

  if (!businessPlan.ai_strategic_verdict) return y;

  // Section Title
  y = checkPageBreak(pdf, y, 30, pageNumber);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLORS.gold);
  pdf.text("Strategic Verdict", MARGIN, y);
  y += 15;

  // Verdict Content
  const sanitizedVerdict = sanitizeTextForPDF(businessPlan.ai_strategic_verdict);
  const verdictLines = pdf.splitTextToSize(sanitizedVerdict, CONTENT_WIDTH);
  
  y = checkPageBreak(pdf, y, verdictLines.length * LINE_HEIGHT + 10, pageNumber);
  
  // Draw verdict box background
  const boxHeight = verdictLines.length * LINE_HEIGHT + 15;
  pdf.setFillColor(...COLORS.lightGray);
  pdf.roundedRect(MARGIN, y - 5, CONTENT_WIDTH, boxHeight, 3, 3, "F");
  
  // Draw left accent bar
  const viabilityColor = getViabilityColor(businessPlan.viability_score || 0);
  pdf.setFillColor(...viabilityColor);
  pdf.rect(MARGIN, y - 5, 4, boxHeight, "F");
  
  y += 5;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLORS.textLight);
  
  verdictLines.forEach((line: string) => {
    pdf.text(line, MARGIN + 12, y);
    y += LINE_HEIGHT;
  });

  return y + 15;
};

const renderNextSteps = (
  pdf: jsPDF,
  businessPlan: BusinessPlanSection,
  startY: number,
  pageNumber: { value: number }
): number => {
  let y = startY;

  const recommendations = businessPlan.ai_key_recommendations;
  if (!recommendations || recommendations.length === 0) return y;

  // Section Title
  y = checkPageBreak(pdf, y, 30, pageNumber);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLORS.gold);
  pdf.text("Recommended Next Steps", MARGIN, y);
  y += 15;

  // Numbered list of recommendations
  recommendations.forEach((recommendation, index) => {
    const sanitizedRec = sanitizeTextForPDF(recommendation);
    const recLines = pdf.splitTextToSize(sanitizedRec, CONTENT_WIDTH - 15);
    
    y = checkPageBreak(pdf, y, recLines.length * LINE_HEIGHT + 5, pageNumber);
    
    // Number badge
    pdf.setFillColor(...COLORS.gold);
    pdf.circle(MARGIN + 4, y - 2, 4, "F");
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLORS.white);
    pdf.text(`${index + 1}`, MARGIN + 2.5, y);
    
    // Recommendation text
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLORS.textLight);
    
    recLines.forEach((line: string, lineIdx: number) => {
      pdf.text(line, MARGIN + 15, y + (lineIdx * LINE_HEIGHT));
    });
    
    y += recLines.length * LINE_HEIGHT + 8;
  });

  return y;
};

// ==========================================
// Main Export Function
// ==========================================

export interface PDFExportResult {
  success: boolean;
  error?: string;
}

export const generateBusinessPlanPDF = async (
  businessPlan: BusinessPlanSection,
  projectName: string
): Promise<PDFExportResult> => {
  try {
    // Validate required content
    const hasContent = 
      businessPlan.ai_executive_narrative || 
      businessPlan.ai_strategic_verdict || 
      (businessPlan.ai_key_recommendations && businessPlan.ai_key_recommendations.length > 0);

    if (!hasContent) {
      return {
        success: false,
        error: "No business plan content available for export",
      };
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set PDF metadata
    pdf.setProperties({
      title: `Business Plan: ${projectName}`,
      subject: "SaaS Business Plan Document",
      author: "UAICode - PlanningMySaaS",
      keywords: "Business Plan, SaaS, Startup, Market Analysis",
      creator: "PlanningMySaaS by UAICode",
    });

    const pageNumber = { value: 1 };

    // ========================================
    // PAGE 1: COVER
    // ========================================
    renderCoverPage(pdf, businessPlan, projectName, pageNumber);

    // ========================================
    // PAGE 2+: CONTENT
    // ========================================
    pdf.addPage();
    pageNumber.value++;
    let y = MARGIN + 10;

    // Executive Summary
    y = renderExecutiveSummary(pdf, businessPlan, y, pageNumber);

    // Strategic Verdict
    y = renderStrategicVerdict(pdf, businessPlan, y, pageNumber);

    // Next Steps
    y = renderNextSteps(pdf, businessPlan, y, pageNumber);

    // Final page footer
    addPageFooter(pdf, pageNumber.value);

    // ========================================
    // Save PDF
    // ========================================
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `BusinessPlan_${sanitizeFilename(projectName)}_${timestamp}.pdf`;
    pdf.save(filename);

    return { success: true };
  } catch (error) {
    console.error("PDF generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred while generating the PDF",
    };
  }
};

export default generateBusinessPlanPDF;
