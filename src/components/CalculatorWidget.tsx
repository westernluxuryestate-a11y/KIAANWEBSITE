/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  Percent,
  TrendingUp,
  Zap,
  Home,
  Sliders,
  Scale,
  Building,
} from 'lucide-react';
import {
  formatINR,
  calculateEMI,
  calculateAffordabilityTiers,
  calculateBuyVsRent,
  calculateRentalYield,
  calculateInvestmentEngine,
  calculateTaxShieldEngine,
  calculatePropertyValuation,
  PropertyValuationInput,
} from '../services/calculatorEngine';

export type CalculatorTab =
  | 'AFFORDABILITY'
  | 'ACQUISITION_COST'
  | 'INVESTMENT_SCENARIOS'
  | 'BUY_VS_RENT'
  | 'VALUATION'
  | 'EMI'
  | 'TAX_SHIELD'
  | 'RENTAL_YIELD';

export const CalculatorWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('AFFORDABILITY');

  // Universal Inputs
  const [propertyPrice, setPropertyPrice] = useState<number>(15000000); // 1.5 Cr default
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.45);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(300000); // 3 Lakhs net/mo
  const [existingEmis, setExistingEmis] = useState<number>(25000);
  const [liquidSavings, setLiquidSavings] = useState<number>(4500000);
  const [monthlyRent, setMonthlyRent] = useState<number>(45000);
  const [rentEscalationPercent, setRentEscalationPercent] = useState<number>(5.0);
  const [propertyAppreciationPercent, setPropertyAppreciationPercent] = useState<number>(8.0);
  const [sipReturnPercent, setSipReturnPercent] = useState<number>(12.0);
  const [holdingPeriodYears, setHoldingPeriodYears] = useState<number>(7);

  // Acquisition Cost specific inputs (75)
  const [parkingCharges, setParkingCharges] = useState<number>(400000);
  const [floorNumber, setFloorNumber] = useState<number>(12);
  const [floorRisePerFloor] = useState<number>(25000);
  const [isGstExempt, setIsGstExempt] = useState<boolean>(false);
  const [isWomenOwnership, setIsWomenOwnership] = useState<boolean>(false);
  const [advanceMaintenanceYears] = useState<number>(1);
  const [legalDocumentationFee] = useState<number>(35000);

  // Property Valuation Inputs (78)
  const [valLocation, setValLocation] = useState<string>('Baner');
  const [valPropertyType, setValPropertyType] = useState<PropertyValuationInput['propertyType']>('Apartment');
  const [valBhk, setValBhk] = useState<PropertyValuationInput['bhk']>('3 BHK');
  const [valAreaSqFt, setValAreaSqFt] = useState<number>(1450);
  const [valFloorBand, setValFloorBand] = useState<PropertyValuationInput['floorBand']>('High (16-25)');
  const [valAge, setValAge] = useState<PropertyValuationInput['ageYears']>('0-2 (Brand New / Ready OC)');
  const [valCondition, setValCondition] = useState<PropertyValuationInput['condition']>('Immaculate / Designer Furnished');

  // Calculations
  const loanPrincipal = propertyPrice * (1 - downPaymentPercent / 100);
  const emiResult = calculateEMI(loanPrincipal, interestRate, tenureYears);
  
  // 74: Affordability 3-Tier Engine
  const affordabilityTiersResult = calculateAffordabilityTiers({
    monthlyNetIncome: monthlyIncome,
    existingEmis,
    liquidSavings,
    tenureYears,
    interestRate,
  });

  // 75: Total Cost Calculator (Transparent, no hidden charges)
  const floorRiseTotal = Math.max(0, (floorNumber - 1) * floorRisePerFloor);
  const adjustedBaseAgreement = propertyPrice + parkingCharges + floorRiseTotal;
  const gstRate = isGstExempt ? 0 : 0.05;
  const stampDutyRate = isWomenOwnership ? 0.06 : 0.07; // Maharashtra: 7% general vs 6% women
  const gstAmount = Math.round(adjustedBaseAgreement * gstRate);
  const stampDutyAmount = Math.round(adjustedBaseAgreement * stampDutyRate);
  const registrationFee = Math.min(30000, Math.round(adjustedBaseAgreement * 0.01));
  const maintenanceReserve = Math.round(1450 * 4.5 * 12 * advanceMaintenanceYears); // avg ₹4.5/sqft/mo
  const totalEstimatedAcquisition = adjustedBaseAgreement + gstAmount + stampDutyAmount + registrationFee + maintenanceReserve + legalDocumentationFee;

  // 76: Investment Engine (Conservative, Base, Higher-growth)
  const investmentEngineResult = calculateInvestmentEngine({
    purchasePrice: propertyPrice,
    holdingPeriodYears,
    monthlyRentalEstimate: monthlyRent,
  });

  // 77: Buy vs Rent
  const buyVsRentResult = calculateBuyVsRent({
    propertyPrice,
    monthlyRent,
    downPayment: propertyPrice * (downPaymentPercent / 100),
  });

  // 78: Valuation
  const valuationResult = calculatePropertyValuation({
    location: valLocation,
    propertyType: valPropertyType,
    bhk: valBhk,
    areaSqFt: valAreaSqFt,
    floorBand: valFloorBand,
    ageYears: valAge,
    condition: valCondition,
  });

  const rentalYieldResult = calculateRentalYield({ propertyPrice, monthlyRentalIncome: monthlyRent });
  const taxShieldResult = calculateTaxShieldEngine({ loanPrincipal, annualInterestRatePercent: interestRate });

  const calculatorTabs: { id: CalculatorTab; label: string; icon: any; category: string }[] = [
    { id: 'AFFORDABILITY', label: '74. Affordability Engine', icon: Scale, category: 'CORE' },
    { id: 'ACQUISITION_COST', label: '75. Total Cost Calculator', icon: IndianRupee, category: 'CORE' },
    { id: 'INVESTMENT_SCENARIOS', label: '76. Investment Engine', icon: TrendingUp, category: 'INVESTMENT' },
    { id: 'BUY_VS_RENT', label: '77. Buy vs. Rent', icon: Home, category: 'ANALYSIS' },
    { id: 'VALUATION', label: '78. Property Valuation', icon: Building, category: 'VALUATION' },
    { id: 'EMI', label: 'Home Loan EMI', icon: Calculator, category: 'CORE' },
    { id: 'TAX_SHIELD', label: 'Statutory Tax Shield', icon: Zap, category: 'TAX' },
    { id: 'RENTAL_YIELD', label: 'Rental Yield', icon: Percent, category: 'INVESTMENT' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 animate-fade-in" id="kiaan-calculator-suite">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0D1627] via-[#09101C] to-[#040810] border border-amber-500/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kiaan Financial Intelligence™ Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Financial & Valuation Intelligence Engines
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Deterministic mathematical calculators calibrated for Indian luxury real estate, Maharashtra statutory stamp duties, MahaRERA escrow frameworks, and real-time automated property valuations.
          </p>
        </div>

        {/* Calculator Tabs Grid */}
        <div className="mt-8 flex flex-wrap items-center gap-2 pt-6 border-t border-white/10 relative z-10">
          {calculatorTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Calculation Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs Controls Panel */}
        <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Input Parameters</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Live Calculated</span>
          </div>

          {/* Conditional Inputs Based on Active Tab */}
          {activeTab === 'VALUATION' ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-white/60 font-semibold uppercase">Micro-Market Location</label>
                <select
                  value={valLocation}
                  onChange={(e) => setValLocation(e.target.value)}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                >
                  <option value="Baner" className="bg-[#0D1525]">Baner</option>
                  <option value="Wakad" className="bg-[#0D1525]">Wakad</option>
                  <option value="Balewadi" className="bg-[#0D1525]">Balewadi</option>
                  <option value="Hinjewadi" className="bg-[#0D1525]">Hinjewadi</option>
                  <option value="Koregaon Park" className="bg-[#0D1525]">Koregaon Park</option>
                  <option value="Kharadi" className="bg-[#0D1525]">Kharadi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold uppercase">Property Type</label>
                <select
                  value={valPropertyType}
                  onChange={(e) => setValPropertyType(e.target.value as any)}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                >
                  <option value="Apartment" className="bg-[#0D1525]">Luxury Apartment</option>
                  <option value="Penthouse" className="bg-[#0D1525]">Sky Penthouse</option>
                  <option value="Sky Villa" className="bg-[#0D1525]">Duplex Sky Villa</option>
                  <option value="Gated Villa" className="bg-[#0D1525]">Gated Villa</option>
                  <option value="Commercial Office" className="bg-[#0D1525]">Commercial Office</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-white/60 font-semibold uppercase">BHK Layout</label>
                  <select
                    value={valBhk}
                    onChange={(e) => setValBhk(e.target.value as any)}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                  >
                    <option value="1 BHK" className="bg-[#0D1525]">1 BHK</option>
                    <option value="2 BHK" className="bg-[#0D1525]">2 BHK</option>
                    <option value="3 BHK" className="bg-[#0D1525]">3 BHK</option>
                    <option value="4 BHK" className="bg-[#0D1525]">4 BHK</option>
                    <option value="5+ BHK / Penthouse" className="bg-[#0D1525]">5+ BHK</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/60 font-semibold uppercase">Carpet Area</label>
                  <input
                    type="number"
                    value={valAreaSqFt}
                    onChange={(e) => setValAreaSqFt(Number(e.target.value))}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white font-mono"
                    placeholder="sq.ft"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold uppercase">Floor Band</label>
                <select
                  value={valFloorBand}
                  onChange={(e) => setValFloorBand(e.target.value as any)}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                >
                  <option value="Low (1-5)" className="bg-[#0D1525]">Low Floors (1-5)</option>
                  <option value="Mid (6-15)" className="bg-[#0D1525]">Mid Floors (6-15)</option>
                  <option value="High (16-25)" className="bg-[#0D1525]">High Skyline (16-25)</option>
                  <option value="Skyline (26+)" className="bg-[#0D1525]">Crown Levels (26+)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold uppercase">Property Age</label>
                <select
                  value={valAge}
                  onChange={(e) => setValAge(e.target.value as any)}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                >
                  <option value="0-2 (Brand New / Ready OC)" className="bg-[#0D1525]">0-2 Yrs (Brand New / OC)</option>
                  <option value="3-5 Years" className="bg-[#0D1525]">3-5 Years</option>
                  <option value="6-10 Years" className="bg-[#0D1525]">6-10 Years</option>
                  <option value="10+ Years" className="bg-[#0D1525]">10+ Years</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold uppercase">Condition</label>
                <select
                  value={valCondition}
                  onChange={(e) => setValCondition(e.target.value as any)}
                  className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-white"
                >
                  <option value="Immaculate / Designer Furnished" className="bg-[#0D1525]">Immaculate / Designer Interior</option>
                  <option value="Well Maintained" className="bg-[#0D1525]">Well Maintained</option>
                  <option value="Standard Bare Shell" className="bg-[#0D1525]">Standard Bare Shell</option>
                  <option value="Needs Renovation" className="bg-[#0D1525]">Needs Renovation</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              {/* Property Value Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 font-medium">Property Value:</span>
                  <span className="text-amber-400 font-bold font-mono">{formatINR(propertyPrice)}</span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={80000000}
                  step={500000}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Down Payment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 font-medium">Down Payment ({downPaymentPercent}%):</span>
                  <span className="text-white font-bold font-mono">{formatINR((propertyPrice * downPaymentPercent) / 100)}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 font-medium">Interest Rate (p.a.):</span>
                  <span className="text-white font-bold font-mono">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={11.5}
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 font-medium">Tenure:</span>
                  <span className="text-white font-bold font-mono">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Affordability Inputs */}
              {activeTab === 'AFFORDABILITY' && (
                <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Monthly Net Income:</span>
                      <span className="text-emerald-400 font-bold font-mono">{formatINR(monthlyIncome)}</span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={1500000}
                      step={25000}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Existing Monthly EMIs:</span>
                      <span className="text-rose-400 font-bold font-mono">{formatINR(existingEmis)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200000}
                      step={5000}
                      value={existingEmis}
                      onChange={(e) => setExistingEmis(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Liquid Savings Portfolio:</span>
                      <span className="text-cyan-400 font-bold font-mono">{formatINR(liquidSavings)}</span>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={20000000}
                      step={250000}
                      value={liquidSavings}
                      onChange={(e) => setLiquidSavings(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* Total Cost Specific Inputs */}
              {activeTab === 'ACQUISITION_COST' && (
                <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Parking Charges:</span>
                      <span className="text-white font-mono font-bold">{formatINR(parkingCharges)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1500000}
                      step={50000}
                      value={parkingCharges}
                      onChange={(e) => setParkingCharges(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Floor Number ({floorNumber}th Floor):</span>
                      <span className="text-amber-400 font-mono font-bold">+{formatINR(floorRiseTotal)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={35}
                      step={1}
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                    <span className="text-white/70">Ready OC (0% GST)</span>
                    <input
                      type="checkbox"
                      checked={isGstExempt}
                      onChange={(e) => setIsGstExempt(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                    <span className="text-white/70">Sole Woman Ownership (1% Concession)</span>
                    <input
                      type="checkbox"
                      checked={isWomenOwnership}
                      onChange={(e) => setIsWomenOwnership(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Investment Engine Inputs */}
              {activeTab === 'INVESTMENT_SCENARIOS' && (
                <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Holding Period:</span>
                      <span className="text-amber-400 font-bold font-mono">{holdingPeriodYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={15}
                      step={1}
                      value={holdingPeriodYears}
                      onChange={(e) => setHoldingPeriodYears(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Monthly Rental Benchmark:</span>
                      <span className="text-emerald-400 font-bold font-mono">{formatINR(monthlyRent)}</span>
                    </div>
                    <input
                      type="range"
                      min={20000}
                      max={300000}
                      step={5000}
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Buy vs Rent Inputs */}
              {activeTab === 'BUY_VS_RENT' && (
                <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Monthly Rent:</span>
                      <span className="text-cyan-400 font-bold font-mono">{formatINR(monthlyRent)}/mo</span>
                    </div>
                    <input
                      type="range"
                      min={20000}
                      max={250000}
                      step={5000}
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Annual Rent Escalation:</span>
                      <span className="text-white font-mono">{rentEscalationPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={10}
                      step={0.5}
                      value={rentEscalationPercent}
                      onChange={(e) => setRentEscalationPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Property Appreciation:</span>
                      <span className="text-white font-mono">{propertyAppreciationPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={14}
                      step={0.5}
                      value={propertyAppreciationPercent}
                      onChange={(e) => setPropertyAppreciationPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">Mutual Fund SIP Return:</span>
                      <span className="text-emerald-400 font-mono">{sipReturnPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={16}
                      step={0.5}
                      value={sipReturnPercent}
                      onChange={(e) => setSipReturnPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Output Results Area (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 74: AFFORDABILITY ENGINE */}
          {activeTab === 'AFFORDABILITY' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">74. Affordability Engine</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    Purchase Capacity & Risk Bands
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">Usable Down Payment</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {formatINR(affordabilityTiersResult.usableDownpayment)}
                  </span>
                  <span className="text-[10px] text-white/40 block">
                    (20% Contingency Buffer: {formatINR(affordabilityTiersResult.emergencyReserveRetained)})
                  </span>
                </div>
              </div>

              {/* 3 Range Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Comfortable Range */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Comfortable Range</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      ≤ 35% FOIR
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Property Budget</span>
                    <div className="text-xl font-bold text-white font-mono">
                      {formatINR(affordabilityTiersResult.tiers.comfortable.affordablePropertyPrice)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span>Max Safe EMI:</span>
                      <span className="font-mono text-emerald-400">{formatINR(affordabilityTiersResult.tiers.comfortable.maxEmi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible Loan:</span>
                      <span className="font-mono text-white">{formatINR(affordabilityTiersResult.tiers.comfortable.eligibleLoan)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/60 leading-tight">
                    {affordabilityTiersResult.tiers.comfortable.description}
                  </p>
                </div>

                {/* 2. Stretch Range */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">Stretch Range</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                      45% FOIR
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Property Budget</span>
                    <div className="text-xl font-bold text-white font-mono">
                      {formatINR(affordabilityTiersResult.tiers.stretch.affordablePropertyPrice)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span>Max Bank EMI:</span>
                      <span className="font-mono text-amber-400">{formatINR(affordabilityTiersResult.tiers.stretch.maxEmi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible Loan:</span>
                      <span className="font-mono text-white">{formatINR(affordabilityTiersResult.tiers.stretch.eligibleLoan)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/60 leading-tight">
                    {affordabilityTiersResult.tiers.stretch.description}
                  </p>
                </div>

                {/* 3. Higher-Burden Range */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase">Higher-Burden Range</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                      55% FOIR
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 block">Property Budget</span>
                    <div className="text-xl font-bold text-white font-mono">
                      {formatINR(affordabilityTiersResult.tiers.higherBurden.affordablePropertyPrice)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span>Elevated EMI:</span>
                      <span className="font-mono text-rose-400">{formatINR(affordabilityTiersResult.tiers.higherBurden.maxEmi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible Loan:</span>
                      <span className="font-mono text-white">{formatINR(affordabilityTiersResult.tiers.higherBurden.eligibleLoan)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/60 leading-tight">
                    {affordabilityTiersResult.tiers.higherBurden.description}
                  </p>
                </div>
              </div>

              {/* Explicit Assumptions Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-white/80 uppercase block">Model Assumptions & Banking Rules:</span>
                <ul className="space-y-1 text-white/60 list-disc list-inside leading-relaxed">
                  {affordabilityTiersResult.assumptions.map((assump, idx) => (
                    <li key={idx}>{assump}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 75: TOTAL COST CALCULATOR */}
          {activeTab === 'ACQUISITION_COST' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider">75. Total Cost Calculator</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Never Hide Charges
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1">
                    {formatINR(totalEstimatedAcquisition)}
                  </h2>
                  <p className="text-xs text-white/60 mt-0.5">Estimated Total Acquisition Cost (100% Disclosed)</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">Base Unit Price</span>
                  <span className="text-xl font-bold text-white font-mono">{formatINR(propertyPrice)}</span>
                </div>
              </div>

              {/* Itemized Transparent Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white/60 uppercase">Itemized Acquisition Cost Line Items</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <span className="text-white/70">Base Agreement Price</span>
                    <span className="text-white font-mono font-bold">{formatINR(propertyPrice)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <span className="text-white/70">Covered Car Parking (2 Slots)</span>
                    <span className="text-white font-mono font-bold">+{formatINR(parkingCharges)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <span className="text-white/70">Floor Rise Premium (Level {floorNumber})</span>
                    <span className="text-white font-mono font-bold">+{formatINR(floorRiseTotal)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white/70 block">Statutory GST (5%)</span>
                      <span className="text-[10px] text-white/40">{isGstExempt ? 'Exempt (Ready OC)' : 'Under Construction'}</span>
                    </div>
                    <span className="text-white font-mono font-bold">+{formatINR(gstAmount)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white/70 block">Maharashtra Stamp Duty</span>
                      <span className="text-[10px] text-white/40">{isWomenOwnership ? '6% (Women Concession)' : '7% Standard + Cess'}</span>
                    </div>
                    <span className="text-white font-mono font-bold">+{formatINR(stampDutyAmount)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white/70 block">Sub-Registrar Registration</span>
                      <span className="text-[10px] text-white/40">Statutory Cap</span>
                    </div>
                    <span className="text-white font-mono font-bold">+{formatINR(registrationFee)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white/70 block">Advance Society Maintenance</span>
                      <span className="text-[10px] text-white/40">1 Year Sinking / Ops Fund</span>
                    </div>
                    <span className="text-white font-mono font-bold">+{formatINR(maintenanceReserve)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-white/70 block">Legal & Title Dossier Charges</span>
                      <span className="text-[10px] text-white/40">30-Year Search & Franking</span>
                    </div>
                    <span className="text-white font-mono font-bold">+{formatINR(legalDocumentationFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 76: INVESTMENT SCENARIOS */}
          {activeTab === 'INVESTMENT_SCENARIOS' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">76. Investment Engine</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    Multi-Scenario Cash Flow & IRR
                  </h2>
                  <p className="text-xs text-white/60 mt-0.5">Holding Horizon: {holdingPeriodYears} Years</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">Purchase Price</span>
                  <span className="text-xl font-bold text-white font-mono">{formatINR(propertyPrice)}</span>
                </div>
              </div>

              {/* 3 Scenarios: Conservative / Base / Higher-Growth */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Conservative */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80 uppercase">Conservative</span>
                    <span className="text-[10px] font-mono text-white/50">5.5% Apprec.</span>
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block">Projected Exit Value</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(investmentEngineResult.scenarios.conservative.projectedExitPrice)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/70 pt-2 border-t border-white/5">
                    <div className="flex justify-between">
                      <span>Rental Yield:</span>
                      <span className="font-mono text-emerald-400">{investmentEngineResult.scenarios.conservative.grossRentalYieldPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cumulative Rent:</span>
                      <span className="font-mono text-white">{formatINR(investmentEngineResult.scenarios.conservative.cumulativeRentalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated IRR:</span>
                      <span className="font-mono font-bold text-amber-400">{investmentEngineResult.scenarios.conservative.estimatedIrrPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* 2. Base Scenario */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">Base (Benchmark)</span>
                    <span className="text-[10px] font-mono text-amber-300">8.0% Apprec.</span>
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block">Projected Exit Value</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(investmentEngineResult.scenarios.base.projectedExitPrice)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/70 pt-2 border-t border-white/5">
                    <div className="flex justify-between">
                      <span>Rental Yield:</span>
                      <span className="font-mono text-emerald-400">{investmentEngineResult.scenarios.base.grossRentalYieldPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cumulative Rent:</span>
                      <span className="font-mono text-white">{formatINR(investmentEngineResult.scenarios.base.cumulativeRentalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated IRR:</span>
                      <span className="font-mono font-bold text-amber-400">{investmentEngineResult.scenarios.base.estimatedIrrPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Higher-Growth */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Higher-Growth</span>
                    <span className="text-[10px] font-mono text-emerald-300">11.5% Apprec.</span>
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block">Projected Exit Value</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatINR(investmentEngineResult.scenarios.higherGrowth.projectedExitPrice)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/70 pt-2 border-t border-white/5">
                    <div className="flex justify-between">
                      <span>Rental Yield:</span>
                      <span className="font-mono text-emerald-400">{investmentEngineResult.scenarios.higherGrowth.grossRentalYieldPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cumulative Rent:</span>
                      <span className="font-mono text-white">{formatINR(investmentEngineResult.scenarios.higherGrowth.cumulativeRentalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated IRR:</span>
                      <span className="font-mono font-bold text-amber-400">{investmentEngineResult.scenarios.higherGrowth.estimatedIrrPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Disclaimer Requirement (76) */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/80 leading-relaxed">
                <span className="font-bold uppercase block text-amber-400 mb-1">Statutory Regulatory Disclosure:</span>
                {investmentEngineResult.disclaimer}
              </div>
            </div>
          )}

          {/* TAB 77: BUY VS RENT */}
          {activeTab === 'BUY_VS_RENT' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">77. Buy vs. Rent Comparison</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                    {buyVsRentResult.verdict === 'BUYING_WINS' ? '✓ Buying Builds Superior Net Equity' : '✓ Renting with Disciplined SIP Wins'}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">10-Yr Wealth Gap</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">{formatINR(buyVsRentResult.netAdvantageAmount)}</span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                {buyVsRentResult.reasoning}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase block">Ownership Route (10-Yr)</span>
                  <div className="text-xl font-bold text-white font-mono">{formatINR(buyVsRentResult.netEquityBuiltBuying)}</div>
                  <p className="text-white/60">Net physical asset equity after amortizing home loan balance.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <span className="font-bold text-blue-400 uppercase block">Rental + SIP Route (10-Yr)</span>
                  <div className="text-xl font-bold text-white font-mono">{formatINR(buyVsRentResult.sipCorpusWithRenting)}</div>
                  <p className="text-white/60">Total rent paid over 10 years: {formatINR(buyVsRentResult.totalRentPaid10Yrs)}.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 78: PROPERTY VALUATION */}
          {activeTab === 'VALUATION' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">78. Automated Property Valuation</span>
                  <h2 className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                    {formatINR(valuationResult.estimatedMarketRange.midFairINR)}
                  </h2>
                  <p className="text-xs text-white/60 mt-0.5">
                    Estimated Fair Market Value ({valLocation} • {valBhk} • {valAreaSqFt} sq.ft)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">Rate / Sq.Ft Range</span>
                  <span className="text-lg font-bold text-white font-mono">
                    ₹{valuationResult.ratePerSqFt.min.toLocaleString('en-IN')} - ₹{valuationResult.ratePerSqFt.max.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Valuation Spectrum */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-white/40 uppercase text-[10px]">Conservative Value</span>
                  <div className="text-base font-bold text-white font-mono">
                    {formatINR(valuationResult.estimatedMarketRange.minINR)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <span className="text-amber-400 uppercase text-[10px] font-bold">Fair Market Valuation</span>
                  <div className="text-lg font-bold text-amber-300 font-mono">
                    {formatINR(valuationResult.estimatedMarketRange.midFairINR)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-white/40 uppercase text-[10px]">Optimistic Value</span>
                  <div className="text-base font-bold text-white font-mono">
                    {formatINR(valuationResult.estimatedMarketRange.maxINR)}
                  </div>
                </div>
              </div>

              {/* Methodology and Limitations */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-bold text-white/80 uppercase block">Methodology:</span>
                  <p className="text-white/60 leading-relaxed">{valuationResult.methodology}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <span className="font-bold text-amber-400 uppercase block">Limitations:</span>
                  <p className="text-amber-200/70 leading-relaxed">{valuationResult.limitations}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOME LOAN EMI */}
          {activeTab === 'EMI' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">Monthly Commitment</span>
                  <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1">
                    {formatINR(emiResult.monthlyEMI)} <span className="text-base text-white/50 font-normal">/ month</span>
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">Loan Principal</span>
                  <span className="text-xl font-bold text-white font-mono">{formatINR(emiResult.principalAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-xs text-white/50">Total Interest Payable</span>
                  <div className="text-lg font-bold text-amber-400 font-mono">{formatINR(emiResult.totalInterest)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-xs text-white/50">Total Outflow (P+I)</span>
                  <div className="text-lg font-bold text-white font-mono">{formatINR(emiResult.totalPayment)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-xs text-white/50">Effective Net Rate</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">{interestRate}% p.a.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TAX SHIELD */}
          {activeTab === 'TAX_SHIELD' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">Annual Income Tax Shield</span>
                  <h2 className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                    {formatINR(taxShieldResult.totalAnnualTaxSavedINR)} <span className="text-base text-white/50 font-normal">/ year</span>
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/40 uppercase block">10-Yr Cumulative Tax Saved</span>
                  <span className="text-xl font-bold text-white font-mono">{formatINR(taxShieldResult.tenYearCumulativeTaxSavingsINR)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-white/50 font-semibold">Section 24(b) Interest Deduction</span>
                  <div className="text-lg font-bold text-white font-mono">{formatINR(taxShieldResult.actualDeduction24b)}</div>
                  <span className="text-white/40 block">Max ₹2,00,000 statutory limit</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-white/50 font-semibold">Section 80C Principal Deduction</span>
                  <div className="text-lg font-bold text-white font-mono">{formatINR(taxShieldResult.actualDeduction80C)}</div>
                  <span className="text-white/40 block">Max ₹1,50,000 statutory limit</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RENTAL YIELD */}
          {activeTab === 'RENTAL_YIELD' && (
            <div className="rounded-3xl bg-[#0D1525]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white">Rental Yield & Income Analysis</h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">MahaRERA Comps</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block">Gross Yield</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">{rentalYieldResult.grossYieldPercent}% p.a.</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block">Net Yield (Post-Maintenance)</span>
                  <span className="text-2xl font-bold text-cyan-400 font-mono">{rentalYieldResult.netYieldPercent}% p.a.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
