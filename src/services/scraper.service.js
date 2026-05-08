import Bank from "../models/bank.model.js";
import LoanScheme from "../models/loanSchemes.model.js";
import Snapshot from "../models/snapshots.model.js";
import ScraperLog from "../models/scraperLogs.model.js";

import { normalizeBankName } from "../utils/normalizeBankName.js";
import { cleanSchemeData } from "./cleaning.service.js";

export const runScraperService = async (
  schemeData,
  bankData,
  adminId = null
) => {
  let totalCreated = 0;
  let totalUpdated = 0;

  console.log("🚀 Scraper Service Running...");

  try {

    // 1. CREATE / VERIFY BANKS (FROM bankData.json)

    for (const bankItem of bankData) {
      const normalizedName = normalizeBankName(bankItem.name);

      let bank = await Bank.findOne({
        $or: [
          { name: normalizedName },
          { contactEmail: bankItem.contactEmail || null },
        ],
      });

      if (!bank) {
        bank = await Bank.create({
          name: bankItem.name,
          normalizedName: normalizedName,
          bankCode: bankItem.bankCode,
          webUrl: bankItem.webUrl,
          contactEmail: bankItem.contactEmail,
          contactPhone: bankItem.contactPhone,
          logoURL: bankItem.logoURL || null,
        });

        console.log("✔ Bank Created:", bank.name);
      } else {
        console.log("✔ Bank Exists:", bank.name);
      }
    }

    // 2. PROCESS SCHEMES
    
    for (const raw of schemeData) {

      const item = cleanSchemeData(raw);

      console.log("Processing:", item.schemeName);
      // console.log("ok");
    
      // const normalizedName = normalizeBankName(item.bank_name);
      // console.log("ok");
      
      let bank = await Bank.findOne({ name: raw.bank_name });
      // console.log("ok");

      if (!bank) {
        console.log(" Bank not found, skipping:", raw.bank_name);
        continue;
      }


      let existingScheme = await LoanScheme.findOne({
        schemeCode: item.schemeCode,
      });

      const newData = {
        ...item,
        bankId: bank._id,
      };

      // CREATE

      if (!existingScheme) {
        const createdScheme = await LoanScheme.create(newData);
        totalCreated++;

        await Snapshot.create({
          loanSchemeId: createdScheme._id,
          sourceUrl: raw.sourceURL || "",
          sourceTitle: item.schemeName,
        });

        continue;
      }

      // UPDATE (SIMPLE VERSION)

      await LoanScheme.findByIdAndUpdate(existingScheme._id, newData);
      totalUpdated++;

      await Snapshot.create({
        loanSchemeId: existingScheme._id,
        sourceUrl: raw.sourceURL || "",
        sourceTitle: item.schemeName,
      });
    }

     
    // SCRAPER LOG
    
    await ScraperLog.create({
      status: "completed",
      totalSchemesFound: schemeData.length,
      totalCreated,
      totalUpdated,
      totalSkipped: schemeData.length - totalCreated - totalUpdated,
      executedBy: adminId,
    });

    return {
      success: true,
      totalCreated,
      totalUpdated,
    };
  } catch (error) {
    console.log(" Scraper Error:", error.message);

    await ScraperLog.create({
      status: "failed",
      errorMessage: error.message,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};