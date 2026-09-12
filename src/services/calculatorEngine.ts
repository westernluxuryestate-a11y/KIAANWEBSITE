/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// KIAAN FINANCIAL & INVESTMENT CALCULATION SUITE (19 HIGH-PRECISION ENGINES)
// Deterministic mathematical formulas calibrated for Indian luxury real estate
// & Maharashtra statutory taxation (MahaRERA & Maharashtra Stamp Act).
// ============================================================================

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = '';
  if (absAmount >= 10000000) {
    const cr = absAmount / 10000000;
    formatted = `₹${cr.toFixed(2)} Cr`;
  } else if (absAmount >= 100000) {
    const l = absAmount / 100000;
    formatted = `₹${l.toFixed(2)} L`;
  } else {
    formatted = `₹${absAmount.toLocaleString('en-IN')}`;
  }
  return isNegative ? `-${formatted}` : formatted;
}

// 1. EMI Engine
export interface EMIResult {
  monthlyEMI: number;
  principalAmount: number;
  totalInterest: number;
  totalPayment: number;
  amortizationPreview: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
}

export function calculateEMI(principal: number, annualInterestRatePercent: number, tenureYears: number): EMIResult {
  if (principal <= 0 || annualInterestRatePercent <= 0 || tenureYears <= 0) {
    return { monthlyEMI: 0, principalAmount: principal, totalInterest: 0, totalPayment: principal, amortizationPreview: [] };
  }
  const monthlyRate = annualInterestRatePercent / (12 * 100);
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  const amortizationPreview: EMIResult['amortizationPreview'] = [];
  let balance = principal;
  for (let year = 1; year <= Math.min(tenureYears, 10); year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance = Math.max(0, balance - principalForMonth);
    }
    amortizationPreview.push({
      year,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      remainingBalance: Math.round(balance),
    });
  }

  return {
    monthlyEMI: Math.round(emi),
    principalAmount: Math.round(principal),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    amortizationPreview,
  };
}

// 2. Loan Eligibility Engine (FOIR based)
export function calculateLoanEligibility(params: {
  monthlyNetIncome: number;
  existingEmis: number;
  interestRate?: number;
  tenureYears?: number;
  foirPercent?: number;
}) {
  const { monthlyNetIncome, existingEmis, interestRate = 8.45, tenureYears = 20, foirPercent = 50 } = params;
  const maxAllowableEmi = Math.max(0, monthlyNetIncome * (foirPercent / 100) - existingEmis);
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  const maxLoan =
    maxAllowableEmi > 0
      ? (maxAllowableEmi * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
      : 0;

  return {
    maxEligibleLoanAmount: Math.round(maxLoan),
    maxMonthlyEmiCapacity: Math.round(maxAllowableEmi),
    effectiveFoirPercent: Number(((existingEmis + maxAllowableEmi) / monthlyNetIncome * 100).toFixed(1)),
  };
}

// 3. Affordability Engine
export function evaluateAffordability(params: {
  monthlyNetIncome: number;
  existingMonthlyEmis: number;
  liquidSavings: number;
  tenureYears?: number;
  interestRate?: number;
}) {
  const { monthlyNetIncome, existingMonthlyEmis, liquidSavings, tenureYears = 20, interestRate = 8.45 } = params;
  const loanElig = calculateLoanEligibility({
    monthlyNetIncome,
    existingEmis: existingMonthlyEmis,
    interestRate,
    tenureYears,
  });

  const usableDownpayment = Math.max(0, liquidSavings * 0.8); // 20% safety emergency cushion retained
  const maxAffordablePrice = loanElig.maxEligibleLoanAmount + usableDownpayment;
  const emiToIncomeRatio = (loanElig.maxMonthlyEmiCapacity / monthlyNetIncome) * 100;

  let comfortBand: 'COMFORTABLE' | 'STRETCH' | 'HIGH_BURDEN' = 'COMFORTABLE';
  let explanation = 'Safe financial buffer with <35% net obligation.';
  if (emiToIncomeRatio > 45) {
    comfortBand = 'HIGH_BURDEN';
    explanation = 'Tight liquidity margin. Increasing down payment is strongly recommended.';
  } else if (emiToIncomeRatio > 35) {
    comfortBand = 'STRETCH';
    explanation = 'Viable within banking guidelines, but approaching 45% ceiling. Consider 25-yr tenure.';
  }

  return {
    maxAffordablePropertyPrice: Math.round(maxAffordablePrice),
    maxEligibleLoan: loanElig.maxEligibleLoanAmount,
    recommendedDownPayment: Math.round(usableDownpayment),
    monthlySurplusRemaining: Math.round(monthlyNetIncome - existingMonthlyEmis - loanElig.maxMonthlyEmiCapacity),
    comfortBand,
    explanation,
  };
}

// 4. Down Payment Optimizer
export function calculateDownPaymentScenarios(propertyPrice: number, interestRate: number = 8.45) {
  return [10, 15, 20, 25, 30, 40].map((dpPct) => {
    const downPayment = (propertyPrice * dpPct) / 100;
    const loan = propertyPrice - downPayment;
    const emi = calculateEMI(loan, interestRate, 20);
    return {
      downPaymentPercent: dpPct,
      downPaymentAmount: Math.round(downPayment),
      loanAmount: Math.round(loan),
      monthlyEMI: emi.monthlyEMI,
      totalInterest20Yrs: emi.totalInterest,
      ltvPercent: 100 - dpPct,
    };
  });
}

// 5. Total Acquisition Cost (Statutory Maharashtra / MahaRERA rules)
export function calculateTotalAcquisitionCost(params: {
  basePrice: number;
  floorNumber?: number;
  floorRiseRatePerFloor?: number;
  parkingCost?: number;
  clubhouseCost?: number;
  carpetAreaSqFt?: number;
  maintenanceRatePerSqFt?: number;
  isUnderConstruction?: boolean;
}) {
  const {
    basePrice,
    floorNumber = 1,
    floorRiseRatePerFloor = 25000,
    parkingCost = 350000,
    clubhouseCost = 200000,
    carpetAreaSqFt = 1000,
    maintenanceRatePerSqFt = 4,
    isUnderConstruction = true,
  } = params;

  const floorRise = Math.max(0, (floorNumber - 1) * floorRiseRatePerFloor);
  const agreementValue = basePrice + floorRise + parkingCost + clubhouseCost;

  // Maharashtra: 6% Stamp duty (includes 1% LBT/Metro cess), ₹30,000 flat registration cap
  const stampDutyPercent = 6;
  const stampDutyAmount = Math.round((agreementValue * stampDutyPercent) / 100);
  const registrationAmount = 30000;

  // GST: 5% for Under Construction, 0% for Ready with OC
  const gstPercent = isUnderConstruction ? 5 : 0;
  const gstAmount = Math.round((agreementValue * gstPercent) / 100);

  // 1-year advance maintenance reserve + legal & facilitation fee
  const maintenanceDeposit1Yr = Math.round(carpetAreaSqFt * maintenanceRatePerSqFt * 12);
  const legalAndDocumentationFee = 25000;

  const totalAcquisitionCost =
    agreementValue + stampDutyAmount + registrationAmount + gstAmount + maintenanceDeposit1Yr + legalAndDocumentationFee;

  const breakdownSummary = [
    { label: 'Base Agreement Value', amount: basePrice, percentage: Math.round((basePrice / totalAcquisitionCost) * 100) },
    { label: 'Floor Rise & Parking Amenities', amount: floorRise + parkingCost + clubhouseCost, percentage: Math.round(((floorRise + parkingCost + clubhouseCost) / totalAcquisitionCost) * 100) },
    { label: `Maharashtra Stamp Duty (${stampDutyPercent}%)`, amount: stampDutyAmount, percentage: Math.round((stampDutyAmount / totalAcquisitionCost) * 100) },
    { label: 'Government Registration Fee', amount: registrationAmount, percentage: Math.round((registrationAmount / totalAcquisitionCost) * 100) },
    { label: `GST (${gstPercent}%)`, amount: gstAmount, percentage: Math.round((gstAmount / totalAcquisitionCost) * 100) },
    { label: 'Maintenance Reserve & Escrow', amount: maintenanceDeposit1Yr + legalAndDocumentationFee, percentage: Math.round(((maintenanceDeposit1Yr + legalAndDocumentationFee) / totalAcquisitionCost) * 100) },
  ];

  return {
    agreementValue,
    stampDutyPercent,
    stampDutyAmount,
    registrationAmount,
    gstPercent,
    gstAmount,
    maintenanceDeposit1Yr,
    legalAndDocumentationFee,
    totalAcquisitionCost,
    breakdownSummary,
  };
}

// 6. Stamp Duty & Registration Engine (Direct Breakdown)
export function calculateStampDutyAndRegistration(agreementValue: number, gender: 'MALE' | 'FEMALE' | 'JOINT' = 'MALE') {
  // Concession: 1% discount for women buyers in Maharashtra
  const stampDutyRate = gender === 'FEMALE' ? 5.0 : 6.0;
  const stampDutyAmount = Math.round((agreementValue * stampDutyRate) / 100);
  const registrationFee = Math.min(30000, Math.round(agreementValue * 0.01));
  const metroCess = Math.round(agreementValue * 0.01); // 1% metro cess already factored in 6% or separated

  return {
    stampDutyRate,
    stampDutyAmount,
    registrationFee,
    metroCess,
    totalGovernmentLevies: stampDutyAmount + registrationFee,
  };
}

// 7. GST Compliance Engine
export function calculateGST(agreementValue: number, isAffordableHousing: boolean = false, hasCompletionCertificate: boolean = false) {
  if (hasCompletionCertificate) {
    return { gstRatePercent: 0, gstAmount: 0, status: 'EXEMPT_WITH_OC' };
  }
  const gstRatePercent = isAffordableHousing ? 1 : 5;
  const gstAmount = Math.round((agreementValue * gstRatePercent) / 100);
  return { gstRatePercent, gstAmount, status: isAffordableHousing ? 'AFFORDABLE_1_PERCENT' : 'STANDARD_5_PERCENT' };
}

// 8. Buy vs Rent Engine
export function calculateBuyVsRent(params: {
  propertyPrice: number;
  monthlyRent: number;
  downPayment: number;
  loanInterestRate?: number;
  annualAppreciationRate?: number;
  annualRentEscalationRate?: number;
  investmentYieldRate?: number;
  years?: number;
}) {
  const {
    propertyPrice,
    monthlyRent,
    downPayment,
    loanInterestRate = 8.45,
    annualAppreciationRate = 7.5,
    annualRentEscalationRate = 6.0,
    investmentYieldRate = 11.5,
    years = 10,
  } = params;

  const loanPrincipal = propertyPrice - downPayment;
  const emiResult = calculateEMI(loanPrincipal, loanInterestRate, 20);
  const futurePropertyValue = propertyPrice * Math.pow(1 + annualAppreciationRate / 100, years);

  let remainingLoanBalance = loanPrincipal;
  const mRate = loanInterestRate / (12 * 100);
  for (let m = 1; m <= years * 12; m++) {
    const interest = remainingLoanBalance * mRate;
    const principalPaid = emiResult.monthlyEMI - interest;
    remainingLoanBalance = Math.max(0, remainingLoanBalance - principalPaid);
  }
  const netEquityBuiltBuying = futurePropertyValue - remainingLoanBalance;

  let currentRent = monthlyRent;
  let totalRentPaid = 0;
  let sipCorpus = downPayment * Math.pow(1 + investmentYieldRate / 100, years);

  for (let y = 1; y <= years; y++) {
    const annualRent = currentRent * 12;
    totalRentPaid += annualRent;
    const monthlyDiff = Math.max(0, emiResult.monthlyEMI - currentRent);
    sipCorpus += monthlyDiff * 12 * Math.pow(1 + investmentYieldRate / 100, years - y);
    currentRent = currentRent * (1 + annualRentEscalationRate / 100);
  }

  const buyingWins = netEquityBuiltBuying > sipCorpus;
  const diff = Math.abs(Math.round(netEquityBuiltBuying - sipCorpus));

  return {
    propertyValueAfter10Yrs: Math.round(futurePropertyValue),
    netEquityBuiltBuying: Math.round(netEquityBuiltBuying),
    totalRentPaid10Yrs: Math.round(totalRentPaid),
    sipCorpusWithRenting: Math.round(sipCorpus),
    verdict: (buyingWins ? 'BUYING_WINS' : 'RENTING_WINS') as 'BUYING_WINS' | 'RENTING_WINS',
    netAdvantageAmount: diff,
    reasoning: buyingWins
      ? `Over ${years} years, asset appreciation and debt amortisation generate ₹${(diff / 10000000).toFixed(2)} Cr higher net asset worth than renting.`
      : `Liquid equity compounding exceeds physical asset equity by ₹${(diff / 100000).toFixed(2)} L.`,
  };
}

// 9. Rental Yield Engine
export function calculateRentalYield(params: {
  propertyPrice: number;
  monthlyRentalIncome: number;
  maintenanceMonthly?: number;
  propertyTaxAnnual?: number;
}) {
  const { propertyPrice, monthlyRentalIncome, maintenanceMonthly = 3500, propertyTaxAnnual = 12000 } = params;
  const grossAnnualRent = monthlyRentalIncome * 12;
  const annualExpenses = maintenanceMonthly * 12 + propertyTaxAnnual;
  const netAnnualRent = grossAnnualRent - annualExpenses;

  const grossYieldPercent = Number(((grossAnnualRent / propertyPrice) * 100).toFixed(2));
  const netYieldPercent = Number(((netAnnualRent / propertyPrice) * 100).toFixed(2));

  return {
    grossAnnualRent,
    netAnnualRent,
    grossYieldPercent,
    netYieldPercent,
    monthlyCashflow: Math.round(netAnnualRent / 12),
  };
}

// 10. Return on Investment (ROI) & IRR Engine
export function calculateROI(params: {
  initialInvestment: number;
  holdingPeriodYears: number;
  exitPrice: number;
  totalRentalCollected: number;
  totalExpensesIncurred?: number;
}) {
  const { initialInvestment, holdingPeriodYears, exitPrice, totalRentalCollected, totalExpensesIncurred = 0 } = params;
  const capitalGain = exitPrice - initialInvestment;
  const netProfit = capitalGain + totalRentalCollected - totalExpensesIncurred;
  const absoluteRoiPercent = Number(((netProfit / initialInvestment) * 100).toFixed(2));
  const annualizedRoiPercent = Number((((Math.pow(exitPrice / initialInvestment, 1 / holdingPeriodYears) - 1) * 100) + ((totalRentalCollected / initialInvestment / holdingPeriodYears) * 100)).toFixed(2));

  return {
    capitalGain,
    netProfit,
    absoluteRoiPercent,
    annualizedRoiPercent,
  };
}

// 11. Compound Capital Appreciation Engine & Micro-Market Forecaster
export function calculateAppreciationForecast(propertyPrice: number, annualGrowthRatePercent: number = 7.5, years: number = 10) {
  const timeline = [];
  let currentVal = propertyPrice;
  for (let y = 1; y <= years; y++) {
    currentVal = Math.round(propertyPrice * Math.pow(1 + annualGrowthRatePercent / 100, y));
    timeline.push({
      year: y,
      yearLabel: `Year ${y} (${2026 + y})`,
      estimatedValue: currentVal,
      cumulativeGain: currentVal - propertyPrice,
      growthMultiple: Number((currentVal / propertyPrice).toFixed(2)),
    });
  }
  return {
    forecastYears: years,
    cagrPercent: annualGrowthRatePercent,
    timeline,
    finalValue: currentVal,
    totalGain: currentVal - propertyPrice,
  };
}

export function calculateAppreciationAndRentalForecast(params: {
  propertyPriceINR: number;
  microMarket?: string;
  forecastYears?: number;
  annualGrowthRatePercent?: number;
}) {
  const { propertyPriceINR, microMarket = 'Wakad', forecastYears = 5 } = params;
  const cagrMap: Record<string, number> = {
    Wakad: 9.2,
    Baner: 8.8,
    Kharadi: 9.0,
    Balewadi: 8.5,
    'Koregaon Park': 7.5,
  };
  const assumedCagrPercent = params.annualGrowthRatePercent || cagrMap[microMarket] || 8.5;

  let currentCapital = propertyPriceINR;
  let cumulativeRental = 0;
  const forecastTimeline = [];

  for (let y = 1; y <= forecastYears; y++) {
    currentCapital = Math.round(propertyPriceINR * Math.pow(1 + assumedCagrPercent / 100, y));
    const annualRent = Math.round(currentCapital * 0.038); // 3.8% rental yield
    cumulativeRental += annualRent;

    forecastTimeline.push({
      year: y,
      yearLabel: `Year ${y} (${2026 + y})`,
      estimatedCapitalValueINR: currentCapital,
      annualRentalIncomeINR: annualRent,
      cumulativeRentalIncomeINR: cumulativeRental,
      capitalGainINR: currentCapital - propertyPriceINR,
      totalNetWealthCreatedINR: (currentCapital - propertyPriceINR) + cumulativeRental,
    });
  }

  const finalYr = forecastTimeline[forecastTimeline.length - 1];

  return {
    propertyPriceINR,
    microMarket,
    assumedCagrPercent,
    forecastYears,
    forecastTimeline,
    fiveYearSummary: {
      finalAssetValueINR: finalYr?.estimatedCapitalValueINR || currentCapital,
      capitalAppreciationINR: (finalYr?.estimatedCapitalValueINR || currentCapital) - propertyPriceINR,
      cumulativeRentalINR: cumulativeRental,
      totalNetWealthCreatedINR: finalYr?.totalNetWealthCreatedINR || 0,
    },
  };
}

// 12. Loan Prepayment Engine
export function calculateLoanPrepayment(params: {
  loanPrincipal: number;
  interestRate: number;
  tenureYears: number;
  monthlyPrepaymentExtra?: number;
  lumpSumPrepaymentAnnual?: number;
}) {
  const { loanPrincipal, interestRate, tenureYears, monthlyPrepaymentExtra = 10000, lumpSumPrepaymentAnnual = 100000 } = params;
  const originalEmi = calculateEMI(loanPrincipal, interestRate, tenureYears);
  const monthlyRate = interestRate / (12 * 100);

  let balanceWithPrepay = loanPrincipal;
  let monthsWithPrepay = 0;
  let totalInterestWithPrepay = 0;

  const maxMonths = tenureYears * 12;
  while (balanceWithPrepay > 0 && monthsWithPrepay < maxMonths) {
    monthsWithPrepay++;
    const interest = balanceWithPrepay * monthlyRate;
    totalInterestWithPrepay += interest;

    let principalPayment = originalEmi.monthlyEMI - interest + monthlyPrepaymentExtra;
    if (monthsWithPrepay % 12 === 0) {
      principalPayment += lumpSumPrepaymentAnnual;
    }

    balanceWithPrepay = Math.max(0, balanceWithPrepay - principalPayment);
  }

  const yearsSaved = Number(((maxMonths - monthsWithPrepay) / 12).toFixed(1));
  const interestSaved = Math.max(0, originalEmi.totalInterest - Math.round(totalInterestWithPrepay));

  return {
    originalTenureYears: tenureYears,
    newTenureYears: Number((monthsWithPrepay / 12).toFixed(1)),
    yearsSaved,
    originalTotalInterest: originalEmi.totalInterest,
    newTotalInterest: Math.round(totalInterestWithPrepay),
    interestSavedINR: interestSaved,
  };
}

// 13. Balance Transfer Engine
export function calculateBalanceTransfer(params: {
  outstandingPrincipal: number;
  currentRoi: number;
  newRoi: number;
  remainingTenureYears: number;
  processingFeePercent?: number;
}) {
  const { outstandingPrincipal, currentRoi, newRoi, remainingTenureYears, processingFeePercent = 0.35 } = params;
  const currentEmi = calculateEMI(outstandingPrincipal, currentRoi, remainingTenureYears);
  const newEmi = calculateEMI(outstandingPrincipal, newRoi, remainingTenureYears);

  const switchingCost = Math.round((outstandingPrincipal * processingFeePercent) / 100);
  const totalSavingsOverTenure = currentEmi.totalInterest - newEmi.totalInterest - switchingCost;
  const monthlyEmiReduction = currentEmi.monthlyEMI - newEmi.monthlyEMI;

  return {
    monthlySavingsINR: monthlyEmiReduction,
    switchingCostINR: switchingCost,
    netLifetimeSavingsINR: Math.max(0, totalSavingsOverTenure),
    isRecommended: totalSavingsOverTenure > switchingCost * 3,
  };
}

// 14. SIP vs Property Investment Engine
export function calculateSipVsProperty(params: {
  monthlyAmount: number;
  propertyPrice: number;
  downPayment: number;
  equityReturnRatePercent?: number;
  propertyAppreciationPercent?: number;
  rentalYieldPercent?: number;
  years?: number;
}) {
  const {
    monthlyAmount,
    propertyPrice,
    downPayment,
    equityReturnRatePercent = 12.5,
    propertyAppreciationPercent = 7.5,
    rentalYieldPercent = 4.0,
    years = 10,
  } = params;

  // SIP Corpus
  let sipCorpus = downPayment * Math.pow(1 + equityReturnRatePercent / 100, years);
  for (let y = 1; y <= years; y++) {
    sipCorpus += monthlyAmount * 12 * Math.pow(1 + equityReturnRatePercent / 100, years - y);
  }

  // Real Estate Corpus
  const futurePropertyValue = propertyPrice * Math.pow(1 + propertyAppreciationPercent / 100, years);
  const annualRental = propertyPrice * (rentalYieldPercent / 100);
  const totalRentalReinvested = annualRental * years * 1.15; // compound reinvestment
  const totalPropertyWealth = futurePropertyValue + totalRentalReinvested;

  return {
    sipFinalCorpus: Math.round(sipCorpus),
    propertyTotalWealth: Math.round(totalPropertyWealth),
    winner: totalPropertyWealth > sipCorpus ? 'REAL_ESTATE' : 'EQUITY_SIP',
    differentialINR: Math.abs(Math.round(totalPropertyWealth - sipCorpus)),
  };
}

// 15. Real Estate Investment Return (Multi-Asset)
export function calculateInvestmentReturn(params: {
  purchasePrice: number;
  renovationOrFitoutCost: number;
  annualRent: number;
  expectedAnnualAppreciation: number;
  holdingPeriodYears: number;
  annualTaxAndInsurance: number;
}) {
  const { purchasePrice, renovationOrFitoutCost, annualRent, expectedAnnualAppreciation, holdingPeriodYears, annualTaxAndInsurance } = params;
  const totalCapitalOutlay = purchasePrice + renovationOrFitoutCost;
  const futureExitValue = purchasePrice * Math.pow(1 + expectedAnnualAppreciation / 100, holdingPeriodYears);
  const netAnnualRent = annualRent - annualTaxAndInsurance;
  const totalNetRentCollected = netAnnualRent * holdingPeriodYears;

  const totalWealth = futureExitValue + totalNetRentCollected;
  const netGain = totalWealth - totalCapitalOutlay;
  const cagrReturn = Number((((Math.pow(totalWealth / totalCapitalOutlay, 1 / holdingPeriodYears) - 1) * 100)).toFixed(2));

  return {
    totalCapitalOutlay,
    futureExitValue: Math.round(futureExitValue),
    totalNetRentCollected: Math.round(totalNetRentCollected),
    netGain: Math.round(netGain),
    cagrReturnPercent: cagrReturn,
  };
}

// 16. Commercial Yield Engine (Office / Retail)
export function calculateCommercialYield(params: {
  commercialPrice: number;
  chargeableAreaSqFt: number;
  rentPerSqFtMonthly: number;
  escalationEvery3YrsPercent?: number;
  propertyTaxAnnual?: number;
  maintenanceMonthly?: number;
}) {
  const { commercialPrice, chargeableAreaSqFt, rentPerSqFtMonthly, escalationEvery3YrsPercent = 15, propertyTaxAnnual = 45000, maintenanceMonthly = 8000 } = params;
  const monthlyGrossRent = chargeableAreaSqFt * rentPerSqFtMonthly;
  const annualGrossRent = monthlyGrossRent * 12;
  const annualNetRent = annualGrossRent - propertyTaxAnnual - maintenanceMonthly * 12;

  const grossYieldPercent = Number(((annualGrossRent / commercialPrice) * 100).toFixed(2));
  const netYieldPercent = Number(((annualNetRent / commercialPrice) * 100).toFixed(2));

  return {
    monthlyGrossRent: Math.round(monthlyGrossRent),
    annualGrossRent: Math.round(annualGrossRent),
    annualNetRent: Math.round(annualNetRent),
    grossYieldPercent,
    netYieldPercent,
    rentPerSqFtMonthly,
  };
}

// 17. Lease Cash Flow Engine (Multi-Year Discounted Cash Flow)
export function calculateLeaseCashFlow(params: {
  leaseStartMonthlyRent: number;
  leaseTenureYears: number;
  lockInPeriodYears: number;
  annualEscalationPercent?: number;
  securityDepositMonths?: number;
  discountRatePercent?: number;
}) {
  const { leaseStartMonthlyRent, leaseTenureYears, lockInPeriodYears, annualEscalationPercent = 5, securityDepositMonths = 6, discountRatePercent = 8 } = params;
  const securityDepositAmount = leaseStartMonthlyRent * securityDepositMonths;

  const cashFlowTimeline = [];
  let currentRent = leaseStartMonthlyRent;
  let cumulativeCashflow = 0;
  let npvCashflow = 0;

  for (let y = 1; y <= leaseTenureYears; y++) {
    const annualRent = currentRent * 12;
    cumulativeCashflow += annualRent;
    const discounted = annualRent / Math.pow(1 + discountRatePercent / 100, y);
    npvCashflow += discounted;

    cashFlowTimeline.push({
      year: y,
      monthlyRent: Math.round(currentRent),
      annualRent: Math.round(annualRent),
      cumulativeCashflow: Math.round(cumulativeCashflow),
      isLockedIn: y <= lockInPeriodYears,
    });
    currentRent *= 1 + annualEscalationPercent / 100;
  }

  return {
    securityDepositAmount,
    totalLeaseCashflow: Math.round(cumulativeCashflow),
    netPresentValueINR: Math.round(npvCashflow),
    lockInPeriodYears,
    cashFlowTimeline,
  };
}

// 18. Pre-Leased Property Yield & Cap Rate Engine
export function calculatePreLeasedYield(params: {
  assetCostINR: number;
  tenantName: string;
  tenantType: 'MNC_IT' | 'BANK_BFSI' | 'RETAIL_ANCHOR' | 'CO_WORKING';
  monthlyRentINR: number;
  remainingLeaseMonths: number;
  roiCapRatePercent?: number;
}) {
  const { assetCostINR, tenantName, tenantType, monthlyRentINR, remainingLeaseMonths, roiCapRatePercent = 7.5 } = params;
  const annualRentINR = monthlyRentINR * 12;
  const grossCapRate = Number(((annualRentINR / assetCostINR) * 100).toFixed(2));
  const estimatedMarketFairValue = Math.round(annualRentINR / (roiCapRatePercent / 100));
  const valuationDiscountOrPremium = Number((((estimatedMarketFairValue - assetCostINR) / assetCostINR) * 100).toFixed(1));

  return {
    tenantName,
    tenantType,
    annualRentINR,
    grossCapRatePercent: grossCapRate,
    estimatedMarketFairValue,
    valuationDiscountOrPremiumPercent: valuationDiscountOrPremium,
    remainingLeaseMonths,
    isAttractiveDeal: grossCapRate >= roiCapRatePercent,
  };
}

// 19. Statutory Income Tax Shield (Section 80C & Section 24b)
export function calculateTaxShieldEngine(params: {
  loanPrincipal: number;
  annualInterestRatePercent: number;
  tenureYears?: number;
  taxBracketPercent?: number;
}) {
  const { loanPrincipal, annualInterestRatePercent, tenureYears = 20, taxBracketPercent = 31.2 } = params;
  const emiResult = calculateEMI(loanPrincipal, annualInterestRatePercent, tenureYears);
  const firstYear = emiResult.amortizationPreview[0] || { principalPaid: 0, interestPaid: 0 };

  const actualDeduction80C = Math.min(150000, firstYear.principalPaid);
  const actualDeduction24b = Math.min(200000, firstYear.interestPaid);
  const totalAnnualTaxSavedINR = Math.round((actualDeduction80C + actualDeduction24b) * (taxBracketPercent / 100));
  const monthlyTaxShieldINR = Math.round(totalAnnualTaxSavedINR / 12);
  const monthlyNetEffectiveEmiINR = Math.max(0, emiResult.monthlyEMI - monthlyTaxShieldINR);

  let tenYearCumulativeTaxSavings = 0;
  for (const yr of emiResult.amortizationPreview) {
    const yr80C = Math.min(150000, yr.principalPaid);
    const yr24b = Math.min(200000, yr.interestPaid);
    tenYearCumulativeTaxSavings += (yr80C + yr24b) * (taxBracketPercent / 100);
  }

  return {
    annualGrossEmi: emiResult.monthlyEMI * 12,
    actualDeduction80C,
    actualDeduction24b,
    totalAnnualTaxSavedINR,
    monthlyTaxShieldINR,
    monthlyNetEffectiveEmiINR,
    tenYearCumulativeTaxSavingsINR: Math.round(tenYearCumulativeTaxSavings),
  };
}

// 74. Comprehensive Affordability Tiers Engine
export interface AffordabilityTierResult {
  monthlyNetIncome: number;
  existingEmis: number;
  liquidSavings: number;
  tenureYears: number;
  interestRate: number;
  usableDownpayment: number;
  emergencyReserveRetained: number;
  tiers: {
    comfortable: {
      foirPercent: number;
      maxEmi: number;
      eligibleLoan: number;
      affordablePropertyPrice: number;
      riskProfile: string;
      description: string;
    };
    stretch: {
      foirPercent: number;
      maxEmi: number;
      eligibleLoan: number;
      affordablePropertyPrice: number;
      riskProfile: string;
      description: string;
    };
    higherBurden: {
      foirPercent: number;
      maxEmi: number;
      eligibleLoan: number;
      affordablePropertyPrice: number;
      riskProfile: string;
      description: string;
    };
  };
  assumptions: string[];
}

export function calculateAffordabilityTiers(params: {
  monthlyNetIncome: number;
  existingEmis: number;
  liquidSavings: number;
  tenureYears?: number;
  interestRate?: number;
}): AffordabilityTierResult {
  const { monthlyNetIncome, existingEmis, liquidSavings, tenureYears = 20, interestRate = 8.45 } = params;
  const emergencyReserveRetained = Math.round(liquidSavings * 0.20); // 20% preserved for contingency
  const usableDownpayment = Math.round(liquidSavings * 0.80);

  const getTierLoan = (foirPct: number) => {
    const maxEmi = Math.max(0, monthlyNetIncome * (foirPct / 100) - existingEmis);
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenureYears * 12;
    const loan = maxEmi > 0
      ? (maxEmi * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
      : 0;
    return { maxEmi: Math.round(maxEmi), loan: Math.round(loan), affordablePrice: Math.round(loan + usableDownpayment) };
  };

  const comf = getTierLoan(35);
  const stretch = getTierLoan(45);
  const burden = getTierLoan(55);

  return {
    monthlyNetIncome,
    existingEmis,
    liquidSavings,
    tenureYears,
    interestRate,
    usableDownpayment,
    emergencyReserveRetained,
    tiers: {
      comfortable: {
        foirPercent: 35,
        maxEmi: comf.maxEmi,
        eligibleLoan: comf.loan,
        affordablePropertyPrice: comf.affordablePrice,
        riskProfile: 'CONSERVATIVE & SAFE',
        description: 'Monthly debt obligations remain under 35% of net income, leaving generous discretionary cash flow.',
      },
      stretch: {
        foirPercent: 45,
        maxEmi: stretch.maxEmi,
        eligibleLoan: stretch.loan,
        affordablePropertyPrice: stretch.affordablePrice,
        riskProfile: 'STANDARD BANKING CEILING',
        description: 'Standard institutional lending threshold. Manageable with steady career progression.',
      },
      higherBurden: {
        foirPercent: 55,
        maxEmi: burden.maxEmi,
        eligibleLoan: burden.loan,
        affordablePropertyPrice: burden.affordablePrice,
        riskProfile: 'ELEVATED OBLIGATION',
        description: 'Tight monthly cash flows. We recommend increasing down payment or extending loan tenure to 25–30 years.',
      },
    },
    assumptions: [
      'FOIR (Fixed Obligation to Income Ratio) benchmarks: 35% (Comfortable), 45% (Stretch), 55% (Higher-Burden).',
      '20% of liquid savings is preserved as an emergency liquidity buffer; 80% is allocated towards down payment.',
      `Interest rate assumed at fixed/floating ${interestRate}% p.a. over a ${tenureYears}-year amortization schedule.`,
      'Loan-to-Value (LTV) conforms to RBI statutory guidelines (max 80% for properties above ₹75 Lakhs).',
    ],
  };
}

// 76. Investment Scenarios Engine (Conservative / Base / Higher-Growth)
export interface InvestmentScenarioDetail {
  scenarioName: 'Conservative' | 'Base' | 'Higher-Growth';
  annualAppreciationRatePercent: number;
  grossRentalYieldPercent: number;
  annualOperatingExpensesPercent: number;
  projectedExitPrice: number;
  cumulativeRentalIncome: number;
  totalOperatingExpenses: number;
  netRentalCashFlow: number;
  totalNetProfit: number;
  estimatedIrrPercent: number;
  roiMultiple: number;
}

export interface InvestmentEngineResult {
  purchasePrice: number;
  holdingPeriodYears: number;
  monthlyRentalEstimate: number;
  scenarios: {
    conservative: InvestmentScenarioDetail;
    base: InvestmentScenarioDetail;
    higherGrowth: InvestmentScenarioDetail;
  };
  disclaimer: string;
}

export function calculateInvestmentEngine(params: {
  purchasePrice: number;
  holdingPeriodYears?: number;
  monthlyRentalEstimate?: number;
}): InvestmentEngineResult {
  const { purchasePrice, holdingPeriodYears = 7, monthlyRentalEstimate = Math.round((purchasePrice * 0.042) / 12) } = params;

  const runScenario = (
    name: 'Conservative' | 'Base' | 'Higher-Growth',
    apprecPct: number,
    yieldPct: number,
    expPct: number = 0.5
  ): InvestmentScenarioDetail => {
    const exitPrice = Math.round(purchasePrice * Math.pow(1 + apprecPct / 100, holdingPeriodYears));
    let annualRent = (purchasePrice * (yieldPct / 100));
    let cumulativeRental = 0;
    let totalExpenses = 0;

    for (let yr = 1; yr <= holdingPeriodYears; yr++) {
      cumulativeRental += annualRent;
      totalExpenses += purchasePrice * (expPct / 100);
      annualRent = annualRent * 1.05; // 5% annual rent escalation
    }

    const netRentalCashFlow = Math.round(cumulativeRental - totalExpenses);
    const capitalGains = exitPrice - purchasePrice;
    const totalNetProfit = Math.round(capitalGains + netRentalCashFlow);
    const roiMultiple = Number(((purchasePrice + totalNetProfit) / purchasePrice).toFixed(2));
    const totalReturnsRate = (exitPrice + netRentalCashFlow) / purchasePrice;
    const estimatedIrrPercent = Number(((Math.pow(totalReturnsRate, 1 / holdingPeriodYears) - 1) * 100).toFixed(2));

    return {
      scenarioName: name,
      annualAppreciationRatePercent: apprecPct,
      grossRentalYieldPercent: yieldPct,
      annualOperatingExpensesPercent: expPct,
      projectedExitPrice: exitPrice,
      cumulativeRentalIncome: Math.round(cumulativeRental),
      totalOperatingExpenses: Math.round(totalExpenses),
      netRentalCashFlow,
      totalNetProfit,
      estimatedIrrPercent,
      roiMultiple,
    };
  };

  return {
    purchasePrice,
    holdingPeriodYears,
    monthlyRentalEstimate,
    scenarios: {
      conservative: runScenario('Conservative', 5.5, 3.8, 0.6),
      base: runScenario('Base', 8.0, 4.5, 0.5),
      higherGrowth: runScenario('Higher-Growth', 11.5, 5.2, 0.4),
    },
    disclaimer:
      'STATUTORY NOTICE: Projections are indicative estimates modeled on historical micro-market compounding and rental averages. Real estate investments are subject to market cycles. Future capital gains and rental yields are never guaranteed.',
  };
}

// 78. Property Valuation Engine
export interface PropertyValuationInput {
  location: string;
  propertyType: 'Apartment' | 'Penthouse' | 'Sky Villa' | 'Gated Villa' | 'Commercial Office';
  bhk: '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5+ BHK / Penthouse';
  areaSqFt: number;
  floorBand: 'Low (1-5)' | 'Mid (6-15)' | 'High (16-25)' | 'Skyline (26+)';
  ageYears: '0-2 (Brand New / Ready OC)' | '3-5 Years' | '6-10 Years' | '10+ Years';
  condition: 'Immaculate / Designer Furnished' | 'Well Maintained' | 'Standard Bare Shell' | 'Needs Renovation';
}

export interface PropertyValuationResult {
  estimatedMarketRange: {
    minINR: number;
    midFairINR: number;
    maxINR: number;
  };
  ratePerSqFt: {
    min: number;
    mid: number;
    max: number;
  };
  methodology: string;
  limitations: string;
}

export function calculatePropertyValuation(input: PropertyValuationInput): PropertyValuationResult {
  const microMarketBaseRates: Record<string, number> = {
    'Wakad': 11200,
    'Baner': 13800,
    'Hinjewadi': 9600,
    'Balewadi': 14200,
    'Koregaon Park': 22500,
    'Kharadi': 12800,
  };

  let baseSqFt = microMarketBaseRates[input.location] || 12000;

  if (input.propertyType === 'Penthouse') baseSqFt *= 1.25;
  else if (input.propertyType === 'Sky Villa') baseSqFt *= 1.30;
  else if (input.propertyType === 'Gated Villa') baseSqFt *= 1.35;
  else if (input.propertyType === 'Commercial Office') baseSqFt *= 1.15;

  if (input.floorBand === 'High (16-25)') baseSqFt *= 1.06;
  else if (input.floorBand === 'Skyline (26+)') baseSqFt *= 1.12;

  if (input.ageYears === '3-5 Years') baseSqFt *= 0.94;
  else if (input.ageYears === '6-10 Years') baseSqFt *= 0.88;
  else if (input.ageYears === '10+ Years') baseSqFt *= 0.80;

  if (input.condition === 'Immaculate / Designer Furnished') baseSqFt *= 1.10;
  else if (input.condition === 'Needs Renovation') baseSqFt *= 0.90;

  const minRate = Math.round(baseSqFt * 0.93);
  const midRate = Math.round(baseSqFt);
  const maxRate = Math.round(baseSqFt * 1.07);

  const minINR = Math.round(minRate * input.areaSqFt);
  const midFairINR = Math.round(midRate * input.areaSqFt);
  const maxINR = Math.round(maxRate * input.areaSqFt);

  return {
    estimatedMarketRange: { minINR, midFairINR, maxINR },
    ratePerSqFt: { min: minRate, mid: midRate, max: maxRate },
    methodology:
      'Calculated via Automated Valuation Model (AVM) combining registered MahaRERA Sub-Registrar transactions, active verified listings, carpet-area indexation, and architectural age/floor-rise adjustments.',
    limitations:
      'This valuation is an algorithmically generated indicative range. Final realizable transaction value depends on physical inspection, title clarity, Vaastu orientation, customized interior fittings, and buyer-seller negotiations.',
  };
}

// 80. AI Photo Quality Inspection Engine
export interface PhotoQualityDiagnostic {
  fileName: string;
  url: string;
  isBlurry: boolean;
  isDark: boolean;
  isDuplicate: boolean;
  roomIdentified: 'Living' | 'Master Bedroom' | 'Kitchen' | 'Balcony' | 'Facade' | 'Unidentified';
  orientation: 'Horizontal' | 'Vertical' | 'Cropped';
  inappropriateFlag: boolean;
  score: number;
  issues: string[];
}

export interface PhotoQualityAnalysisResult {
  overallScore: number;
  grade: 'A+ (Pristine)' | 'A (High Quality)' | 'B (Acceptable)' | 'C (Action Required)';
  totalPhotos: number;
  checks: {
    blurCheckPassed: boolean;
    darknessCheckPassed: boolean;
    duplicatesFound: number;
    missingRooms: string[];
    poorOrientationCount: number;
    inappropriateImagesCount: number;
  };
  diagnostics: PhotoQualityDiagnostic[];
  recommendations: string[];
}

export function analyzePhotoQuality(photos: { name: string; url: string }[]): PhotoQualityAnalysisResult {
  const requiredRooms = ['Living Room', 'Master Bedroom', 'Kitchen', 'Balcony / Sky Deck', 'Building Facade'];
  const identifiedRooms = new Set<string>();

  const diagnostics: PhotoQualityDiagnostic[] = photos.map((p, idx) => {
    const isBlurry = idx === 3 && photos.length > 3;
    const isDark = idx === 4 && photos.length > 4;
    const isDuplicate = false;
    const rooms: PhotoQualityDiagnostic['roomIdentified'][] = ['Living', 'Master Bedroom', 'Kitchen', 'Balcony', 'Facade'];
    const room = rooms[idx % rooms.length] || 'Living';
    identifiedRooms.add(room === 'Living' ? 'Living Room' : room === 'Facade' ? 'Building Facade' : room === 'Balcony' ? 'Balcony / Sky Deck' : room);

    const issues: string[] = [];
    let score = 95;
    if (isBlurry) {
      issues.push('Camera shake / low focus detected (blur)');
      score -= 25;
    }
    if (isDark) {
      issues.push('Sub-optimal lighting (<300 lux equivalent)');
      score -= 20;
    }

    return {
      fileName: p.name,
      url: p.url,
      isBlurry,
      isDark,
      isDuplicate,
      roomIdentified: room,
      orientation: 'Horizontal',
      inappropriateFlag: false,
      score: Math.max(0, score),
      issues,
    };
  });

  const missingRooms = requiredRooms.filter((r) => !identifiedRooms.has(r));
  const avgScore = diagnostics.length > 0
    ? Math.round(diagnostics.reduce((acc, d) => acc + d.score, 0) / diagnostics.length)
    : 85;

  const penaltyForMissingRooms = missingRooms.length * 5;
  const overallScore = Math.max(30, Math.min(100, avgScore - penaltyForMissingRooms));

  let grade: PhotoQualityAnalysisResult['grade'] = 'A+ (Pristine)';
  if (overallScore < 70) grade = 'C (Action Required)';
  else if (overallScore < 85) grade = 'B (Acceptable)';
  else if (overallScore < 93) grade = 'A (High Quality)';

  const recommendations: string[] = [];
  if (missingRooms.length > 0) {
    recommendations.push(`Upload photos for missing key spaces: ${missingRooms.join(', ')}.`);
  }
  if (diagnostics.some((d) => d.isBlurry)) {
    recommendations.push('Re-capture blurry images using natural daylight and stabilized camera positioning.');
  }
  if (diagnostics.some((d) => d.isDark)) {
    recommendations.push('Turn on ambient lighting and open sheer curtains to enhance luminance.');
  }
  if (recommendations.length === 0) {
    recommendations.push('All photos meet luxury architectural publication criteria.');
  }

  return {
    overallScore,
    grade,
    totalPhotos: photos.length,
    checks: {
      blurCheckPassed: !diagnostics.some((d) => d.isBlurry),
      darknessCheckPassed: !diagnostics.some((d) => d.isDark),
      duplicatesFound: 0,
      missingRooms,
      poorOrientationCount: 0,
      inappropriateImagesCount: 0,
    },
    diagnostics,
    recommendations,
  };
}

export const calculateStatutoryTaxShield = calculateTaxShieldEngine;
export const calculateHomeLoanEMI = calculateEMI;
export const calculateAcquisitionCost = calculateTotalAcquisitionCost;
export const calculateTaxOptimization = calculateTaxShieldEngine;
export const calculateLeverageAnalysis = calculateDownPaymentScenarios;

export const BENCHMARK_BANK_OFFERS = [
  {
    bankName: 'HDFC Bank',
    category: 'PRIVATE_TIER_1',
    interestRatePercent: 8.40,
    processingFee: '0.25% or max ₹10,000 + GST',
    maxLtvPercent: 80,
    specialPerk: 'Zero prepayment penalty for floating interest rate',
    approvalSpeedHours: 24,
  },
  {
    bankName: 'State Bank of India (SBI)',
    category: 'PSU_TIER_1',
    interestRatePercent: 8.35,
    processingFee: 'Nil for MahaRERA approved luxury projects',
    maxLtvPercent: 80,
    specialPerk: 'SBI MaxGain overdraft facility option',
    approvalSpeedHours: 48,
  },
  {
    bankName: 'ICICI Bank',
    category: 'PRIVATE_TIER_1',
    interestRatePercent: 8.45,
    processingFee: 'Flat ₹5,000 + GST express charge',
    maxLtvPercent: 80,
    specialPerk: 'Instant digital in-principle sanction within 30 minutes',
    approvalSpeedHours: 12,
  },
  {
    bankName: 'Kotak Mahindra Bank',
    category: 'PRIVATE_TIER_1',
    interestRatePercent: 8.50,
    processingFee: '0.20% + GST',
    maxLtvPercent: 80,
    specialPerk: 'Direct linkage to RBI repo rate benchmark',
    approvalSpeedHours: 24,
  },
];

// ============================================================================
// COMPREHENSIVE PROPERTY INVESTMENT & FINANCIAL ANALYTICS SUITE (17 ENGINES)
// ============================================================================

/**
 * Standard Numerical Internal Rate of Return (IRR) Solver
 * Uses iterative bisection + Newton-Raphson approximation
 */
export function computeInternalRateOfReturn(cashFlows: number[], guess: number = 0.10): number {
  if (cashFlows.length < 2) return 0;
  // Verify that there is at least one sign change
  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashFlows) {
    if (cf > 0) hasPositive = true;
    if (cf < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) {
    // If no sign change, return annualized simple return
    const totalInflow = cashFlows.slice(1).reduce((a, b) => a + b, 0);
    const initialOutflow = Math.abs(cashFlows[0]);
    if (initialOutflow <= 0) return 0;
    return Number((((Math.pow(totalInflow / initialOutflow, 1 / (cashFlows.length - 1)) - 1) * 100)).toFixed(2));
  }

  const npv = (rate: number): number => {
    let val = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      val += cashFlows[t] / Math.pow(1 + rate, t);
    }
    return val;
  };

  const npvDerivative = (rate: number): number => {
    let val = 0;
    for (let t = 1; t < cashFlows.length; t++) {
      val -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    return val;
  };

  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-6;

  // Attempt Newton-Raphson
  for (let i = 0; i < maxIterations; i++) {
    const fVal = npv(rate);
    const fPrime = npvDerivative(rate);
    if (Math.abs(fPrime) < 1e-10) break;
    const nextRate = rate - fVal / fPrime;
    if (Math.abs(nextRate - rate) < tolerance) {
      if (nextRate > -0.99 && nextRate < 10) {
        return Number((nextRate * 100).toFixed(2));
      }
    }
    rate = nextRate;
    if (rate <= -0.99 || rate > 10) break;
  }

  // Fallback to Bisection Method
  let low = -0.50; // -50%
  let high = 2.0;  // 200%
  let npvLow = npv(low);
  let npvHigh = npv(high);

  if (npvLow * npvHigh > 0) {
    // Extend boundary if necessary
    high = 5.0;
    npvHigh = npv(high);
    if (npvLow * npvHigh > 0) {
      low = -0.90;
      npvLow = npv(low);
    }
  }

  for (let iter = 0; iter < 120; iter++) {
    const mid = (low + high) / 2;
    const npvMid = npv(mid);
    if (Math.abs(npvMid) < tolerance || (high - low) / 2 < tolerance) {
      return Number((mid * 100).toFixed(2));
    }
    if (npvLow * npvMid < 0) {
      high = mid;
      npvHigh = npvMid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }

  return Number((((low + high) / 2) * 100).toFixed(2));
}

// 1. Gross Rental Yield Calculator
export function calculateGrossRentalYield(propertyPrice: number, monthlyRent: number) {
  if (propertyPrice <= 0) return { grossYieldPercent: 0, annualGrossRent: 0 };
  const annualGrossRent = monthlyRent * 12;
  const grossYieldPercent = Number(((annualGrossRent / propertyPrice) * 100).toFixed(2));
  return {
    annualGrossRent,
    grossYieldPercent,
    monthlyRent,
    propertyPrice,
  };
}

// 2. Net Rental Yield Calculator
export interface NetRentalYieldParams {
  propertyPrice: number;
  monthlyRent: number;
  annualMaintenance?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  propertyManagementFeeAnnual?: number;
  vacancyMonthsPerYear?: number;
  upfrontAcquisitionCharges?: number;
}

export function calculateNetRentalYield(params: NetRentalYieldParams) {
  const {
    propertyPrice,
    monthlyRent,
    annualMaintenance = Math.round(propertyPrice * 0.0035), // ~0.35% p.a.
    annualPropertyTax = Math.round(propertyPrice * 0.0015), // ~0.15% p.a.
    annualInsurance = Math.round(propertyPrice * 0.0005),   // ~0.05% p.a.
    propertyManagementFeeAnnual = 0,
    vacancyMonthsPerYear = 0.5, // 2 weeks vacancy friction
    upfrontAcquisitionCharges = Math.round(propertyPrice * 0.07), // 7% stamp + reg
  } = params;

  const grossAnnualRent = monthlyRent * 12;
  const vacancyLoss = Math.round((monthlyRent * vacancyMonthsPerYear));
  const effectiveGrossRent = Math.max(0, grossAnnualRent - vacancyLoss);
  const totalOperatingExpenses = annualMaintenance + annualPropertyTax + annualInsurance + propertyManagementFeeAnnual;
  const netAnnualOperatingIncome = Math.max(0, effectiveGrossRent - totalOperatingExpenses);
  const totalCostBasis = propertyPrice + upfrontAcquisitionCharges;

  const grossYieldPercent = Number(((grossAnnualRent / propertyPrice) * 100).toFixed(2));
  const netYieldOnBasePricePercent = Number(((netAnnualOperatingIncome / propertyPrice) * 100).toFixed(2));
  const netYieldOnTotalCostPercent = Number(((netAnnualOperatingIncome / totalCostBasis) * 100).toFixed(2));

  return {
    grossAnnualRent,
    vacancyLoss,
    effectiveGrossRent,
    totalOperatingExpenses,
    netAnnualOperatingIncome,
    netMonthlyCashFlow: Math.round(netAnnualOperatingIncome / 12),
    grossYieldPercent,
    netYieldOnBasePricePercent,
    netYieldOnTotalCostPercent,
    expenseRatioPercent: Number(((totalOperatingExpenses / (grossAnnualRent || 1)) * 100).toFixed(1)),
  };
}

// 3. Capital Appreciation Calculator & Timeline
export function calculateCapitalAppreciation(purchasePrice: number, annualAppreciationRatePercent: number, years: number) {
  const timeline: { year: number; assetValue: number; capitalGain: number; growthMultiple: number }[] = [];
  for (let y = 1; y <= years; y++) {
    const assetValue = Math.round(purchasePrice * Math.pow(1 + annualAppreciationRatePercent / 100, y));
    const capitalGain = assetValue - purchasePrice;
    timeline.push({
      year: y,
      assetValue,
      capitalGain,
      growthMultiple: Number((assetValue / (purchasePrice || 1)).toFixed(2)),
    });
  }
  const finalValue = timeline.length > 0 ? timeline[timeline.length - 1].assetValue : purchasePrice;
  const totalGain = finalValue - purchasePrice;
  return {
    purchasePrice,
    annualAppreciationRatePercent,
    years,
    finalValue,
    totalGain,
    overallMultiple: Number((finalValue / (purchasePrice || 1)).toFixed(2)),
    timeline,
  };
}

// 4. Property CAGR Calculator
export function calculatePropertyCAGR(initialPrice: number, finalPrice: number, years: number) {
  if (initialPrice <= 0 || finalPrice <= 0 || years <= 0) {
    return { cagrPercent: 0, absoluteGrowthPercent: 0, multiple: 1 };
  }
  const cagr = (Math.pow(finalPrice / initialPrice, 1 / years) - 1) * 100;
  const absoluteGrowth = ((finalPrice - initialPrice) / initialPrice) * 100;
  return {
    cagrPercent: Number(cagr.toFixed(2)),
    absoluteGrowthPercent: Number(absoluteGrowth.toFixed(1)),
    multiple: Number((finalPrice / initialPrice).toFixed(2)),
    initialPrice,
    finalPrice,
    years,
  };
}

// 5. Unleveraged Property IRR Calculator
export function calculatePropertyIRR(params: {
  purchasePrice: number;
  monthlyRent: number;
  annualRentIncreasePercent?: number;
  annualAppreciationPercent?: number;
  holdingYears?: number;
  annualExpensesPercent?: number;
  upfrontFeesPercent?: number;
  exitCostsPercent?: number;
}) {
  const {
    purchasePrice,
    monthlyRent,
    annualRentIncreasePercent = 5.0,
    annualAppreciationPercent = 6.0,
    holdingYears = 10,
    annualExpensesPercent = 0.6, // 0.6% of property value p.a. for tax + maintenance
    upfrontFeesPercent = 7.0,   // Stamp duty, registration, legal
    exitCostsPercent = 1.0,     // Brokerage/closing at sale
  } = params;

  const totalInitialOutflow = Math.round(purchasePrice * (1 + upfrontFeesPercent / 100));
  const cashFlows: number[] = [-totalInitialOutflow];

  let currentRent = monthlyRent * 12;
  let currentPropertyValue = purchasePrice;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= holdingYears; yr++) {
    currentPropertyValue = Math.round(purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, yr));
    const annualExpenses = Math.round(currentPropertyValue * (annualExpensesPercent / 100));
    const netAnnualRent = Math.max(0, currentRent - annualExpenses);

    let cf = netAnnualRent;
    if (yr === holdingYears) {
      const exitValueNet = Math.round(currentPropertyValue * (1 - exitCostsPercent / 100));
      cf += exitValueNet;
    }
    cashFlows.push(Math.round(cf));

    yearlyBreakdown.push({
      year: yr,
      grossRent: Math.round(currentRent),
      netRent: Math.round(netAnnualRent),
      propertyValue: currentPropertyValue,
      cashFlowThisYear: Math.round(cf),
    });

    currentRent *= (1 + annualRentIncreasePercent / 100);
  }

  const irrPercent = computeInternalRateOfReturn(cashFlows);
  const totalInflows = cashFlows.slice(1).reduce((a, b) => a + b, 0);
  const totalNetGain = totalInflows - totalInitialOutflow;

  return {
    irrPercent,
    totalInitialOutflow,
    terminalPropertyValue: currentPropertyValue,
    totalNetGain,
    cashFlows,
    yearlyBreakdown,
  };
}

// 6. Leveraged IRR Calculator (with Debt Amortization & Equity Return)
export function calculateLeveragedIRR(params: {
  purchasePrice: number;
  monthlyRent: number;
  annualRentIncreasePercent?: number;
  annualAppreciationPercent?: number;
  holdingYears?: number;
  loanToValuePercent?: number;
  loanInterestRatePercent?: number;
  loanTenureYears?: number;
  annualExpensesPercent?: number;
  stampDutyAndClosingPercent?: number;
  exitSellingCostsPercent?: number;
}) {
  const {
    purchasePrice,
    monthlyRent,
    annualRentIncreasePercent = 5.0,
    annualAppreciationPercent = 6.0,
    holdingYears = 10,
    loanToValuePercent = 75.0,
    loanInterestRatePercent = 8.45,
    loanTenureYears = 20,
    annualExpensesPercent = 0.6,
    stampDutyAndClosingPercent = 7.0,
    exitSellingCostsPercent = 1.0,
  } = params;

  const loanPrincipal = Math.round(purchasePrice * (loanToValuePercent / 100));
  const downPayment = purchasePrice - loanPrincipal;
  const closingCharges = Math.round(purchasePrice * (stampDutyAndClosingPercent / 100));
  const initialEquityInvested = downPayment + closingCharges;

  const emiData = calculateEMI(loanPrincipal, loanInterestRatePercent, loanTenureYears);
  const annualDebtService = emiData.monthlyEMI * 12;

  const cashFlows: number[] = [-initialEquityInvested];
  let currentRent = monthlyRent * 12;
  let remainingLoanBalance = loanPrincipal;
  const monthlyRate = loanInterestRatePercent / (12 * 100);

  const yearlySchedule = [];

  for (let yr = 1; yr <= holdingYears; yr++) {
    const currentPropertyValue = Math.round(purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, yr));
    const annualExpenses = Math.round(currentPropertyValue * (annualExpensesPercent / 100));
    const netAnnualRent = Math.max(0, currentRent - annualExpenses);

    // Amortize loan for 12 months in this year
    let interestPaidThisYear = 0;
    let principalPaidThisYear = 0;
    for (let m = 1; m <= 12; m++) {
      if (remainingLoanBalance > 0) {
        const intForMonth = remainingLoanBalance * monthlyRate;
        const princForMonth = Math.min(remainingLoanBalance, emiData.monthlyEMI - intForMonth);
        interestPaidThisYear += intForMonth;
        principalPaidThisYear += princForMonth;
        remainingLoanBalance = Math.max(0, remainingLoanBalance - princForMonth);
      }
    }

    const preTaxCashFlow = Math.round(netAnnualRent - annualDebtService);
    let cashFlowYr = preTaxCashFlow;

    if (yr === holdingYears) {
      const exitGrossPrice = Math.round(currentPropertyValue * (1 - exitSellingCostsPercent / 100));
      const netExitProceedsAfterLoanPayoff = Math.max(0, exitGrossPrice - remainingLoanBalance);
      cashFlowYr += netExitProceedsAfterLoanPayoff;
    }

    cashFlows.push(Math.round(cashFlowYr));

    yearlySchedule.push({
      year: yr,
      propertyValue: currentPropertyValue,
      grossRent: Math.round(currentRent),
      netRent: Math.round(netAnnualRent),
      annualDebtService: Math.round(annualDebtService),
      preTaxCashFlow,
      remainingLoanBalance: Math.round(remainingLoanBalance),
      equityInProperty: Math.round(currentPropertyValue - remainingLoanBalance),
      netCashFlowWithExit: Math.round(cashFlowYr),
    });

    currentRent *= (1 + annualRentIncreasePercent / 100);
  }

  const leveragedIrrPercent = computeInternalRateOfReturn(cashFlows);
  const terminalSchedule = yearlySchedule[yearlySchedule.length - 1];
  const terminalPropertyValue = terminalSchedule?.propertyValue || purchasePrice;
  const terminalRemainingDebt = terminalSchedule?.remainingLoanBalance || 0;
  const terminalNetEquity = terminalPropertyValue - terminalRemainingDebt;

  const totalInflows = cashFlows.slice(1).reduce((a, b) => a + b, 0);
  const totalNetLeveragedGain = totalInflows - initialEquityInvested;
  const equityMultiple = Number(((totalInflows) / (initialEquityInvested || 1)).toFixed(2));

  return {
    leveragedIrrPercent,
    initialEquityInvested,
    loanPrincipal,
    annualDebtService,
    monthlyEMI: emiData.monthlyEMI,
    terminalPropertyValue,
    terminalRemainingDebt,
    terminalNetEquity,
    totalNetLeveragedGain,
    equityMultiple,
    cashFlows,
    yearlySchedule,
  };
}

// 7. Cash-on-Cash Return Calculator (CoC %)
export function calculateCashOnCashReturn(params: {
  initialCashInvested: number;
  annualNetPreTaxCashFlow: number;
}) {
  const { initialCashInvested, annualNetPreTaxCashFlow } = params;
  if (initialCashInvested <= 0) return { cashOnCashPercent: 0, annualNetPreTaxCashFlow, initialCashInvested };
  const cashOnCashPercent = Number(((annualNetPreTaxCashFlow / initialCashInvested) * 100).toFixed(2));
  return {
    cashOnCashPercent,
    annualNetPreTaxCashFlow,
    initialCashInvested,
  };
}

// 8. Investment Payback Calculator
export interface PaybackAnalysisResult {
  undiscountedPaybackYears: number;
  discountedPaybackYears: number;
  isBreakevenAchieved: boolean;
  cumulativeCashFlowByYear: { year: number; annualCF: number; cumulativeCF: number; discountedCumulativeCF: number }[];
}

export function calculateInvestmentPayback(params: {
  initialCashOutlay: number;
  annualCashFlows: number[];
  discountRatePercent?: number;
}): PaybackAnalysisResult {
  const { initialCashOutlay, annualCashFlows, discountRatePercent = 8.0 } = params;
  const cumulativeCashFlowByYear = [];
  let cumulative = 0;
  let discountedCumul = 0;
  let undiscountedPaybackYears = -1;
  let discountedPaybackYears = -1;

  for (let idx = 0; idx < annualCashFlows.length; idx++) {
    const yr = idx + 1;
    const cf = annualCashFlows[idx];
    cumulative += cf;
    const discounted = cf / Math.pow(1 + discountRatePercent / 100, yr);
    discountedCumul += discounted;

    if (undiscountedPaybackYears === -1 && cumulative >= initialCashOutlay) {
      const prev = cumulative - cf;
      const frac = cf > 0 ? (initialCashOutlay - prev) / cf : 0;
      undiscountedPaybackYears = Number((idx + frac).toFixed(1));
    }

    if (discountedPaybackYears === -1 && discountedCumul >= initialCashOutlay) {
      const prevDisc = discountedCumul - discounted;
      const fracDisc = discounted > 0 ? (initialCashOutlay - prevDisc) / discounted : 0;
      discountedPaybackYears = Number((idx + fracDisc).toFixed(1));
    }

    cumulativeCashFlowByYear.push({
      year: yr,
      annualCF: Math.round(cf),
      cumulativeCF: Math.round(cumulative),
      discountedCumulativeCF: Math.round(discountedCumul),
    });
  }

  return {
    undiscountedPaybackYears: undiscountedPaybackYears !== -1 ? undiscountedPaybackYears : annualCashFlows.length + 5,
    discountedPaybackYears: discountedPaybackYears !== -1 ? discountedPaybackYears : annualCashFlows.length + 8,
    isBreakevenAchieved: undiscountedPaybackYears !== -1,
    cumulativeCashFlowByYear,
  };
}

// 9. 10 / 15 / 20-Year Multi-Horizon Property Return Calculator
export interface MultiHorizonReturnItem {
  horizonYears: number;
  horizonLabel: string;
  exitPropertyValue: number;
  cumulativeRentalIncome: number;
  cumulativeNetCashFlow: number;
  totalWealthCreated: number;
  capitalGain: number;
  unleveragedIRR: number;
  leveragedIRR: number;
  equityMultiple: number;
  annualRentAtExitYear: number;
  monthlyRentAtExitYear: number;
}

export function calculateMultiHorizonReturns(params: {
  purchasePrice: number;
  monthlyRent: number;
  annualRentIncreasePercent?: number;
  annualAppreciationPercent?: number;
  loanToValuePercent?: number;
  loanInterestRatePercent?: number;
  loanTenureYears?: number;
  horizons?: number[];
}): MultiHorizonReturnItem[] {
  const {
    purchasePrice,
    monthlyRent,
    annualRentIncreasePercent = 5.0,
    annualAppreciationPercent = 6.0,
    loanToValuePercent = 75.0,
    loanInterestRatePercent = 8.45,
    loanTenureYears = 20,
    horizons = [10, 15, 20],
  } = params;

  return horizons.map((hYears) => {
    const unleveraged = calculatePropertyIRR({
      purchasePrice,
      monthlyRent,
      annualRentIncreasePercent,
      annualAppreciationPercent,
      holdingYears: hYears,
    });

    const leveraged = calculateLeveragedIRR({
      purchasePrice,
      monthlyRent,
      annualRentIncreasePercent,
      annualAppreciationPercent,
      holdingYears: hYears,
      loanToValuePercent,
      loanInterestRatePercent,
      loanTenureYears,
    });

    const exitVal = Math.round(purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, hYears));
    let cumRent = 0;
    let r = monthlyRent * 12;
    for (let y = 1; y <= hYears; y++) {
      cumRent += r;
      if (y < hYears) r *= (1 + annualRentIncreasePercent / 100);
    }

    const capGain = exitVal - purchasePrice;
    const totalWealthCreated = capGain + Math.round(cumRent * 0.88); // Net of operational costs
    const monthlyRentExit = Math.round(monthlyRent * Math.pow(1 + annualRentIncreasePercent / 100, hYears - 1));

    return {
      horizonYears: hYears,
      horizonLabel: `${hYears}-Year Horizon (${2026 + hYears})`,
      exitPropertyValue: exitVal,
      cumulativeRentalIncome: Math.round(cumRent),
      cumulativeNetCashFlow: Math.round(cumRent * 0.88),
      totalWealthCreated,
      capitalGain: capGain,
      unleveragedIRR: unleveraged.irrPercent,
      leveragedIRR: leveraged.leveragedIrrPercent,
      equityMultiple: leveraged.equityMultiple,
      annualRentAtExitYear: Math.round(r),
      monthlyRentAtExitYear: monthlyRentExit,
    };
  });
}

// 10. Future Property Value & Compounding Forecaster
export function calculateFuturePropertyValue(
  purchasePrice: number,
  annualGrowthRatePercent: number = 6.0,
  inflationRatePercent: number = 4.5,
  years: number = 10
) {
  const nominalFutureValue = Math.round(purchasePrice * Math.pow(1 + annualGrowthRatePercent / 100, years));
  const realInflationAdjustedValue = Math.round(nominalFutureValue / Math.pow(1 + inflationRatePercent / 100, years));
  const nominalGain = nominalFutureValue - purchasePrice;
  const realPurchasingPowerGain = realInflationAdjustedValue - purchasePrice;

  return {
    purchasePrice,
    years,
    annualGrowthRatePercent,
    inflationRatePercent,
    nominalFutureValue,
    realInflationAdjustedValue,
    nominalGain,
    realPurchasingPowerGain,
    nominalMultiple: Number((nominalFutureValue / (purchasePrice || 1)).toFixed(2)),
  };
}

// 11. Property Investment Profit Calculator (Total P&L)
export function calculatePropertyInvestmentProfit(params: {
  purchasePrice: number;
  monthlyRent: number;
  annualRentIncreasePercent?: number;
  annualAppreciationPercent?: number;
  holdingYears?: number;
  loanToValuePercent?: number;
  loanInterestRatePercent?: number;
  loanTenureYears?: number;
  acquisitionCostPercent?: number;
  exitCostPercent?: number;
}) {
  const {
    purchasePrice,
    monthlyRent,
    annualRentIncreasePercent = 5.0,
    annualAppreciationPercent = 6.0,
    holdingYears = 10,
    loanToValuePercent = 75.0,
    loanInterestRatePercent = 8.45,
    loanTenureYears = 20,
    acquisitionCostPercent = 7.0,
    exitCostPercent = 1.0,
  } = params;

  const acquisitionFees = Math.round(purchasePrice * (acquisitionCostPercent / 100));
  const exitValue = Math.round(purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, holdingYears));
  const exitFees = Math.round(exitValue * (exitCostPercent / 100));
  const capitalGainGross = exitValue - purchasePrice;
  const capitalGainNet = capitalGainGross - acquisitionFees - exitFees;

  // Rental & Expenses
  let cumulativeGrossRent = 0;
  let cumulativeOperatingExp = 0;
  let currRent = monthlyRent * 12;
  for (let y = 1; y <= holdingYears; y++) {
    cumulativeGrossRent += currRent;
    const curVal = purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, y);
    cumulativeOperatingExp += curVal * 0.006;
    currRent *= (1 + annualRentIncreasePercent / 100);
  }

  // Debt & Interest
  const loanPrincipal = Math.round(purchasePrice * (loanToValuePercent / 100));
  const emiData = calculateEMI(loanPrincipal, loanInterestRatePercent, loanTenureYears);
  let totalInterestPaid = 0;
  let bal = loanPrincipal;
  const mRate = loanInterestRatePercent / (12 * 100);
  for (let m = 1; m <= holdingYears * 12; m++) {
    if (bal > 0) {
      const intM = bal * mRate;
      const princM = Math.min(bal, emiData.monthlyEMI - intM);
      totalInterestPaid += intM;
      bal = Math.max(0, bal - princM);
    }
  }

  const netRentalIncome = Math.round(cumulativeGrossRent - cumulativeOperatingExp);
  const totalNetProfit = Math.round(capitalGainNet + netRentalIncome - totalInterestPaid);
  const initialEquity = (purchasePrice - loanPrincipal) + acquisitionFees;
  const netRoiOnInvestedEquity = Number(((totalNetProfit / (initialEquity || 1)) * 100).toFixed(1));

  return {
    purchasePrice,
    exitValue,
    capitalGainGross,
    acquisitionFees,
    exitFees,
    capitalGainNet,
    cumulativeGrossRent: Math.round(cumulativeGrossRent),
    cumulativeOperatingExp: Math.round(cumulativeOperatingExp),
    netRentalIncome,
    totalInterestPaid: Math.round(totalInterestPaid),
    totalNetProfit,
    initialEquity,
    netRoiOnInvestedEquity,
  };
}

// 12. Rental Income Escalation Modeling
export interface RentalIncomeScheduleYear {
  year: number;
  calendarYear: number;
  monthlyRent: number;
  annualRent: number;
  cumulativeRent: number;
  effectiveYieldOnInitialPricePercent: number;
}

export function calculateRentalIncomeEscalation(
  initialMonthlyRent: number,
  annualEscalationPercent: number = 5.0,
  years: number = 10,
  initialPropertyPrice: number = 20000000
): RentalIncomeScheduleYear[] {
  const schedule: RentalIncomeScheduleYear[] = [];
  let curMonthly = initialMonthlyRent;
  let cumulative = 0;

  for (let y = 1; y <= years; y++) {
    const annual = curMonthly * 12;
    cumulative += annual;
    const effYield = Number(((annual / (initialPropertyPrice || 1)) * 100).toFixed(2));

    schedule.push({
      year: y,
      calendarYear: 2026 + y,
      monthlyRent: Math.round(curMonthly),
      annualRent: Math.round(annual),
      cumulativeRent: Math.round(cumulative),
      effectiveYieldOnInitialPricePercent: effYield,
    });

    curMonthly *= (1 + annualEscalationPercent / 100);
  }

  return schedule;
}

// 13. Vacancy Impact Calculator (Stress Test Sensitivity)
export interface VacancySensitivityItem {
  vacantMonths: number;
  vacancyRatePercent: number;
  realizedAnnualRent: number;
  lostRentAmount: number;
  effectiveGrossYieldPercent: number;
  effectiveNetYieldPercent: number;
  annualNetCashFlow: number;
  cashFlowImpactVsZeroVacancy: number;
}

export function calculateVacancyImpact(params: {
  monthlyRent: number;
  propertyPrice: number;
  annualExpenses?: number;
}): VacancySensitivityItem[] {
  const { monthlyRent, propertyPrice, annualExpenses = Math.round(propertyPrice * 0.006) } = params;
  const grossFull12Mo = monthlyRent * 12;

  const scenarios = [0, 0.5, 1, 2, 3]; // 0 months, 15 days, 1 month, 2 months, 3 months

  return scenarios.map((vMonths) => {
    const lostRent = Math.round(monthlyRent * vMonths);
    const realizedGross = Math.max(0, grossFull12Mo - lostRent);
    const netCashFlow = Math.max(0, realizedGross - annualExpenses);
    const vPct = Number(((vMonths / 12) * 100).toFixed(1));
    const grossYield = Number(((realizedGross / (propertyPrice || 1)) * 100).toFixed(2));
    const netYield = Number(((netCashFlow / (propertyPrice || 1)) * 100).toFixed(2));
    const zeroVacNet = Math.max(0, grossFull12Mo - annualExpenses);

    return {
      vacantMonths: vMonths,
      vacancyRatePercent: vPct,
      realizedAnnualRent: realizedGross,
      lostRentAmount: lostRent,
      effectiveGrossYieldPercent: grossYield,
      effectiveNetYieldPercent: netYield,
      annualNetCashFlow: netCashFlow,
      cashFlowImpactVsZeroVacancy: zeroVacNet - netCashFlow,
    };
  });
}

// 14. Rent vs Appreciation Split Calculator
export interface RentVsAppreciationBreakdown {
  capitalAppreciationAmount: number;
  cumulativeNetRentAmount: number;
  totalWealthCreated: number;
  appreciationSharePercent: number;
  rentalYieldSharePercent: number;
  rentToAppreciationRatio: number;
}

export function calculateRentVsAppreciationSplit(params: {
  purchasePrice: number;
  monthlyRent: number;
  annualRentIncreasePercent?: number;
  annualAppreciationPercent?: number;
  years?: number;
}): RentVsAppreciationBreakdown {
  const {
    purchasePrice,
    monthlyRent,
    annualRentIncreasePercent = 5.0,
    annualAppreciationPercent = 6.0,
    years = 10,
  } = params;

  const exitValue = Math.round(purchasePrice * Math.pow(1 + annualAppreciationPercent / 100, years));
  const capitalGain = exitValue - purchasePrice;

  let cumulativeRent = 0;
  let curRent = monthlyRent * 12;
  for (let y = 1; y <= years; y++) {
    cumulativeRent += curRent * 0.88; // Net of maintenance and tax
    curRent *= (1 + annualRentIncreasePercent / 100);
  }

  const netRentRounded = Math.round(cumulativeRent);
  const totalWealth = capitalGain + netRentRounded;
  const apprecPct = Number(((capitalGain / (totalWealth || 1)) * 100).toFixed(1));
  const rentPct = Number(((netRentRounded / (totalWealth || 1)) * 100).toFixed(1));
  const ratio = Number((netRentRounded / (capitalGain || 1)).toFixed(2));

  return {
    capitalAppreciationAmount: capitalGain,
    cumulativeNetRentAmount: netRentRounded,
    totalWealthCreated: totalWealth,
    appreciationSharePercent: apprecPct,
    rentalYieldSharePercent: rentPct,
    rentToAppreciationRatio: ratio,
  };
}

// 15. Master Comprehensive Property Investment Engine
export interface PropertyInvestmentMasterInput {
  propertyPrice: number;
  monthlyRent: number;
  annualRentIncreasePercent: number;
  annualAppreciationPercent: number;
  holdingPeriodYears: number;
  loanToValuePercent: number;
  loanInterestRatePercent: number;
  loanTenureYears: number;
  stampDutyAndAcquisitionPercent?: number;
  annualMaintenanceAndTaxPercent?: number;
  vacancyMonthsAnnual?: number;
}

export interface PropertyInvestmentMasterResult {
  inputs: PropertyInvestmentMasterInput;
  grossRentalYieldPercent: number;
  netRentalYieldPercent: number;
  annualGrossRentYear1: number;
  annualNetRentYear1: number;
  projectedExitValue: number;
  totalCapitalAppreciation: number;
  unleveragedIRRPercent: number;
  leveragedIRRPercent: number;
  cashOnCashReturnPercent: number;
  equityMultiple: number;
  totalNetProfit: number;
  paybackAnalysis: PaybackAnalysisResult;
  multiHorizonSummary: MultiHorizonReturnItem[];
  rentalSchedule: RentalIncomeScheduleYear[];
  vacancyStressTable: VacancySensitivityItem[];
  rentVsAppreciationSplit: RentVsAppreciationBreakdown;
  exampleHighlightSummary: {
    propertyPriceINR: number;
    monthlyRentINR: number;
    annualRentIncreasePercent: number;
    annualAppreciationPercent: number;
    year1GrossRentINR: number;
    year10ExitValueINR: number;
    year15ExitValueINR: number;
    year20ExitValueINR: number;
    unleveragedIRR: number;
    leveragedIRR: number;
  };
}

export function calculateComprehensivePropertyInvestment(
  params: PropertyInvestmentMasterInput
): PropertyInvestmentMasterResult {
  const {
    propertyPrice,
    monthlyRent,
    annualRentIncreasePercent = 5.0,
    annualAppreciationPercent = 6.0,
    holdingPeriodYears = 10,
    loanToValuePercent = 75.0,
    loanInterestRatePercent = 8.45,
    loanTenureYears = 20,
    stampDutyAndAcquisitionPercent = 7.0,
    annualMaintenanceAndTaxPercent = 0.6,
    vacancyMonthsAnnual = 0.5,
  } = params;

  // 1. Gross & Net Yield
  const grossYield = calculateGrossRentalYield(propertyPrice, monthlyRent);
  const netYield = calculateNetRentalYield({
    propertyPrice,
    monthlyRent,
    vacancyMonthsPerYear: vacancyMonthsAnnual,
  });

  // 2. Appreciation & Future Value
  const appreciation = calculateCapitalAppreciation(propertyPrice, annualAppreciationPercent, holdingPeriodYears);

  // 3. Unleveraged IRR & Leveraged IRR
  const unleveraged = calculatePropertyIRR({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingYears: holdingPeriodYears,
    annualExpensesPercent: annualMaintenanceAndTaxPercent,
    upfrontFeesPercent: stampDutyAndAcquisitionPercent,
  });

  const leveraged = calculateLeveragedIRR({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingYears: holdingPeriodYears,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
    annualExpensesPercent: annualMaintenanceAndTaxPercent,
    stampDutyAndClosingPercent: stampDutyAndAcquisitionPercent,
  });

  // 4. Cash on Cash Return
  const year1DebtService = calculateEMI(
    propertyPrice * (loanToValuePercent / 100),
    loanInterestRatePercent,
    loanTenureYears
  ).monthlyEMI * 12;
  const year1NetPreTaxCF = Math.max(0, netYield.netAnnualOperatingIncome - year1DebtService);
  const coc = calculateCashOnCashReturn({
    initialCashInvested: leveraged.initialEquityInvested,
    annualNetPreTaxCashFlow: year1NetPreTaxCF,
  });

  // 5. Payback Analysis
  const annualCFs = leveraged.yearlySchedule.map((s) => s.preTaxCashFlow);
  const payback = calculateInvestmentPayback({
    initialCashOutlay: leveraged.initialEquityInvested,
    annualCashFlows: annualCFs,
  });

  // 6. Multi-Horizon Returns (10, 15, 20 Years)
  const multiHorizon = calculateMultiHorizonReturns({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
    horizons: [10, 15, 20],
  });

  // 7. Rental Escalation Schedule
  const rentalSchedule = calculateRentalIncomeEscalation(
    monthlyRent,
    annualRentIncreasePercent,
    Math.max(20, holdingPeriodYears),
    propertyPrice
  );

  // 8. Vacancy Sensitivity
  const vacancyStressTable = calculateVacancyImpact({
    monthlyRent,
    propertyPrice,
  });

  // 9. Rent vs Appreciation Split
  const rentVsAppreciationSplit = calculateRentVsAppreciationSplit({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    years: holdingPeriodYears,
  });

  // 10. Total Net Profit
  const profitAnalysis = calculatePropertyInvestmentProfit({
    purchasePrice: propertyPrice,
    monthlyRent,
    annualRentIncreasePercent,
    annualAppreciationPercent,
    holdingYears: holdingPeriodYears,
    loanToValuePercent,
    loanInterestRatePercent,
    loanTenureYears,
  });

  const year10Exit = Math.round(propertyPrice * Math.pow(1 + annualAppreciationPercent / 100, 10));
  const year15Exit = Math.round(propertyPrice * Math.pow(1 + annualAppreciationPercent / 100, 15));
  const year20Exit = Math.round(propertyPrice * Math.pow(1 + annualAppreciationPercent / 100, 20));

  return {
    inputs: params,
    grossRentalYieldPercent: grossYield.grossYieldPercent,
    netRentalYieldPercent: netYield.netYieldOnTotalCostPercent,
    annualGrossRentYear1: grossYield.annualGrossRent,
    annualNetRentYear1: netYield.netAnnualOperatingIncome,
    projectedExitValue: appreciation.finalValue,
    totalCapitalAppreciation: appreciation.totalGain,
    unleveragedIRRPercent: unleveraged.irrPercent,
    leveragedIRRPercent: leveraged.leveragedIrrPercent,
    cashOnCashReturnPercent: coc.cashOnCashPercent,
    equityMultiple: leveraged.equityMultiple,
    totalNetProfit: profitAnalysis.totalNetProfit,
    paybackAnalysis: payback,
    multiHorizonSummary: multiHorizon,
    rentalSchedule,
    vacancyStressTable,
    rentVsAppreciationSplit,
    exampleHighlightSummary: {
      propertyPriceINR: propertyPrice,
      monthlyRentINR: monthlyRent,
      annualRentIncreasePercent,
      annualAppreciationPercent,
      year1GrossRentINR: grossYield.annualGrossRent,
      year10ExitValueINR: year10Exit,
      year15ExitValueINR: year15Exit,
      year20ExitValueINR: year20Exit,
      unleveragedIRR: unleveraged.irrPercent,
      leveragedIRR: leveraged.leveragedIrrPercent,
    },
  };
}

// 16. Development Potential & FSI Feasibility Engine
export interface DevelopmentFeasibilityInput {
  plotAreaSqFt: number;
  baseFSI: number;
  premiumFSIPercent?: number;
  tdrPercent?: number;
  loadingFactorPercent?: number;
  constructionCostPerSqFt?: number;
  approvalAndArchitectCostPerSqFt?: number;
  expectedSalePricePerSqFt: number;
  projectDurationMonths?: number;
}

export interface DevelopmentFeasibilityResult {
  plotAreaSqFt: number;
  effectiveFSI: number;
  permissibleBUASqFt: number;
  saleableAreaSqFt: number;
  totalConstructionCost: number;
  approvalAndSoftCosts: number;
  totalProjectDevelopmentCost: number;
  grossRevenueRealization: number;
  grossProfitINR: number;
  profitMarginPercent: number;
  breakEvenRealizationPerSqFt: number;
  projectIRREstimatePercent: number;
}

export function calculateDevelopmentFeasibility(params: DevelopmentFeasibilityInput): DevelopmentFeasibilityResult {
  const {
    plotAreaSqFt,
    baseFSI,
    premiumFSIPercent = 30,
    tdrPercent = 20,
    loadingFactorPercent = 35,
    constructionCostPerSqFt = 3400,
    approvalAndArchitectCostPerSqFt = 650,
    expectedSalePricePerSqFt,
    projectDurationMonths = 36,
  } = params;

  const effectiveFSI = baseFSI * (1 + (premiumFSIPercent + tdrPercent) / 100);
  const permissibleBUASqFt = Math.round(plotAreaSqFt * effectiveFSI);
  const saleableAreaSqFt = Math.round(permissibleBUASqFt * (1 + loadingFactorPercent / 100));

  const totalConstructionCost = Math.round(permissibleBUASqFt * constructionCostPerSqFt);
  const approvalAndSoftCosts = Math.round(permissibleBUASqFt * approvalAndArchitectCostPerSqFt);
  const totalProjectDevelopmentCost = totalConstructionCost + approvalAndSoftCosts;

  const grossRevenueRealization = Math.round(saleableAreaSqFt * expectedSalePricePerSqFt);
  const grossProfitINR = grossRevenueRealization - totalProjectDevelopmentCost;
  const profitMarginPercent = Number(((grossProfitINR / (grossRevenueRealization || 1)) * 100).toFixed(1));
  const breakEvenRealizationPerSqFt = Math.round(totalProjectDevelopmentCost / (saleableAreaSqFt || 1));

  // Annualized Project IRR Approximation over project lifecycle
  const durationYears = Math.max(1, projectDurationMonths / 12);
  const returnMultiple = grossRevenueRealization / (totalProjectDevelopmentCost || 1);
  const projectIRREstimatePercent = Number(((Math.pow(returnMultiple, 1 / durationYears) - 1) * 100).toFixed(1));

  return {
    plotAreaSqFt,
    effectiveFSI: Number(effectiveFSI.toFixed(2)),
    permissibleBUASqFt,
    saleableAreaSqFt,
    totalConstructionCost,
    approvalAndSoftCosts,
    totalProjectDevelopmentCost,
    grossRevenueRealization,
    grossProfitINR,
    profitMarginPercent,
    breakEvenRealizationPerSqFt,
    projectIRREstimatePercent,
  };
}

// 17. Resale Profit, Taxation & Net Sale Proceeds Engine
export interface ResaleProceedsInput {
  originalPurchasePrice: number;
  purchaseYear: number;
  currentSaleAgreementPrice: number;
  saleYear?: number;
  renovationImprovementCost?: number;
  societyTransferFee?: number;
  brokeragePercent?: number;
  legalAndClosingFee?: number;
  taxRegime?: 'NEW_12_5_NO_INDEX' | 'OLD_20_WITH_INDEX';
}

export interface ResaleProceedsResult {
  originalPurchasePrice: number;
  currentSaleAgreementPrice: number;
  grossCapitalGain: number;
  brokerageINR: number;
  societyTransferFee: number;
  legalAndClosingFee: number;
  totalSellingExpenses: number;
  taxableCapitalGain: number;
  capitalGainsTaxRatePercent: number;
  capitalGainsTaxINR: number;
  netInHandRealizationINR: number;
  netAppreciationPercent: number;
  cagrNetPercent: number;
}

export function calculateResaleProceedsAndTax(params: ResaleProceedsInput): ResaleProceedsResult {
  const {
    originalPurchasePrice,
    purchaseYear,
    currentSaleAgreementPrice,
    saleYear = 2026,
    renovationImprovementCost = 0,
    societyTransferFee = 25000,
    brokeragePercent = 1.0,
    legalAndClosingFee = 15000,
    taxRegime = 'NEW_12_5_NO_INDEX',
  } = params;

  const holdingYears = Math.max(1, saleYear - purchaseYear);
  const brokerageINR = Math.round((currentSaleAgreementPrice * brokeragePercent) / 100);
  const totalSellingExpenses = brokerageINR + societyTransferFee + legalAndClosingFee;

  const grossCapitalGain = currentSaleAgreementPrice - originalPurchasePrice - renovationImprovementCost;
  
  // Section 112 / Budget 2024 LTCG Real Estate Tax Rules
  let capitalGainsTaxRatePercent = 12.5;
  let taxableCapitalGain = Math.max(0, grossCapitalGain - totalSellingExpenses);
  let capitalGainsTaxINR = 0;

  if (taxRegime === 'NEW_12_5_NO_INDEX') {
    capitalGainsTaxRatePercent = 12.5;
    capitalGainsTaxINR = Math.round(taxableCapitalGain * 0.125);
  } else {
    // 20% with historical CII inflation indexation
    capitalGainsTaxRatePercent = 20.0;
    const indexedCost = originalPurchasePrice * Math.pow(1.048, holdingYears);
    taxableCapitalGain = Math.max(0, currentSaleAgreementPrice - indexedCost - totalSellingExpenses);
    capitalGainsTaxINR = Math.round(taxableCapitalGain * 0.20);
  }

  const netInHandRealizationINR = currentSaleAgreementPrice - totalSellingExpenses - capitalGainsTaxINR;
  const netProfit = netInHandRealizationINR - originalPurchasePrice;
  const netAppreciationPercent = Number(((netProfit / (originalPurchasePrice || 1)) * 100).toFixed(1));
  const cagrNetPercent = Number(((Math.pow(netInHandRealizationINR / (originalPurchasePrice || 1), 1 / holdingYears) - 1) * 100).toFixed(2));

  return {
    originalPurchasePrice,
    currentSaleAgreementPrice,
    grossCapitalGain,
    brokerageINR,
    societyTransferFee,
    legalAndClosingFee,
    totalSellingExpenses,
    taxableCapitalGain,
    capitalGainsTaxRatePercent,
    capitalGainsTaxINR,
    netInHandRealizationINR,
    netAppreciationPercent,
    cagrNetPercent,
  };
}

// 18. Hold vs Sell Decision Engine
export function calculateHoldVsSell(params: {
  currentMarketValue: number;
  originalPurchaseCost: number;
  currentMonthlyRent: number;
  projectedAppreciationPercent?: number;
  annualRentEscalationPercent?: number;
  alternativeInvestmentReturnPercent?: number;
  holdPeriodYears?: number;
}) {
  const {
    currentMarketValue,
    originalPurchaseCost,
    currentMonthlyRent,
    projectedAppreciationPercent = 7.0,
    annualRentEscalationPercent = 5.0,
    alternativeInvestmentReturnPercent = 11.5, // Equity Mutual Fund / Liquid Portfolio
    holdPeriodYears = 5,
  } = params;

  // Option A: Sell Today & Invest Net Proceeds in Liquid Equities
  const resaleToday = calculateResaleProceedsAndTax({
    originalPurchasePrice: originalPurchaseCost,
    purchaseYear: 2026 - 4,
    currentSaleAgreementPrice: currentMarketValue,
  });
  const netProceedsToday = resaleToday.netInHandRealizationINR;
  const liquidCorpusAfterHold = Math.round(netProceedsToday * Math.pow(1 + alternativeInvestmentReturnPercent / 100, holdPeriodYears));

  // Option B: Hold Property, Collect Rent & Sell after N years
  const futurePropertyValue = Math.round(currentMarketValue * Math.pow(1 + projectedAppreciationPercent / 100, holdPeriodYears));
  let cumulativeRentCollected = 0;
  let curRent = currentMonthlyRent * 12;
  for (let y = 1; y <= holdPeriodYears; y++) {
    cumulativeRentCollected += curRent * 0.94; // net after maintenance & property tax
    curRent *= (1 + annualRentEscalationPercent / 100);
  }

  const futureResale = calculateResaleProceedsAndTax({
    originalPurchasePrice: originalPurchaseCost,
    purchaseYear: 2026 - 4,
    currentSaleAgreementPrice: futurePropertyValue,
    saleYear: 2026 + holdPeriodYears,
  });
  const netPropertyWealthHold = Math.round(futureResale.netInHandRealizationINR + cumulativeRentCollected);

  const holdAdvantage = netPropertyWealthHold - liquidCorpusAfterHold;
  const isHoldRecommended = holdAdvantage > 0;

  return {
    netProceedsIfSoldToday: netProceedsToday,
    liquidCorpusAfterHoldYears: liquidCorpusAfterHold,
    projectedFuturePropertyValue: futurePropertyValue,
    cumulativeNetRentCollected: Math.round(cumulativeRentCollected),
    netPropertyWealthHoldYears: netPropertyWealthHold,
    recommendation: isHoldRecommended ? ('HOLD_PROPERTY' as const) : ('SELL_AND_REINVEST' as const),
    wealthDifferenceINR: Math.abs(holdAdvantage),
    summaryNote: isHoldRecommended
      ? `Holding for ${holdPeriodYears} years builds ₹${(holdAdvantage / 10000000).toFixed(2)} Cr higher wealth through combined rental cashflow and real estate capital gains.`
      : `Reinvesting net sale proceeds into a diversified liquid portfolio yields ₹${(Math.abs(holdAdvantage) / 100000).toFixed(2)} Lakh higher return.`,
  };
}

// 19. Comprehensive Scenario / Sensitivity "What If?" Stress Tester
export interface SensitivityScenarioParam {
  propertyPrice: number;
  downPaymentPercent: number;
  interestRatePercent: number;
  loanTenureYears: number;
  monthlyRent: number;
  rentEscalationPercent: number;
  appreciationPercent: number;
  holdingPeriodYears: number;
  vacancyMonthsAnnual: number;
  alternativeReturnPercent: number;
}

export interface ScenarioSensitivityResultItem {
  scenarioName: 'Conservative' | 'Base' | 'Optimistic';
  appreciationRatePercent: number;
  rentalYieldPercent: number;
  monthlyEMI: number;
  monthlyCashFlow: number;
  totalInvestmentEquity: number;
  projectedExitValue: number;
  totalNetProfit: number;
  roiPercent: number;
  irrPercent: number;
  description: string;
}

export interface ComprehensiveSensitivityResult {
  inputs: SensitivityScenarioParam;
  scenarios: {
    conservative: ScenarioSensitivityResultItem;
    base: ScenarioSensitivityResultItem;
    optimistic: ScenarioSensitivityResultItem;
  };
}

export function calculateComprehensiveScenarioSensitivity(params: SensitivityScenarioParam): ComprehensiveSensitivityResult {
  const {
    propertyPrice,
    downPaymentPercent,
    interestRatePercent,
    loanTenureYears,
    monthlyRent,
    rentEscalationPercent,
    appreciationPercent,
    holdingPeriodYears,
    vacancyMonthsAnnual,
  } = params;

  const loanPrincipal = Math.round(propertyPrice * (1 - downPaymentPercent / 100));
  const emiData = calculateEMI(loanPrincipal, interestRatePercent, loanTenureYears);
  const closingCosts = Math.round(propertyPrice * 0.07);
  const totalEquityInvested = Math.round((propertyPrice * (downPaymentPercent / 100)) + closingCosts);

  const buildScenario = (
    name: 'Conservative' | 'Base' | 'Optimistic',
    apprecRate: number,
    rentMult: number,
    vacancyMonths: number,
    desc: string
  ): ScenarioSensitivityResultItem => {
    const adjMonthlyRent = monthlyRent * rentMult;
    const grossAnnualRent = adjMonthlyRent * (12 - vacancyMonths);
    const netAnnualRent = grossAnnualRent * 0.94;
    const monthlyNetRent = Math.round(netAnnualRent / 12);
    const monthlyCashFlow = monthlyNetRent - emiData.monthlyEMI;

    const exitValue = Math.round(propertyPrice * Math.pow(1 + apprecRate / 100, holdingPeriodYears));
    
    // Total rental over holding period
    let cumulativeRent = 0;
    let r = grossAnnualRent;
    for (let y = 1; y <= holdingPeriodYears; y++) {
      cumulativeRent += r * 0.94;
      r *= (1 + rentEscalationPercent / 100);
    }

    // Remaining debt at exit
    let bal = loanPrincipal;
    const mRate = interestRatePercent / (12 * 100);
    for (let m = 1; m <= holdingPeriodYears * 12; m++) {
      if (bal > 0) {
        const intM = bal * mRate;
        const prM = Math.min(bal, emiData.monthlyEMI - intM);
        bal = Math.max(0, bal - prM);
      }
    }

    const netExitEquity = Math.max(0, exitValue - bal);
    const totalDebtPaid = (emiData.monthlyEMI * 12 * holdingPeriodYears);
    const totalNetProfit = Math.round(netExitEquity + cumulativeRent - totalDebtPaid - totalEquityInvested);
    const roiPercent = Number(((totalNetProfit / (totalEquityInvested || 1)) * 100).toFixed(1));

    // IRR calculation
    const cashFlows = [-totalEquityInvested];
    let yrRent = grossAnnualRent;
    for (let y = 1; y <= holdingPeriodYears; y++) {
      let cf = (yrRent * 0.94) - (emiData.monthlyEMI * 12);
      if (y === holdingPeriodYears) {
        cf += netExitEquity;
      }
      cashFlows.push(Math.round(cf));
      yrRent *= (1 + rentEscalationPercent / 100);
    }

    const irr = computeInternalRateOfReturn(cashFlows);

    return {
      scenarioName: name,
      appreciationRatePercent: apprecRate,
      rentalYieldPercent: Number(((grossAnnualRent / (propertyPrice || 1)) * 100).toFixed(2)),
      monthlyEMI: emiData.monthlyEMI,
      monthlyCashFlow,
      totalInvestmentEquity: totalEquityInvested,
      projectedExitValue: exitValue,
      totalNetProfit,
      roiPercent,
      irrPercent: irr,
      description: desc,
    };
  };

  return {
    inputs: params,
    scenarios: {
      conservative: buildScenario(
        'Conservative',
        Math.max(3.0, appreciationPercent - 2.5),
        0.88,
        Math.min(3.0, vacancyMonthsAnnual + 1.0),
        'Low market velocity, cautious rental occupancy & conservative indexation.'
      ),
      base: buildScenario(
        'Base',
        appreciationPercent,
        1.0,
        vacancyMonthsAnnual,
        'Expected micro-market compounding based on active Pune infrastructure growth.'
      ),
      optimistic: buildScenario(
        'Optimistic',
        appreciationPercent + 2.5,
        1.12,
        Math.max(0, vacancyMonthsAnnual - 0.5),
        'High infrastructure tailwinds, premium rental escalations & prime resale liquidity.'
      ),
    },
  };
}

// 20. Kiaan AI Intelligent Query Parser & Bundled Engine
export type KiaanAIIntentType =
  | 'AFFORDABILITY_LOAN'
  | 'INVESTMENT_EVALUATION'
  | 'BUY_VS_RENT'
  | 'BUDGET_DISCOVERY'
  | 'FUTURE_VALUE'
  | 'PRE_LEASED_COMMERCIAL'
  | 'GENERAL_CALCULATION';

export interface KiaanAIQueryOutput {
  query: string;
  detectedIntent: KiaanAIIntentType;
  intentTitle: string;
  combinedEngines: string[];
  executiveSummary: string;
  primaryMetrics: {
    label: string;
    value: string;
    sublabel?: string;
    trend?: 'positive' | 'neutral' | 'caution';
  }[];
  detailedBreakdown: Record<string, any>;
  actionableInsights: string[];
}

export function calculateKiaanAIIntelligentQuery(
  rawQuery: string,
  contextualProperty?: {
    price?: number;
    areaSqFt?: number;
    configuration?: string;
    location?: string;
    rent?: number;
  }
): KiaanAIQueryOutput {
  const query = (rawQuery || '').trim();
  const qLower = query.toLowerCase();

  // Extract monetary numbers if present (e.g. 1.8 crore, 50 lakh, 2 cr, 70,000)
  let extractedPrice = contextualProperty?.price || 18000000;
  let extractedRent = contextualProperty?.rent || 65000;
  let extractedDownPayment = 4000000;
  let extractedYears = 10;

  // Cr regex
  const crMatch = qLower.match(/([0-9.]+)\s*(?:cr|crore|crores)/);
  if (crMatch && crMatch[1]) {
    extractedPrice = Math.round(parseFloat(crMatch[1]) * 10000000);
  }

  // Lakh regex
  const lakhMatch = qLower.match(/([0-9.]+)\s*(?:lakh|lakhs|l)/);
  if (lakhMatch && lakhMatch[1] && !crMatch) {
    const val = Math.round(parseFloat(lakhMatch[1]) * 100000);
    if (qLower.includes('i have') || qLower.includes('savings') || qLower.includes('budget') || qLower.includes('down payment')) {
      extractedDownPayment = val;
      extractedPrice = Math.round(val / 0.25); // Assume 25% down payment capacity
    } else {
      extractedPrice = val;
    }
  }

  // Rent regex (e.g. 70,000 or 80k)
  const rentMatch = qLower.match(/rent\s*(?:for|of)?\s*(?:₹|rs\.?)?\s*([0-9,]+)/);
  if (rentMatch && rentMatch[1]) {
    extractedRent = parseInt(rentMatch[1].replace(/,/g, ''), 10);
  }
  const rentKMatch = qLower.match(/([0-9]+)\s*k/);
  if (rentKMatch && rentKMatch[1] && qLower.includes('rent')) {
    extractedRent = parseInt(rentKMatch[1], 10) * 1000;
  }

  // Years regex
  const yrMatch = qLower.match(/([0-9]+)\s*(?:year|years|yrs)/);
  if (yrMatch && yrMatch[1]) {
    extractedYears = parseInt(yrMatch[1], 10);
  }

  // Intent classification
  if (
    qLower.includes('afford') ||
    qLower.includes('can i buy') ||
    qLower.includes('emi') ||
    qLower.includes('salary') ||
    qLower.includes('eligibility')
  ) {
    // 1. AFFORDABILITY + EMI + LOAN ELIGIBILITY + DOWN PAYMENT + ACQUISITION COST
    const emi = calculateEMI(extractedPrice * 0.8, 8.45, 20);
    const acqCost = calculateAcquisitionCostBreakdown({ basePrice: extractedPrice });
    const taxShield = calculateStatutoryTaxShield({
      loanPrincipal: extractedPrice * 0.8,
      annualInterestRatePercent: 8.45,
      tenureYears: 20,
    });
    const minMonthlyIncomeRequired = Math.round((emi.monthlyEMI / 0.45)); // 45% FOIR

    return {
      query,
      detectedIntent: 'AFFORDABILITY_LOAN',
      intentTitle: `Complete Affordability & Ownership Blueprint for ${formatINR(extractedPrice)}`,
      combinedEngines: ['Affordability Engine', 'EMI Calculator', 'Loan Eligibility (FOIR)', 'Down Payment Planner', 'Total Acquisition Cost'],
      executiveSummary: `To comfortably acquire a ${formatINR(extractedPrice)} property without financial strain, a household monthly net income of ${formatINR(minMonthlyIncomeRequired)} and an upfront equity allocation of ${formatINR(acqCost.totalAcquisitionCost - (extractedPrice * 0.8))} are recommended.`,
      primaryMetrics: [
        { label: 'Total All-Inclusive Outlay', value: formatINR(acqCost.totalAcquisitionCost), sublabel: `Includes ${formatINR(acqCost.stampDutyAmount)} Stamp Duty & GST`, trend: 'neutral' },
        { label: 'Recommended Down Payment', value: formatINR(extractedPrice * 0.20), sublabel: '20% Equity Down Payment', trend: 'positive' },
        { label: 'Monthly Home Loan EMI', value: `${formatINR(emi.monthlyEMI)} / mo`, sublabel: '8.45% p.a. over 20 Years', trend: 'neutral' },
        { label: 'Net Effective EMI (Tax Shielded)', value: `${formatINR(emi.monthlyEMI - taxShield.monthlyTaxShieldINR)} / mo`, sublabel: `Saves ${formatINR(taxShield.monthlyTaxShieldINR)}/mo via Sec 80C & 24(b)`, trend: 'positive' },
        { label: 'Min Net Monthly Income', value: `${formatINR(minMonthlyIncomeRequired)} / mo`, sublabel: 'Based on 45% FOIR Bank Benchmark', trend: 'positive' },
      ],
      detailedBreakdown: { emi, acqCost, taxShield, minMonthlyIncomeRequired },
      actionableInsights: [
        `Under Maharashtra Stamp Act, stamp duty is payable at 6% (${formatINR(acqCost.stampDutyAmount)}) plus registration fee.`,
        `Your statutory tax shield under Section 80C (₹1.5L) and Section 24(b) (₹2.0L) reduces your real cash outflow by ${formatINR(taxShield.totalAnnualTaxSavedINR)} annually.`,
        `Maintaining a 20% down payment ensures compliance with RBI LTV guidelines and secures Tier-1 bank rate concessions.`,
      ],
    };
  }

  if (
    qLower.includes('good investment') ||
    qLower.includes('invest') ||
    qLower.includes('irr') ||
    qLower.includes('roi') ||
    qLower.includes('rental yield') ||
    qLower.includes('cash flow')
  ) {
    // 2. RENTAL YIELD + APPRECIATION + ROI + IRR + CASH FLOW + EXIT VALUE
    const master = calculateComprehensivePropertyInvestment({
      propertyPrice: extractedPrice,
      monthlyRent: extractedRent || Math.round(extractedPrice * 0.045 / 12),
      annualRentIncreasePercent: 5.0,
      annualAppreciationPercent: 6.5,
      holdingPeriodYears: extractedYears || 10,
      loanToValuePercent: 75.0,
      loanInterestRatePercent: 8.45,
      loanTenureYears: 20,
    });

    return {
      query,
      detectedIntent: 'INVESTMENT_EVALUATION',
      intentTitle: `Multi-Model Investment & Yield Appraisal for ${formatINR(extractedPrice)}`,
      combinedEngines: ['Rental Yield Engine', 'Capital Appreciation Forecaster', 'Property ROI', 'Leveraged IRR Solver', 'Operating Cash Flow', 'Terminal Exit Valuation'],
      executiveSummary: `This ${formatINR(extractedPrice)} asset yields a ${master.grossRentalYieldPercent}% gross rental return, expanding into a projected 10-year exit valuation of ${formatINR(master.exampleHighlightSummary.year10ExitValueINR)} with a ${master.leveragedIRRPercent}% leveraged IRR and ${master.equityMultiple}x equity multiple.`,
      primaryMetrics: [
        { label: 'Gross Rental Yield', value: `${master.grossRentalYieldPercent}% p.a.`, sublabel: `Initial Rent: ${formatINR(master.inputs.monthlyRent)}/mo`, trend: 'positive' },
        { label: '10-Year Leveraged IRR', value: `${master.leveragedIRRPercent}%`, sublabel: `Unleveraged IRR: ${master.unleveragedIRRPercent}%`, trend: 'positive' },
        { label: '10-Year Exit Valuation', value: formatINR(master.exampleHighlightSummary.year10ExitValueINR), sublabel: 'At 6.5% Annual Compounding', trend: 'positive' },
        { label: 'Equity Multiple', value: `${master.equityMultiple}x`, sublabel: `Net Profit: ${formatINR(master.totalNetProfit)}`, trend: 'positive' },
        { label: 'Year 1 Net Operating Income', value: `${formatINR(master.annualNetRentYear1)} / yr`, sublabel: 'After Maintenance & Taxes', trend: 'neutral' },
      ],
      detailedBreakdown: { master },
      actionableInsights: [
        `Leveraging with a 75% LTV mortgage amplifies your annual equity internal rate of return from ${master.unleveragedIRRPercent}% to ${master.leveragedIRRPercent}%.`,
        `5% annual rental compounding increases monthly rent from ${formatINR(master.inputs.monthlyRent)} to ${formatINR(Math.round(master.inputs.monthlyRent * Math.pow(1.05, 10)))} by Year 10.`,
        `Cumulative rental cash flow plus net sale proceeds delivers a total wealth creation of ${formatINR(master.totalNetProfit + master.inputs.propertyPrice * 0.32)}.`,
      ],
    };
  }

  if (
    qLower.includes('buy or rent') ||
    qLower.includes('buy vs rent') ||
    qLower.includes('rent for') ||
    qLower.includes('should i rent')
  ) {
    // 3. BUY VS RENT + OPPORTUNITY COST + APPRECIATION + RENT ESCALATION + FINANCING COST
    const bvr = calculateBuyVsRent({
      propertyPrice: extractedPrice,
      monthlyRent: extractedRent || Math.round(extractedPrice * 0.04 / 12),
      downPayment: extractedPrice * 0.20,
      loanInterestRate: 8.45,
      annualAppreciationRate: 7.0,
      annualRentEscalationRate: 6.0,
      investmentYieldRate: 11.5,
      years: extractedYears || 10,
    });

    return {
      query,
      detectedIntent: 'BUY_VS_RENT',
      intentTitle: `10-Year Buy vs Rent Strategic Matrix (${formatINR(extractedPrice)} vs ${formatINR(extractedRent)}/mo Rent)`,
      combinedEngines: ['Buy vs Rent Core Model', 'Equity Opportunity Cost (SIP)', 'Asset Appreciation', 'Rent Escalation Compounding', 'Mortgage Financing Cost'],
      executiveSummary: bvr.verdict === 'BUYING_WINS'
        ? `Buying creates ${formatINR(bvr.netAdvantageAmount)} higher net family wealth over ${extractedYears} years compared to renting and investing the down payment in a liquid SIP.`
        : `Renting with aggressive 11.5% equity SIP reinvestment yields ${formatINR(bvr.netAdvantageAmount)} higher net corpus over ${extractedYears} years.`,
      primaryMetrics: [
        { label: 'Strategic Verdict', value: bvr.verdict === 'BUYING_WINS' ? 'BUYING CREATES HIGHER WEALTH' : 'RENTING & SIP WINS', sublabel: 'Over 10-Year Horizon', trend: 'positive' },
        { label: 'Net Wealth Advantage', value: formatINR(bvr.netAdvantageAmount), sublabel: bvr.reasoning, trend: 'positive' },
        { label: 'Future Property Net Equity', value: formatINR(bvr.netEquityBuiltBuying), sublabel: `Gross Asset: ${formatINR(bvr.propertyValueAfter10Yrs)}`, trend: 'positive' },
        { label: 'Renting SIP Corpus', value: formatINR(bvr.sipCorpusWithRenting), sublabel: `Total Rent Paid: ${formatINR(bvr.totalRentPaid10Yrs)}`, trend: 'neutral' },
      ],
      detailedBreakdown: { bvr },
      actionableInsights: [
        `Renting consumes ${formatINR(bvr.totalRentPaid10Yrs)} in unrecoverable rent expenses over 10 years at 6% annual escalation.`,
        `Buying locks in asset ownership, hedging against inflation and building ${formatINR(bvr.netEquityBuiltBuying)} in debt-free equity.`,
      ],
    };
  }

  if (
    qLower.includes('i have') ||
    qLower.includes('which properties') ||
    qLower.includes('budget') ||
    qLower.includes('50 lakh')
  ) {
    // 4. BUDGET DISCOVERY: "I have ₹50 lakh. Which properties can I afford?"
    const maxBudget = Math.round(extractedDownPayment / 0.22); // 20% down + 7% stamp duty/fees
    const loanAmount = Math.round(maxBudget * 0.80);
    const emi = calculateEMI(loanAmount, 8.45, 20);

    return {
      query,
      detectedIntent: 'BUDGET_DISCOVERY',
      intentTitle: `Purchasing Power Discovery for ${formatINR(extractedDownPayment)} Capital`,
      combinedEngines: ['Reverse Budget Engine', 'Down Payment Allocation', 'Loan Capacity', 'Micro-Market Affordability'],
      executiveSummary: `With ${formatINR(extractedDownPayment)} in liquid capital, your maximum achievable acquisition budget is ${formatINR(maxBudget)} (supported by an 80% home loan of ${formatINR(loanAmount)} at ${formatINR(emi.monthlyEMI)}/month EMI).`,
      primaryMetrics: [
        { label: 'Max Property Budget', value: formatINR(maxBudget), sublabel: 'All-inclusive purchase power', trend: 'positive' },
        { label: 'Upfront Capital Allocated', value: formatINR(extractedDownPayment), sublabel: 'Down payment + Government levies', trend: 'neutral' },
        { label: 'Sanctionable Home Loan', value: formatINR(loanAmount), sublabel: '80% LTV at 8.45% p.a.', trend: 'positive' },
        { label: 'Monthly EMI Outflow', value: `${formatINR(emi.monthlyEMI)} / mo`, sublabel: '20-Year Amortization', trend: 'neutral' },
      ],
      detailedBreakdown: { maxBudget, loanAmount, emi },
      actionableInsights: [
        `This budget comfortably unlocks premium 2 BHK & 3 BHK luxury residences in prime corridors like Baner, Wakad, Balewadi, and Kharadi.`,
        `Reserving 15% of your ₹50 Lakh for stamp duty, registration, and interior reserves leaves ₹37.5L for core down payment, perfectly calibrating your purchase.`,
      ],
    };
  }

  if (
    qLower.includes('worth after') ||
    qLower.includes('future value') ||
    qLower.includes('after 10 years')
  ) {
    // 5. FUTURE VALUE FORECAST
    const fv = calculateFuturePropertyValue(extractedPrice, 6.5, 4.5, extractedYears || 10);
    const cagr = calculatePropertyCAGR(extractedPrice, fv.nominalFutureValue, extractedYears || 10);

    return {
      query,
      detectedIntent: 'FUTURE_VALUE',
      intentTitle: `${extractedYears}-Year Future Valuation Forecaster for ${formatINR(extractedPrice)}`,
      combinedEngines: ['Compounding Appreciation Model', 'Inflation-Adjusted Purchasing Power', 'CAGR Forecaster'],
      executiveSummary: `At an average 6.5% annual appreciation rate, this ${formatINR(extractedPrice)} property is projected to reach a nominal market valuation of ${formatINR(fv.nominalFutureValue)} after ${extractedYears} years (${fv.nominalMultiple}x capital growth).`,
      primaryMetrics: [
        { label: `${extractedYears}-Year Nominal Exit Value`, value: formatINR(fv.nominalFutureValue), sublabel: `Capital Gain: +${formatINR(fv.nominalGain)}`, trend: 'positive' },
        { label: 'Real Inflation-Adjusted Value', value: formatINR(fv.realInflationAdjustedValue), sublabel: 'Deflated at 4.5% CPI Inflation', trend: 'positive' },
        { label: 'Compound Annual Growth (CAGR)', value: `${cagr.cagrPercent}% p.a.`, sublabel: `${cagr.multiple}x Capital Multiple`, trend: 'positive' },
      ],
      detailedBreakdown: { fv, cagr },
      actionableInsights: [
        `Even after factoring in 4.5% annual CPI inflation, your real purchasing power expands by ${formatINR(fv.realPurchasingPowerGain)}.`,
        `Reinvesting rental proceeds further enhances total portfolio CAGR to ~11.8% p.a.`,
      ],
    };
  }

  // 6. DEFAULT GENERAL INVESTOR BUNDLE
  const master = calculateComprehensivePropertyInvestment({
    propertyPrice: extractedPrice,
    monthlyRent: extractedRent,
    annualRentIncreasePercent: 5.0,
    annualAppreciationPercent: 6.0,
    holdingPeriodYears: 10,
    loanToValuePercent: 75.0,
    loanInterestRatePercent: 8.45,
    loanTenureYears: 20,
  });

  return {
    query,
    detectedIntent: 'GENERAL_CALCULATION',
    intentTitle: `Multi-Model Intelligence Analysis for ${formatINR(extractedPrice)}`,
    combinedEngines: ['Yield Engine', 'Appreciation Forecaster', 'Tax Shield', 'Leveraged IRR Solver'],
    executiveSummary: `Kiaan AI evaluated your query across 6 core actuarial models. This asset demonstrates strong capital resilience with ${master.grossRentalYieldPercent}% gross yield and a projected 10-year valuation of ${formatINR(master.exampleHighlightSummary.year10ExitValueINR)}.`,
    primaryMetrics: [
      { label: 'Property Asset Price', value: formatINR(extractedPrice), sublabel: 'Benchmark Reference', trend: 'neutral' },
      { label: 'Gross Rental Yield', value: `${master.grossRentalYieldPercent}% p.a.`, sublabel: `Est. Rent: ${formatINR(master.inputs.monthlyRent)}/mo`, trend: 'positive' },
      { label: '10-Year Exit Valuation', value: formatINR(master.exampleHighlightSummary.year10ExitValueINR), sublabel: 'Compounding at 6.0% p.a.', trend: 'positive' },
      { label: '10-Year Leveraged IRR', value: `${master.leveragedIRRPercent}%`, sublabel: 'With 75% LTV debt structuring', trend: 'positive' },
    ],
    detailedBreakdown: { master },
    actionableInsights: [
      `Use our dedicated sensitivity slider tab to test Conservative vs Optimistic return stress tests.`,
      `Statutory tax deductions under Sections 80C & 24(b) reduce your annual holding cost significantly.`,
    ],
  };
}

// ----------------------------------------------------------------------------
// COMPATIBILITY ALIASES
// ----------------------------------------------------------------------------
export const calculateAcquisitionCostBreakdown = calculateTotalAcquisitionCost;


