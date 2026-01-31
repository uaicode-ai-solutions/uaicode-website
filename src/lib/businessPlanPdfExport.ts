import jsPDF from "jspdf";
import { BusinessPlanSection, BusinessPlanChartsData } from "@/types/report";

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
// Chart Data to Table Conversion
// ==========================================

const renderChartAsTable = (
  pdf: jsPDF,
  chartType: string,
  chartsData: BusinessPlanChartsData,
  startY: number
): number => {
  let yPos = startY;
  const tableStartX = MARGIN;
  const colWidth = CONTENT_WIDTH / 2;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...COLORS.gold);

  switch (chartType) {
    case "market_sizing": {
      const data = chartsData.market_sizing;
      if (!data) return yPos;

      pdf.text("Market Sizing", tableStartX, yPos);
      yPos += 8;

      // Table header
      pdf.setFillColor(...COLORS.lightGray);
      pdf.rect(tableStartX, yPos - 4, CONTENT_WIDTH, 8, "F");
      pdf.setTextColor(...COLORS.darkGray);
      pdf.text("Market", tableStartX + 5, yPos);
      pdf.text("Value", tableStartX + colWidth + 5, yPos);
      yPos += 8;

      // Table rows
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLORS.textLight);

      const rows = [
        ["Total Addressable Market (TAM)", data.tam],
        ["Serviceable Addressable Market (SAM)", data.sam],
        ["Serviceable Obtainable Market (SOM)", data.som],
      ];

      rows.forEach(([label, value]) => {
        pdf.text(label, tableStartX + 5, yPos);
        pdf.text(value || "—", tableStartX + colWidth + 5, yPos);
        yPos += LINE_HEIGHT;
      });

      yPos += 5;
      break;
    }

    case "financial_projections": {
      const data = chartsData.financial_projections;
      if (!data) return yPos;

      pdf.text("Financial Projections", tableStartX, yPos);
      yPos += 8;

      pdf.setFillColor(...COLORS.lightGray);
      pdf.rect(tableStartX, yPos - 4, CONTENT_WIDTH, 8, "F");
      pdf.setTextColor(...COLORS.darkGray);
      pdf.text("Period", tableStartX + 5, yPos);
      pdf.text("Revenue", tableStartX + colWidth + 5, yPos);
      yPos += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLORS.textLight);

      const rows = [
        ["Month 6 Monthly Recurring Revenue", data.month_6_mrr],
        ["Year 1 Annual Recurring Revenue", data.year_1_arr],
        ["Year 2 Annual Recurring Revenue", data.year_2_arr],
      ];

      rows.forEach(([label, value]) => {
        pdf.text(label, tableStartX + 5, yPos);
        pdf.text(value || "—", tableStartX + colWidth + 5, yPos);
        yPos += LINE_HEIGHT;
      });

      yPos += 5;
      break;
    }

    case "competitor_pricing": {
      const data = chartsData.competitor_pricing;
      if (!data || data.length === 0) return yPos;

      pdf.text("Competitor Pricing", tableStartX, yPos);
      yPos += 8;

      const col1 = CONTENT_WIDTH * 0.5;
      const col2 = CONTENT_WIDTH * 0.25;
      const col3 = CONTENT_WIDTH * 0.25;

      pdf.setFillColor(...COLORS.lightGray);
      pdf.rect(tableStartX, yPos - 4, CONTENT_WIDTH, 8, "F");
      pdf.setTextColor(...COLORS.darkGray);
      pdf.text("Competitor", tableStartX + 5, yPos);
      pdf.text("Min Price", tableStartX + col1 + 5, yPos);
      pdf.text("Max Price", tableStartX + col1 + col2 + 5, yPos);
      yPos += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLORS.textLight);

      data.forEach((competitor) => {
        pdf.text(competitor.name, tableStartX + 5, yPos);
        pdf.text(`$${competitor.min_price}`, tableStartX + col1 + 5, yPos);
        pdf.text(`$${competitor.max_price}`, tableStartX + col1 + col2 + 5, yPos);
        yPos += LINE_HEIGHT;
      });

      yPos += 5;
      break;
    }

    case "investment_breakdown": {
      const data = chartsData.investment_breakdown;
      if (!data || data.length === 0) return yPos;

      pdf.text("Investment Breakdown", tableStartX, yPos);
      yPos += 8;

      pdf.setFillColor(...COLORS.lightGray);
      pdf.rect(tableStartX, yPos - 4, CONTENT_WIDTH, 8, "F");
      pdf.setTextColor(...COLORS.darkGray);
      pdf.text("Category", tableStartX + 5, yPos);
      pdf.text("Amount", tableStartX + colWidth + 5, yPos);
      yPos += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...COLORS.textLight);

      data.forEach((item) => {
        pdf.text(item.category, tableStartX + 5, yPos);
        pdf.text(`$${item.amount.toLocaleString()}`, tableStartX + colWidth + 5, yPos);
        yPos += LINE_HEIGHT;
      });

      yPos += 5;
      break;
    }

    default:
      // Unknown chart type - skip
      break;
  }

  return yPos;
};

// ==========================================
// Markdown Parser for PDF
// ==========================================

interface ParsedLine {
  type: "h1" | "h2" | "h3" | "text" | "bullet" | "numbered" | "hr" | "quote" | "chart" | "empty";
  content: string;
  chartType?: string;
}

const parseMarkdownLine = (line: string): ParsedLine => {
  const trimmed = line.trim();

  if (trimmed === "") return { type: "empty", content: "" };
  if (trimmed === "---" || trimmed === "***") return { type: "hr", content: "" };

  // Check for chart placeholder
  const chartMatch = trimmed.match(/\[CHART:(\w+)\]/);
  if (chartMatch) return { type: "chart", content: "", chartType: chartMatch[1] };

  // Headings
  if (trimmed.startsWith("### ")) return { type: "h3", content: trimmed.slice(4) };
  if (trimmed.startsWith("## ")) return { type: "h2", content: trimmed.slice(3) };
  if (trimmed.startsWith("# ")) return { type: "h1", content: trimmed.slice(2) };

  // Lists
  if (trimmed.match(/^[-*]\s/)) return { type: "bullet", content: trimmed.slice(2) };
  if (trimmed.match(/^\d+\.\s/)) return { type: "numbered", content: trimmed.replace(/^\d+\.\s/, "") };

  // Blockquote
  if (trimmed.startsWith("> ")) return { type: "quote", content: trimmed.slice(2) };

  return { type: "text", content: trimmed };
};

const stripMarkdownFormatting = (text: string): string => {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1")     // Italic
    .replace(/`([^`]+)`/g, "$1")       // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // Links
};

// ==========================================
// PDF Generation
// ==========================================

const addPageFooter = (pdf: jsPDF, pageNumber: number): void => {
  const y = PAGE_HEIGHT - 10;
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.muted);
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

// Result type for error handling
export interface PDFExportResult {
  success: boolean;
  error?: string;
}

export const generateBusinessPlanPDF = async (
  businessPlan: BusinessPlanSection,
  projectName: string
): Promise<PDFExportResult> => {
  try {
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

  let pageNumber = { value: 1 };

  // ========================================
  // PAGE 1: COVER
  // ========================================
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
  const titleLines = pdf.splitTextToSize(businessPlan.title || projectName, CONTENT_WIDTH);
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
  pdf.text(
    `Viability Score: ${businessPlan.viability_score || 0}/100 — ${businessPlan.viability_label || "Unknown"}`,
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
    const subtitleLines = pdf.splitTextToSize(businessPlan.subtitle, CONTENT_WIDTH - 20);
    subtitleLines.forEach((line: string) => {
      pdf.text(line, PAGE_WIDTH / 2, y, { align: "center" });
      y += 7;
    });
  }
  y += 20;

  // Metadata
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.muted);
  pdf.text(`Generated: ${formatDate(businessPlan.generated_at || new Date().toISOString())}`, PAGE_WIDTH / 2, y, { align: "center" });
  y += 7;
  pdf.text(`Word Count: ${businessPlan.word_count?.toLocaleString() || "—"} words`, PAGE_WIDTH / 2, y, { align: "center" });

  // Footer on cover
  addPageFooter(pdf, pageNumber.value);

  // ========================================
  // PAGES 2+: CONTENT
  // ========================================
  pdf.addPage();
  pageNumber.value++;
  y = MARGIN + 10;

  const lines = (businessPlan.markdown_content || "").split("\n");

  for (const line of lines) {
    const parsed = parseMarkdownLine(line);

    switch (parsed.type) {
      case "empty":
        y += 4;
        break;

      case "hr":
        y = checkPageBreak(pdf, y, 10, pageNumber);
        pdf.setDrawColor(...COLORS.muted);
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y += 8;
        break;

      case "h1":
        y = checkPageBreak(pdf, y, 20, pageNumber);
        y += 8;
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.gold);
        pdf.text(stripMarkdownFormatting(parsed.content), MARGIN, y);
        y += 12;
        break;

      case "h2":
        y = checkPageBreak(pdf, y, 18, pageNumber);
        y += 6;
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.darkGray);
        pdf.text(stripMarkdownFormatting(parsed.content), MARGIN, y);
        y += 10;
        break;

      case "h3":
        y = checkPageBreak(pdf, y, 14, pageNumber);
        y += 4;
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...COLORS.darkGray);
        pdf.text(stripMarkdownFormatting(parsed.content), MARGIN, y);
        y += 8;
        break;

      case "bullet": {
        const bulletText = stripMarkdownFormatting(parsed.content);
        const bulletLines = pdf.splitTextToSize(bulletText, CONTENT_WIDTH - 10);
        y = checkPageBreak(pdf, y, bulletLines.length * LINE_HEIGHT, pageNumber);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.textLight);
        pdf.text("•", MARGIN, y);
        bulletLines.forEach((bLine: string, idx: number) => {
          pdf.text(bLine, MARGIN + 8, y + (idx * LINE_HEIGHT));
        });
        y += bulletLines.length * LINE_HEIGHT;
        break;
      }

      case "numbered": {
        const numText = stripMarkdownFormatting(parsed.content);
        const numLines = pdf.splitTextToSize(numText, CONTENT_WIDTH - 10);
        y = checkPageBreak(pdf, y, numLines.length * LINE_HEIGHT, pageNumber);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.textLight);
        numLines.forEach((nLine: string, idx: number) => {
          pdf.text(nLine, MARGIN + 8, y + (idx * LINE_HEIGHT));
        });
        y += numLines.length * LINE_HEIGHT;
        break;
      }

      case "quote": {
        const quoteText = stripMarkdownFormatting(parsed.content);
        const quoteLines = pdf.splitTextToSize(quoteText, CONTENT_WIDTH - 15);
        y = checkPageBreak(pdf, y, quoteLines.length * LINE_HEIGHT + 8, pageNumber);
        
        // Gray bar on left
        pdf.setFillColor(...COLORS.lightGray);
        pdf.rect(MARGIN, y - 3, 3, quoteLines.length * LINE_HEIGHT + 6, "F");
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(...COLORS.muted);
        quoteLines.forEach((qLine: string, idx: number) => {
          pdf.text(qLine, MARGIN + 10, y + (idx * LINE_HEIGHT));
        });
        y += quoteLines.length * LINE_HEIGHT + 5;
        break;
      }

      case "chart":
        if (parsed.chartType && businessPlan.charts_data) {
          y = checkPageBreak(pdf, y, 50, pageNumber);
          y += 5;
          y = renderChartAsTable(pdf, parsed.chartType, businessPlan.charts_data, y);
        }
        break;

      case "text":
      default: {
        const textContent = stripMarkdownFormatting(parsed.content);
        const textLines = pdf.splitTextToSize(textContent, CONTENT_WIDTH);
        y = checkPageBreak(pdf, y, textLines.length * LINE_HEIGHT, pageNumber);
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.textLight);
        textLines.forEach((tLine: string, idx: number) => {
          pdf.text(tLine, MARGIN, y + (idx * LINE_HEIGHT));
        });
        y += textLines.length * LINE_HEIGHT;
        break;
      }
    }
  }

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
