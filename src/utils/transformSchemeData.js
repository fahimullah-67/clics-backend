export const transformSchemeData = (item, bankId) => {
  return {
    bankId,

    // ✅ REQUIRED FIELDS
    schemeName: item.title || "Unknown Scheme",
    schemeCode: item.schemeID?.toString(),

    typeLoan: detectLoanType(item.title),

    interestRate: extractNumber(item.interest_rate) || 0,
    interestType: detectInterestType(item.interest_rate),

    tenureMin: extractTenureMin(item.tenure),
    tenureMax: extractTenureMax(item.tenure),

    processingFee: item.processing_fee || "N/A",

    eligibilityCriteria: item.eligibility || "Not specified",
    requiredDocuments: "As per bank policy",

    description: item.benefits || item.description || "No description available",

    //  OPTIONAL
    currency: "PKR",
    isIslamic: detectIslamic(item),
    status: "active",

    lastUpdatedAt: new Date(),
  };
};