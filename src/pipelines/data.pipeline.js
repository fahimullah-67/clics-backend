import { cleanBankData, cleanSchemeData } from "../services/cleaning.service.js";

export const processScraperData = (banks, schemes) => {
  console.log("🔄 Cleaning Data सुरू...");

  const cleanedBanks = banks.map(cleanBankData);
  const cleanedSchemes = schemes.map(cleanSchemeData);

  console.log("✅ Cleaning Completed");

  return {
    cleanedBanks,
    cleanedSchemes,
  };
};