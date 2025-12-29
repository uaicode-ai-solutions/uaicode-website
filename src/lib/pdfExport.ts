import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// UAICode Brand Colors (converted from HSL to RGB)
const BRAND_COLORS = {
  gold: [255, 204, 0] as [number, number, number],      // HSL(45, 100%, 55%) - Main brand gold
  goldDark: [230, 184, 0] as [number, number, number],  // Darker gold variant
  black: [20, 20, 20] as [number, number, number],      // Brand black
  darkGray: [35, 39, 42] as [number, number, number],   // Dark gray
  white: [255, 255, 255] as [number, number, number],
  textDark: [26, 26, 26] as [number, number, number],
  textMuted: [100, 100, 100] as [number, number, number],
  textLight: [60, 60, 60] as [number, number, number],
};

interface PDFData {
  // Inputs
  expectedUsers: number;
  pricePerUser: number;
  marketValidation: number;
  mvpTier: string;
  timeToMarket: number;
  
  // Calculated values
  adoptionRate: number;
  timeBonus: number;
  monthlyRevenue: number;
  sixMonthRevenue: number;
  twelveMonthRevenue: number;
  investmentCost: number;
  breakEvenMonths: number;
  roi12Month: number;
  costPerDayDelay: number;
  urgencyMultiplier: number;
  
  // Tier info
  tierInfo: {
    name: string;
    cost: string;
    timeline: string;
    min: number;
    max: number;
  };
  
  // Chart
  chartImageData: string | null;
  
  // Logo
  logoImageData?: string | null;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

export const generateROIPDF = async (data: PDFData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: true,
  });

  // Set PDF metadata
  pdf.setProperties({
    title: 'ROI Analysis Report',
    subject: 'SaaS MVP Investment Projection',
    author: 'UAICode',
    keywords: 'ROI, SaaS, MVP, Investment, Analysis',
    creator: 'UAICode ROI Calculator',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  let pageNumber = 1;

  // Helper function to add page footer
  const addPageFooter = (page: number) => {
    pdf.setFontSize(9);
    pdf.setTextColor(...BRAND_COLORS.textMuted);
    pdf.text(`Page ${page}`, margin, pageHeight - 30);
    pdf.text('uaicode.ai', pageWidth - margin - 70, pageHeight - 30);
    pdf.text('+1 321 529 1451', pageWidth / 2 - 40, pageHeight - 30);
  };

  // Helper function to add new page
  const addNewPage = () => {
    addPageFooter(pageNumber);
    pdf.addPage();
    pageNumber++;
    yPosition = margin;
  };

  // ========== PAGE 1: EXECUTIVE SUMMARY ==========
  
  // Add logo at top-left
  if (data.logoImageData) {
    try {
      const logoSize = 40; // square logo
      pdf.addImage(data.logoImageData, 'PNG', margin, yPosition, logoSize, logoSize);
      yPosition += logoSize + 10;
    } catch (error) {
      console.error('Failed to add logo to PDF:', error);
    }
  }
  
  // Header with date
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.black);
  pdf.text('ROI ANALYSIS REPORT', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 30;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  pdf.text(`Generated: ${reportDate}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 50;

  // Key Metrics Dashboard (3 cards across)
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('Executive Summary', margin, yPosition);
  
  yPosition += 30;

  const cardWidth = (contentWidth - 20) / 3;
  const cardHeight = 80;
  const cardSpacing = 10;

  // Card 1: 12-Month ROI
  pdf.setFillColor(...BRAND_COLORS.darkGray);
  pdf.roundedRect(margin, yPosition, cardWidth, cardHeight, 5, 5, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text('12-Month ROI', margin + 10, yPosition + 20);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text(`${formatNumber(data.roi12Month)}%`, margin + 10, yPosition + 50);

  // Card 2: Break-Even Timeline
  pdf.setFillColor(...BRAND_COLORS.darkGray);
  pdf.roundedRect(margin + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, 5, 5, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text('Break-Even', margin + cardWidth + cardSpacing + 10, yPosition + 20);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text(`${formatNumber(data.breakEvenMonths)} mo`, margin + cardWidth + cardSpacing + 10, yPosition + 50);

  // Card 3: Monthly Revenue
  pdf.setFillColor(...BRAND_COLORS.darkGray);
  pdf.roundedRect(margin + (cardWidth + cardSpacing) * 2, yPosition, cardWidth, cardHeight, 5, 5, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text('Monthly Revenue', margin + (cardWidth + cardSpacing) * 2 + 10, yPosition + 20);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text(formatCurrency(data.monthlyRevenue), margin + (cardWidth + cardSpacing) * 2 + 10, yPosition + 50);

  yPosition += cardHeight + 30;

  // Additional Metrics (2 cards)
  // Card 4: Development Investment
  pdf.setFillColor(...BRAND_COLORS.darkGray);
  pdf.roundedRect(margin, yPosition, cardWidth * 1.5 + cardSpacing / 2, cardHeight, 5, 5, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text('Development Investment', margin + 10, yPosition + 20);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text(formatCurrency(data.investmentCost), margin + 10, yPosition + 50);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text(`${data.tierInfo.name} Tier`, margin + 10, yPosition + 68);

  // Card 5: Cost per Day of Delay
  pdf.setFillColor(...BRAND_COLORS.darkGray);
  pdf.roundedRect(margin + cardWidth * 1.5 + cardSpacing * 1.5, yPosition, cardWidth * 1.5 + cardSpacing / 2, cardHeight, 5, 5, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text('Cost per Day of Delay', margin + cardWidth * 1.5 + cardSpacing * 1.5 + 10, yPosition + 20);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text(formatCurrency(data.costPerDayDelay), margin + cardWidth * 1.5 + cardSpacing * 1.5 + 10, yPosition + 50);
  if (data.timeToMarket <= 60) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...BRAND_COLORS.textMuted);
    pdf.text(`×${data.urgencyMultiplier.toFixed(2)} urgency multiplier`, margin + cardWidth * 1.5 + cardSpacing * 1.5 + 10, yPosition + 68);
  }

  yPosition += cardHeight + 30;

  // Adoption Rate Section
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(margin, yPosition, contentWidth, 65, 5, 5, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('Adoption Rate Analysis', margin + 15, yPosition + 20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);
  const baseLine = `${(data.adoptionRate * 100).toFixed(1)}% adoption rate based on market validation level ${data.marketValidation}/10`;
  const bonusLine = data.timeBonus > 0
    ? '+5% fast launch bonus for ≤45 day timeline'
    : '';
  
  const adoptionLines = bonusLine ? [baseLine, bonusLine] : [baseLine];
  pdf.text(adoptionLines, margin + 15, yPosition + 38);

  yPosition += 85;

  // Key Insights
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('Key Insights', margin, yPosition);
  
  yPosition += 25;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);
  
  const insights = [
    `• Your SaaS MVP could generate ${formatCurrency(data.twelveMonthRevenue)} in the first 12 months`,
    `• Break-even expected in ${formatNumber(data.breakEvenMonths)} months after launch`,
    `• Every day of delay costs approximately ${formatCurrency(data.costPerDayDelay)} in lost revenue`,
    `• ${data.tierInfo.name} tier development typically takes ${data.tierInfo.timeline}`,
  ];
  
  insights.forEach(insight => {
    pdf.text(insight, margin + 10, yPosition);
    yPosition += 20;
  });

  // ========== PAGE 2: REVENUE PROJECTION CHART ==========
  addNewPage();
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('12-Month Revenue Projection', margin, yPosition);
  
  yPosition += 30;

  if (data.chartImageData) {
    const chartWidth = contentWidth - 40;
    const chartHeight = 300;
    
    // Add white background box for better visibility
    pdf.setFillColor(...BRAND_COLORS.white);
    pdf.rect(margin - 10, yPosition - 10, contentWidth + 20, chartHeight + 20, 'F');
    
    // Add chart image
    pdf.addImage(data.chartImageData, 'PNG', margin + 10, yPosition, chartWidth, chartHeight);
    yPosition += chartHeight + 30;
  }

  // Chart Legend
  pdf.setFillColor(250, 250, 250);
  pdf.roundedRect(margin, yPosition, contentWidth, 80, 5, 5, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('Understanding Your Projection', margin + 15, yPosition + 25);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);
  
  const legendItems = [
    '• Blue Area: Cumulative revenue showing your total earnings over time',
    '• Green Line: Monthly revenue demonstrating growth acceleration',
    '• Red Line: Your initial development investment (break-even point)',
  ];
  
  let legendY = yPosition + 45;
  legendItems.forEach(item => {
    pdf.text(item, margin + 15, legendY);
    legendY += 15;
  });

  // ========== PAGE 3: INPUT ASSUMPTIONS & METHODOLOGY ==========
  addNewPage();
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('Input Assumptions & Methodology', margin, yPosition);
  
  yPosition += 40;

  // Your SaaS Vision Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text('Your SaaS Vision', margin, yPosition);
  
  yPosition += 25;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);

  const assumptions = [
    { label: 'Expected Monthly Users:', value: formatNumber(data.expectedUsers) },
    { label: 'Pricing Per User:', value: formatCurrency(data.pricePerUser) },
    { label: 'Market Validation:', value: `${data.marketValidation}/10` },
    { label: 'Development Tier:', value: data.tierInfo.name },
    { label: 'Launch Timeline:', value: `${data.timeToMarket} days` },
    { label: 'Calculated Adoption Rate:', value: `${(data.adoptionRate * 100).toFixed(1)}%` },
  ];

  assumptions.forEach(item => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.label, margin + 10, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.value, margin + 200, yPosition);
    yPosition += 20;
  });

  yPosition += 20;

  // Calculation Methodology
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text('Calculation Methodology', margin, yPosition);
  
  yPosition += 25;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);

  const methodology = [
    {
      title: 'Adoption Rate Formula:',
      desc: 'Base rate of 20% + up to 60% based on market validation (1-10 scale). Fast launches (≤45 days) receive a 5% competitive advantage bonus, capped at 85% maximum.'
    },
    {
      title: 'Revenue Calculation:',
      desc: 'Monthly Revenue = Expected Users × Price Per User × Adoption Rate. Growth curve accelerates over 24 months, with faster time-to-market providing earlier momentum.'
    },
    {
      title: 'Opportunity Cost Multiplier:',
      desc: `Urgency multiplier of ${data.urgencyMultiplier.toFixed(2)}x applied based on ${data.timeToMarket}-day timeline. Faster launches face higher daily opportunity costs but capture market share earlier.`
    },
    {
      title: 'Break-Even Analysis:',
      desc: 'Calculated by dividing total development investment by monthly revenue at scale. Typical SaaS businesses reach profitability within 6-12 months.'
    },
  ];

  methodology.forEach(item => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.title, margin + 10, yPosition);
    yPosition += 15;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...BRAND_COLORS.textLight);
    
    if (item.title === 'Adoption Rate Formula:') {
      // Explicit split after the "scale)." sentence
      const sentenceSplit = item.desc.split('. ');
      const firstSentence = sentenceSplit.shift() || '';
      const remainingText = sentenceSplit.join('. ');
      
      // First sentence (ends with "scale).")
      const firstLineText = firstSentence.endsWith('.')
        ? firstSentence
        : firstSentence + '.';
      const firstLines = pdf.splitTextToSize(firstLineText, contentWidth - 80);
      pdf.text(firstLines, margin + 10, yPosition);
      yPosition += firstLines.length * 12 + 5;
      
      // Rest of the explanation (Fast launches... etc.)
      if (remainingText.trim().length > 0) {
        const remainingLines = pdf.splitTextToSize(remainingText, contentWidth - 80);
        pdf.text(remainingLines, margin + 10, yPosition);
        yPosition += remainingLines.length * 12 + 15;
      } else {
        yPosition += 15;
      }
    } else {
      // Existing behavior for other methodology items
      const lines = pdf.splitTextToSize(item.desc, contentWidth - 40);
      pdf.text(lines, margin + 10, yPosition);
      yPosition += (lines.length * 12) + 15;
    }
  });

  // ========== PAGE 4: DISCLAIMERS & CONTACT ==========
  addNewPage();
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('Important Notes & Contact', margin, yPosition);
  
  yPosition += 40;

  // Disclaimers
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text('Important Disclaimers', margin, yPosition);
  
  yPosition += 25;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);

  const disclaimers = [
    '• These projections are based on typical SaaS metrics and market conditions. Actual results will vary based on your specific market, product quality, marketing effectiveness, and execution.',
    
    '• The adoption rates and revenue projections assume effective go-to-market strategy, competitive positioning, and continuous product iteration based on user feedback.',
    
    '• Market validation scoring should be based on real customer conversations, letters of intent, pre-sales, beta user engagement, or other concrete validation signals.',
    
    '• Development costs and timelines are estimates. Final costs may vary based on feature complexity, technical requirements, integrations, and team composition.',
    
    '• This calculator is designed for educational and planning purposes. Always conduct thorough market research and financial planning before making investment decisions.',
  ];

  disclaimers.forEach(disclaimer => {
    const lines = pdf.splitTextToSize(disclaimer, contentWidth - 20);
    pdf.text(lines, margin + 10, yPosition);
    yPosition += (lines.length * 12) + 10;
  });

  yPosition += 30;

  // Contact Information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.gold);
  pdf.text('Ready to Build Your MVP?', margin, yPosition);
  
  yPosition += 25;

  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(margin, yPosition, contentWidth, 120, 5, 5, 'F');

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BRAND_COLORS.textDark);
  pdf.text('UAICode - AI-Powered MVP Development', margin + 15, yPosition + 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...BRAND_COLORS.textLight);
  
  pdf.text('Email: hello@uaicode.ai', margin + 15, yPosition + 50);
  pdf.text('Phone: +1 321 529 1451', margin + 15, yPosition + 68);
  pdf.text('Website: uaicode.ai', margin + 15, yPosition + 86);
  
  pdf.setFontSize(9);
  pdf.setTextColor(...BRAND_COLORS.textMuted);
  pdf.text('Schedule a free consultation to discuss your project and get a detailed quote.', margin + 15, yPosition + 108);

  // Add final page footer
  addPageFooter(pageNumber);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const filename = `ROI_Report_${data.mvpTier}_${timestamp}.pdf`;

  // Save the PDF
  pdf.save(filename);
};
