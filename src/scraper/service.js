// after scraping new data
import { handleLoanSchemeUpdate } from "../services/loanUpdate.service.js";

const scrapedData = {
  interestRate: 12.5,
  tenure: 5,
  processingFee: 2000,
};

await handleLoanSchemeUpdate(schemeId, scrapedData);