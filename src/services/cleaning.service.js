import { normalizeBankName } from "../utils/normalizeBankName.js";
import { extractNumber } from "../utils/cleanText.js";

const mapLoanType = (type) => {
  if (!type) return "other";
  const t = type.toLowerCase();

  if (t.includes("car") || t.includes("auto") || t.includes("bike")) return "personal";
  if (t.includes("home")) return "home";
  if (t.includes("agri")) return "Agriculture";
  if (t.includes("business") || t.includes("sme")) return "business";

  return "other";
};

const mapInterestType = (text) => {
  if (!text) return "fixed";
  return text.toLowerCase().includes("variable") ? "variable" : "fixed";
};

const mapProcessingFee = (text) => {
  if (!text) return "none";

  const t = text.toLowerCase();

  if (t.includes("%")) return "percentage";
  if (t.includes("pkr") || t.includes("rs")) return "flat";

  return "none";
};


const safeNumber = (value, defaultValue = 1) => {
  if (value === null || value === undefined) return defaultValue;

  const num = Number(value);

  if (isNaN(num) || num < 1) return defaultValue;

  return num;
};





export const cleanSchemeData = (raw) => {
  return {
    // normalizedName: normalizeBankName(raw.bank_name),

    schemeName: raw.schemeName?.trim(),
    schemeCode: raw.schemeCode?.trim(),

    typeLoan: mapLoanType(raw.typeLoan),

    interestRate: extractNumber(Number(raw.interestRate)) || 0,
    interestRateMin: Number(raw.interestRateMin) || 0,
    interestRateMax: Number(raw.interestRateMax) || 0,

     interestType: mapInterestType(raw.interestType),

   tenureMin: safeNumber(raw.tenureMin, 1),
tenureMax: safeNumber(raw.tenureMax, 12),

   processingFee: mapProcessingFee(raw.processingFee),

    latePaymentFee: Number(raw.latePaymentFee) || 0,

    minSalaryRequired: Number(raw.minSalaryRequired) || 0,

    ageMin: Number(raw.ageMin) || 18,
    ageMax: Number(raw.ageMax) || 65,

    eligibilityCriteria: raw.eligibilityCriteria || "Not specified",
    requiredDocuments: raw.requiredDocuments || "Not specified",

    description: raw.description || "No description available",

    currency: "PKR",
    isIslamic: raw.isIslamic ?? false,

    maxLoanAmount: Number(raw.maxLoanAmount) || 0,
    minDownPaymentPercent: Number(raw.minDownPaymentPercent) || 0,

    status: "active",

    lastScriptedAt: new Date(),
    lastUpdatedAt: new Date(),

    isVerified: false,
    verifiedBy: null,
  };
};