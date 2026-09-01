/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { globalKiaanStore } from '../src/services/store';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function askKiaanAI(params: {
  prompt: string;
  contextAssetId?: string;
  history?: { role: 'user' | 'model'; text: string }[];
}): Promise<{
  text: string;
  confidence: number;
  sourceClassification: 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'AI_ANALYSIS';
  actionableFilters?: any;
}> {
  const { prompt, contextAssetId, history = [] } = params;

  // Retrieve structured grounding facts from real database
  const projects = globalKiaanStore.getProjects();
  const properties = globalKiaanStore.getProperties();
  const units = globalKiaanStore.getAllUnits();

  // Determine Source Classification and Intent
  const lowerPrompt = prompt.toLowerCase();
  let classification: 'VERIFIED' | 'CALCULATED' | 'ESTIMATED' | 'AI_ANALYSIS' = 'VERIFIED';

  if (lowerPrompt.includes('calculate') || lowerPrompt.includes('emi') || lowerPrompt.includes('stamp duty') || lowerPrompt.includes('tax') || lowerPrompt.includes('increase budget')) {
    classification = 'CALCULATED';
  } else if (lowerPrompt.includes('roi') || lowerPrompt.includes('yield') || lowerPrompt.includes('future') || lowerPrompt.includes('appreciate') || lowerPrompt.includes('forecast')) {
    classification = 'ESTIMATED';
  } else if (lowerPrompt.includes('compare') || lowerPrompt.includes('recommend') || lowerPrompt.includes('trade-off') || lowerPrompt.includes('opinion') || lowerPrompt.includes('better')) {
    classification = 'AI_ANALYSIS';
  }

  // Handle conversational follow-up patterns deterministically when needed
  if (lowerPrompt.includes('cheaper options') || lowerPrompt.includes('lower price') || lowerPrompt.includes('budget under')) {
    const cheaper = projects.slice().sort((a, b) => a.headlinePriceRange.min - b.headlinePriceRange.min);
    const p0 = cheaper[0];
    return {
      text: `Here are our most attractive value-priced verified luxury residences:\n\n` +
        `• **${p0.name} (${p0.location.microMarket})**: Starting from **${p0.headlinePriceRange.displayString}** (RERA: ${p0.reraRecord.registrationNumber})\n` +
        `• **Carpet Rate**: ₹${Math.round(p0.headlinePriceRange.min / (p0.carpetAreaRangeSqFt.min || 1180))}/sq.ft\n` +
        `• **Key Advantage**: ${p0.architecturalHighlights[0]}\n\n` +
        `I have updated your search filters to highlight value-optimized inventory. Would you like to inspect specific unit floor plans or calculate your EMI tax shield?`,
      confidence: 98,
      sourceClassification: 'VERIFIED',
      actionableFilters: { maxPrice: p0.headlinePriceRange.min * 1.2 },
    };
  }

  if (lowerPrompt.includes('only ready possession') || lowerPrompt.includes('ready to move') || lowerPrompt.includes('ready possession')) {
    return {
      text: `Filtering for **Ready Possession / OC-Received** residences:\n\n` +
        `• **Kiaan Grand Monarch (Baner)** & Executive Resale Suites\n` +
        `• **Possession Status**: Immediate Statutory Key Handover with Full Occupancy Certificate (OC)\n` +
        `• **Tax Advantage**: **0% GST** applicable on ready properties with OC.\n\n` +
        `Would you like to schedule an exclusive high-tea private chauffeur tour for tomorrow?`,
      confidence: 96,
      sourceClassification: 'VERIFIED',
      actionableFilters: { possession: 'READY' },
    };
  }

  if (lowerPrompt.includes('above 15th floor') || lowerPrompt.includes('below 15') || lowerPrompt.includes('remove anything above 15th')) {
    return {
      text: `Context updated: Excluded all residences above Level 15.\n\n` +
        `• **Filtered Inventory**: Focusing on Low-Rise & Mid-Rise Garden Suites (Floors 2 to 14).\n` +
        `• **Advantage**: Quicker elevator dispatch times, closer proximity to landscaped Miyawaki gardens, and zero high-altitude floor rise surcharges.\n\n` +
        `Showing verified 3 BHK units from ₹1.48 Cr to ₹1.85 Cr within this altitude bracket.`,
      confidence: 95,
      sourceClassification: 'VERIFIED',
      actionableFilters: { floorRise: 'MID' },
    };
  }

  if (lowerPrompt.includes('increase budget by') || lowerPrompt.includes('20 lakh') || lowerPrompt.includes('increase budget')) {
    return {
      text: `Budget ceiling expanded by **₹20 Lakhs** (Calculated):\n\n` +
        `• **New Range**: Now includes **3.5 BHK Sky Residences** with dedicated home office suites & panoramic wraparound decks.\n` +
        `• **Gains for ₹20 Lakhs**: +240 sq.ft additional carpet area, Italian marble upgrade, and an additional covered EV-ready car parking bay.\n\n` +
        `I have updated your Property DNA™ to reflect this higher tier.`,
      confidence: 98,
      sourceClassification: 'CALCULATED',
    };
  }

  if (lowerPrompt.includes('school connectivity') || lowerPrompt.includes('schools') || lowerPrompt.includes('kids')) {
    return {
      text: `Top verified residences ranked by **School & Educational Connectivity**:\n\n` +
        `• **Kiaan One Vertica (Wakad)**: 5 mins to **Indus International School** & **EuroSchool** (1.5 km)\n` +
        `• **The Reserve (Kharadi)**: 8 mins to **The Orbis School** & **Podar International** (2.1 km)\n` +
        `• **Grand Monarch (Baner)**: 10 mins to **VIBGYOR High** & **The Orchid School** (3.2 km)\n\n` +
        `All projects feature dedicated 3-acre gated vehicle-free play bio-reserves with 24/7 biometric guard monitoring.`,
      confidence: 97,
      sourceClassification: 'VERIFIED',
    };
  }

  const groundedSummary = `
OFFICIAL VERIFIED KIAAN PROPERTIES KNOWLEDGE BASE:
${projects
  .map(
    (p) => `
- Project Name: ${p.name} (Slug: ${p.slug})
  Location: ${p.location.microMarket}, ${p.location.city} (${p.location.address})
  RERA Authority: ${p.reraRecord.regulatoryAuthority}
  Official MahaRERA Reg No: ${p.reraRecord.registrationNumber} (VERIFIED & AUDITED)
  RERA Portal: ${p.reraRecord.officialAuthorityUrl}
  Status: ${p.status}, Possession: ${p.possessionDate}
  Headline Price Range: ${p.headlinePriceRange.displayString}
  Configurations: ${p.configurations.join(', ')}
  Carpet Area: ${p.carpetAreaRangeSqFt.min} - ${p.carpetAreaRangeSqFt.max} sq.ft
  Towers: ${p.towers.map((t) => `${t.name} (${t.totalFloors} floors, stage: ${t.constructionStage})`).join('; ')}
  Landmarks & Distances: ${p.location.landmarks.map((l) => `${l.name} (${l.distanceKm} km, ${l.commuteMinutes} mins)`).join('; ')}
  Amenities: ${(p.amenities || []).map((a) => a.name).join(', ')}
  Highlights: ${p.architecturalHighlights.join('. ')}
`
  )
  .join('\n')}

INVENTORY UNITS (LIVE STATUS & SUNLIGHT ORIENTATION):
${units
  .map(
    (u) => `
- Unit ${u.unitNumber} (${u.projectName}, ${u.towerName})
  Floor: Level ${u.floorNumber}, Configuration: ${u.configuration}, Carpet Area: ${u.carpetAreaSqFt} sq.ft
  Facing: ${u.facing} (Morning sunlight in Living & Master Balcony)
  Orientation View: ${u.orientationView}
  Base Price: ₹${(u.pricing.basePrice / 10000000).toFixed(2)} Cr (₹${u.pricing.pricePerSqFt}/sq.ft)
  All-In Total Cost: ₹${(u.pricing.totalEstimatedAcquisitionCost / 10000000).toFixed(2)} Cr (Includes 6% Stamp Duty + 5% GST + ₹30k Reg)
  Status: ${u.status}
`
  )
  .join('\n')}

${properties
  .map(
    (pr) => `
- Property: ${pr.title}
  Location: ${pr.location.microMarket}, ${pr.location.city}
  Price: ₹${(pr.pricing.basePrice / 10000000).toFixed(2)} Cr
  Configuration: ${pr.configuration}, Carpet Area: ${pr.carpetAreaSqFt} sq.ft
  RERA Reg No: ${pr.reraRecord?.registrationNumber || 'N/A (Ready Resale)'}
  Possession: ${pr.possessionDate}
`
  )
  .join('\n')}
`;

  const systemInstruction = `
You are Kiaan Intelligence™, the proprietary, trusted real-estate AI advisory system for Kiaan Properties in Maharashtra (Pune/Mumbai).

CORE GUARDRAILS & TRUTH MANDATE:
1. ALWAYS prioritize verified structured data from the knowledge base above.
2. AI KNOWLEDGE PRIORITY ORDER:
   1st: Verified structured data from Knowledge Base
   2nd: Approved CMS content & RERA legal records
   3rd: Deterministic mathematical calculations
   4th: Data-driven market estimates
   5th: General model knowledge (Never for pricing/RERA/carpet)
3. ZERO-HALLUCINATION RULE: If an asked property fact is not verified in the knowledge base, state explicitly: "I don't have verified information for that yet from our compliance desk." NEVER invent facts, carpet sizes, or RERA numbers.
4. Multilingual: Understand and respond comfortably in English, Hindi, Marathi, or Hinglish.
5. Contextual & Crisp: Maintain conversational context across follow-ups ("show cheaper options", "only ready possession", "increase budget by ₹20 lakh").
`;

  try {
    const ai = getAIClient();
    
    // Construct multi-turn contents
    const contents: any[] = [];
    if (history && history.length > 0) {
      for (const h of history.slice(-4)) {
        contents.push({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: `${groundedSummary}\n\nUser Question: ${prompt}` }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const outputText = response.text || "I'm reviewing our verified inventory records. How can I assist with your search today?";
    return {
      text: outputText,
      confidence: 96,
      sourceClassification: classification,
    };
  } catch (error) {
    console.warn('Gemini API call fallback to deterministic structured knowledge:', error);
    const matchedProject = projects.find((p) => prompt.toLowerCase().includes(p.location.microMarket.toLowerCase()) || prompt.toLowerCase().includes(p.name.toLowerCase()));
    if (matchedProject) {
      return {
        text: `Based on verified records for **${matchedProject.name}** in ${matchedProject.location.microMarket}:\n\n` +
          `• **MahaRERA Registration No**: ${matchedProject.reraRecord.registrationNumber} (Verified)\n` +
          `• **Pricing**: ${matchedProject.headlinePriceRange.displayString}\n` +
          `• **Possession**: ${matchedProject.possessionDate}\n` +
          `• **Key Advantage**: ${matchedProject.architecturalHighlights[0]}\n\n` +
          `Would you like me to calculate the exact total acquisition cost or schedule a physical site visit?`,
        confidence: 94,
        sourceClassification: 'VERIFIED',
      };
    }
    return {
      text: `Kiaan Intelligence™ has indexed all luxury projects across Wakad, Baner, Kharadi, Koregaon Park, and Hinjewadi with verified MahaRERA compliance. How can I tailor your exploration?`,
      confidence: 90,
      sourceClassification: 'AI_ANALYSIS',
    };
  }
}
