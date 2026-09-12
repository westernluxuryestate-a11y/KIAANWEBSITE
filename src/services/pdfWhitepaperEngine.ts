/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { BlogPost, KnowledgeTopic } from '../types';

export class PdfWhitepaperEngine {
  /**
   * Generates and triggers download of a luxury editorial whitepaper PDF for any BlogPost
   */
  public generateBlogWhitepaperPdf(article: BlogPost): boolean {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin - 15) {
          doc.addPage();
          y = margin;
          drawHeaderFooter(doc.getNumberOfPages());
        }
      };

      const drawHeaderFooter = (pageNum: number) => {
        // Top Header Bar
        doc.setFillColor(15, 23, 42); // Slate 900
        doc.rect(0, 0, pageWidth, 12, 'F');
        doc.setFillColor(217, 119, 6); // Amber 600
        doc.rect(0, 12, pageWidth, 1.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('KIAAN PROPERTIES ™ | LUXURY RESEARCH & REGULATORY WHITE-PAPER', margin, 7.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(217, 119, 6);
        doc.text('VERIFIED MAHARERA DESK 2026', pageWidth - margin - 45, 7.5);

        // Bottom Footer
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('© 2026 Kiaan Properties Advisory LLP. Private & Confidential.', margin, pageHeight - 7);
        doc.text(`Page ${pageNum}`, pageWidth - margin - 10, pageHeight - 7);
      };

      // Initial page setup
      drawHeaderFooter(1);
      y = 22;

      // 1. Category Badge & Meta
      doc.setFillColor(245, 158, 11); // Amber 500
      doc.roundedRect(margin, y, 60, 6, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
      doc.text((article.categoryLabel || article.category).toUpperCase(), margin + 3, y + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Published: ${article.publishedDate || '2026-08'} | Read Time: ${article.readTimeMinutes || 7} min | Ref: KP-WP-${article.id.slice(0, 8).toUpperCase()}`,
        margin + 65,
        y + 4.2
      );

      y += 12;

      // 2. Main Title
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(article.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 7.5 + 2;

      // 3. Subtitle / Excerpt
      if (article.subtitle) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10.5);
        doc.setTextColor(71, 85, 105);
        const subLines = doc.splitTextToSize(article.subtitle, contentWidth);
        doc.text(subLines, margin, y);
        y += subLines.length * 5.2 + 4;
      }

      // 4. Author & Editorial Credentials Bar
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(article.author?.name || 'Kiaan Research Desk', margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9); // Amber 700
      doc.text(article.author?.role || 'Senior Real Estate & Advisory Strategist', margin + 4, y + 10);

      if (article.author?.credentials) {
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`[ ${article.author.credentials} ]`, margin + 85, y + 10);
      }

      y += 19;

      // 5. Executive Summary & Key Takeaways Callout Box
      const overviewText = article.content?.overview || article.excerpt;
      const takeaways = article.content?.keyTakeaways || [];

      doc.setFillColor(254, 243, 199); // Amber 100
      doc.setDrawColor(245, 158, 11); // Amber 500
      doc.setLineWidth(0.6);

      const splitOverview = doc.splitTextToSize(overviewText, contentWidth - 8);
      const boxHeight = 12 + splitOverview.length * 4.5 + takeaways.length * 5.5;

      checkPageBreak(boxHeight + 5);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(146, 64, 14); // Amber 800
      doc.text('EXECUTIVE SUMMARY & STATUTORY HIGHLIGHTS', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(splitOverview, margin + 4, y + 11);

      let takeawayY = y + 12 + splitOverview.length * 4.5;
      takeaways.forEach((t) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9);
        doc.text('•', margin + 4, takeawayY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        const splitT = doc.splitTextToSize(t, contentWidth - 14);
        doc.text(splitT, margin + 8, takeawayY);
        takeawayY += splitT.length * 4.5 + 1;
      });

      y += boxHeight + 8;

      // 6. Article In-Depth Sections
      if (article.content?.sections && article.content.sections.length > 0) {
        article.content.sections.forEach((sec, idx) => {
          checkPageBreak(25);

          // Section Heading
          doc.setFont('times', 'bold');
          doc.setFontSize(13);
          doc.setTextColor(15, 23, 42);
          doc.text(sec.heading, margin, y);
          y += 6;

          // Section Body Paragraphs
          sec.body.forEach((para) => {
            const splitPara = doc.splitTextToSize(para, contentWidth);
            checkPageBreak(splitPara.length * 4.8 + 4);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            doc.text(splitPara, margin, y);
            y += splitPara.length * 4.8 + 3;
          });

          // Stat Callout if present
          if (sec.statCallout) {
            checkPageBreak(18);
            doc.setFillColor(241, 245, 249);
            doc.setDrawColor(203, 213, 225);
            doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(180, 83, 9);
            doc.text(`VERIFIED BENCHMARK: ${sec.statCallout.metric}`, margin + 4, y + 5.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`${sec.statCallout.label} — Source: ${sec.statCallout.source}`, margin + 4, y + 10);

            y += 18;
          }

          // Quote if present
          if (sec.quote) {
            checkPageBreak(20);
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(1);
            doc.line(margin, y, margin, y + 14);

            doc.setFont('times', 'italic');
            doc.setFontSize(9.5);
            doc.setTextColor(30, 41, 59);
            const quoteLines = doc.splitTextToSize(`"${sec.quote.text}"`, contentWidth - 8);
            doc.text(quoteLines, margin + 4, y + 5);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(180, 83, 9);
            doc.text(`— ${sec.quote.author}, ${sec.quote.title}`, margin + 4, y + 11);

            y += 18;
          }

          y += 4;
        });
      }

      // 7. Statutory & Regulatory Disclaimer
      checkPageBreak(28);
      const disclaimer =
        article.content?.statutoryDisclaimer ||
        'This whitepaper is prepared by Kiaan Properties Advisory for research, educational, and institutional guidance purposes. Real estate transactions must comply with MahaRERA regulations and applicable provisions of the Income Tax Act, 1961. Readers are advised to verify independent title deeds and consult licensed legal/tax counsel before executing binding agreements.';

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      doc.text('STATUTORY DISCLOSURE & MAHARERA ADVISORY NOTICE', margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
      doc.text(disclaimerLines, margin + 4, y + 9.5);

      // Save PDF with sanitized filename
      const safeFilename = `${(article.slug || article.title)
        .slice(0, 40)
        .replace(/[^a-zA-Z0-9_-]/g, '_')}_Whitepaper_Kiaan.pdf`;

      doc.save(safeFilename);
      return true;
    } catch (err) {
      console.error('Failed to generate PDF whitepaper:', err);
      return false;
    }
  }

  /**
   * Generates and triggers download of a technical research dossier for any KnowledgeTopic
   */
  public generateTopicWhitepaperPdf(topic: KnowledgeTopic): boolean {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin - 15) {
          doc.addPage();
          y = margin;
          drawHeaderFooter(doc.getNumberOfPages());
        }
      };

      const drawHeaderFooter = (pageNum: number) => {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 12, 'F');
        doc.setFillColor(217, 119, 6);
        doc.rect(0, 12, pageWidth, 1.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('KIAAN PROPERTIES ™ | INSTITUTIONAL REAL ESTATE RESEARCH DOSSIER', margin, 7.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(217, 119, 6);
        doc.text('STATUTORY AUDIT DESK', pageWidth - margin - 35, 7.5);

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text('© 2026 Kiaan Properties Advisory LLP. MahaRERA & Income Tax Act Standard.', margin, pageHeight - 7);
        doc.text(`Page ${pageNum}`, pageWidth - margin - 10, pageHeight - 7);
      };

      drawHeaderFooter(1);
      y = 22;

      // Category Pill
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(margin, y, 60, 6, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
      doc.text((topic.categoryLabel || topic.category).toUpperCase(), margin + 3, y + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Document Ref: KP-DOC-${topic.id.toUpperCase()}`, margin + 65, y + 4.2);

      y += 12;

      // Topic Title
      doc.setFont('times', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(topic.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 7 + 2;

      // Statutory Rule callout
      if (topic.statutoryRuleOrSection) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(180, 83, 9);
        doc.text(`Statutory Authority: ${topic.statutoryRuleOrSection}`, margin, y);
        y += 6;
      }

      // Summary Card
      const summaryText = topic.humanizedExplanation || topic.simpleEnglishSummary;
      const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 8);
      const summaryHeight = 10 + splitSummary.length * 4.5;

      checkPageBreak(summaryHeight + 5);
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y, contentWidth, summaryHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(146, 64, 14);
      doc.text('OVERVIEW & CORE PRINCIPLES', margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(splitSummary, margin + 4, y + 10);

      y += summaryHeight + 8;

      // Practical Real-World Example
      if (topic.practicalExample) {
        checkPageBreak(35);
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Practical Case Study: ${topic.practicalExample.scenarioTitle}`, margin, y);
        y += 6;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);

        const splitScenario = doc.splitTextToSize(topic.practicalExample.scenarioText, contentWidth - 8);
        const splitOutcome = doc.splitTextToSize(
          `Financial/Legal Outcome: ${topic.practicalExample.calculationOrOutcome}`,
          contentWidth - 8
        );
        const exBoxHeight = 10 + (splitScenario.length + splitOutcome.length) * 4.5;

        doc.roundedRect(margin, y, contentWidth, exBoxHeight, 2, 2, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(splitScenario, margin + 4, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9);
        doc.text(splitOutcome, margin + 4, y + 7 + splitScenario.length * 4.5);

        y += exBoxHeight + 8;
      }

      // Pitfalls & Action Checklist
      if (topic.commonPitfalls && topic.commonPitfalls.length > 0) {
        checkPageBreak(25);
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(185, 28, 28); // Red 700
        doc.text('Common Pitfalls & Risks To Avoid:', margin, y);
        y += 6;

        topic.commonPitfalls.forEach((pitfall) => {
          const splitP = doc.splitTextToSize(`⚠  ${pitfall}`, contentWidth - 4);
          checkPageBreak(splitP.length * 4.5 + 2);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(splitP, margin, y);
          y += splitP.length * 4.5 + 1.5;
        });

        y += 4;
      }

      if (topic.keyActionChecklist && topic.keyActionChecklist.length > 0) {
        checkPageBreak(25);
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(16, 185, 129); // Emerald 600
        doc.text('Verified Buyer & Investor Action Checklist:', margin, y);
        y += 6;

        topic.keyActionChecklist.forEach((chk) => {
          const splitC = doc.splitTextToSize(`✓  ${chk}`, contentWidth - 4);
          checkPageBreak(splitC.length * 4.5 + 2);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(splitC, margin, y);
          y += splitC.length * 4.5 + 1.5;
        });

        y += 4;
      }

      // FAQs
      if (topic.faqs && topic.faqs.length > 0) {
        checkPageBreak(25);
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('Frequently Asked Questions (Statutory Q&A):', margin, y);
        y += 6;

        topic.faqs.forEach((faq) => {
          const splitQ = doc.splitTextToSize(`Q: ${faq.question}`, contentWidth - 4);
          const splitA = doc.splitTextToSize(`A: ${faq.answer}`, contentWidth - 4);
          checkPageBreak((splitQ.length + splitA.length) * 4.5 + 4);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(splitQ, margin, y);
          y += splitQ.length * 4.5 + 1;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(splitA, margin, y);
          y += splitA.length * 4.5 + 3;
        });
      }

      const safeFilename = `${(topic.slug || topic.id)
        .slice(0, 40)
        .replace(/[^a-zA-Z0-9_-]/g, '_')}_Research_Dossier_Kiaan.pdf`;

      doc.save(safeFilename);
      return true;
    } catch (err) {
      console.error('Failed to generate Topic PDF dossier:', err);
      return false;
    }
  }

  /**
   * Generates custom editorial research dossier for sidebar library items
   */
  public generateNamedLibraryWhitepaper(title: string): boolean {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Header Bar
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFillColor(217, 119, 6);
      doc.rect(0, 12, pageWidth, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('KIAAN PROPERTIES ™ | INSTITUTIONAL RESEARCH & REGULATORY WHITE-PAPER', margin, 7.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(217, 119, 6);
      doc.text('PRIVATE CLIENT ADVISORY 2026', pageWidth - margin - 45, 7.5);

      // Bottom Footer
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('© 2026 Kiaan Properties Advisory LLP. MahaRERA & Direct Tax Verified.', margin, pageHeight - 7);
      doc.text('Page 1 of 1', pageWidth - margin - 15, pageHeight - 7);

      y = 22;

      // Category Pill
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(margin, y, 55, 6, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
      doc.text('SPECIAL RESEARCH DOSSIER', margin + 3, y + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Published: 2026-08 | Institutional Edition | Ref: KP-LIB-${Date.now().toString().slice(-6)}`, margin + 60, y + 4.2);

      y += 12;

      // Title
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 7.5 + 4;

      // Executive Summary
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.6);

      const overviewText = `This specialized advisory whitepaper examines institutional real estate frameworks, capital allocation benchmarks, and statutory compliance guidelines for ${title}. Prepared by Kiaan Properties Advisory Research Cell.`;
      const splitOverview = doc.splitTextToSize(overviewText, contentWidth - 8);

      const boxHeight = 14 + splitOverview.length * 4.5;
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(146, 64, 14);
      doc.text('EXECUTIVE MEMORANDUM & STRATEGIC HIGHLIGHTS', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(splitOverview, margin + 4, y + 11);

      y += boxHeight + 8;

      // Core Strategic Principles
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Key Strategic Recommendations & Compliance Checkpoints:', margin, y);
      y += 6;

      const bulletPoints = [
        'Complete Title Chain Verification: Mandatory 30-year unbroken title search across Sub-Registrar Index-II and Revenue 7/12 mutation registers.',
        'MahaRERA Escrow Audits: Verification of the dedicated 70% project escrow bank account and quarterly Form 1/2/3 architect-engineer certifications.',
        'Tax Optimization: Structuring acquisitions under Section 54, 54EC, and Section 24(b) to optimize capital gains and withholding tax deductions.',
        'Construction QA: Independent structural vetting adhering to IS 456 monolithic formwork standards and seismic Zone III / IV compliance.',
      ];

      bulletPoints.forEach((bp) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9);
        doc.text('✓', margin + 2, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const splitBp = doc.splitTextToSize(bp, contentWidth - 10);
        doc.text(splitBp, margin + 8, y);
        y += splitBp.length * 4.5 + 2.5;
      });

      y += 6;

      // Statutory Disclaimer
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      doc.text('STATUTORY DISCLOSURE & ADVISORY NOTICE', margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      const disclaimer = 'This whitepaper is prepared for private institutional and accredited investor briefing. Real estate transactions in Maharashtra are subject to MahaRERA regulations and applicable provisions of the Indian Income Tax Act 1961. Always consult qualified advocates and Chartered Accountants.';
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
      doc.text(disclaimerLines, margin + 4, y + 9.5);

      const safeFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Kiaan.pdf`;
      doc.save(safeFilename);
      return true;
    } catch (err) {
      console.error('Failed to generate Library PDF:', err);
      return false;
    }
  }
}

export const pdfEngine = new PdfWhitepaperEngine();
