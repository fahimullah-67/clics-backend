import fs from "fs";
import path from "path";
import { runScraperService } from "../services/scraper.service.js";
import ScraperLog from "../models/scraperLogs.model.js";
import connectDB from "../db/dbBank.js"


console.log("Scraper is Running!....");
const runScraper = async () => {
  try {
    console.log("Scraper is Running!");
    
    const filePathScheme = path.resolve("src/scraper/raw_Data/verifiedBankData_Alpha.json");
    const filePathBank = path.resolve("src/scraper/raw_Data/bankData.json");

    if (!fs.existsSync(filePathScheme)) {
      throw new Error(`Data file not found: ${filePathScheme}`);
    }
    if (!fs.existsSync(filePathBank)) {
      throw new Error(`Data file not found: ${filePathBank}`);
    }
    
    const rawDataScheme = fs.readFileSync(filePathScheme, "utf-8");
    const jsonDataScheme = JSON.parse(rawDataScheme);
    
    const rawDataBank = fs.readFileSync(filePathBank, "utf-8");
    const jsonDataBank = JSON.parse(rawDataBank);

    console.log(`Found ${Array.isArray(jsonDataScheme) ? jsonDataScheme.length : 1} schemes to process...`);

    console.log(`Found ${Array.isArray(jsonDataBank) ? jsonDataBank.length : 1} schemes to process...`);



    const result = await /* `runScraperService` is a function that is being imported from the
    `scraper.service.js` file. It is being called with the `jsonData`
    parameter, which is an array of bank schemes obtained from reading a JSON
    file. The purpose of `runScraperService` is to process these bank schemes
    in some way, which could involve scraping data from websites, analyzing
    information, or performing any other operations related to the bank
    schemes. The function returns a result after processing the data, which is
    then logged to the console. */
    runScraperService(jsonDataScheme, jsonDataBank);

    console.log("Scraper Result:", result);
    return result;
  } catch (error) {
    console.error("Scraper Runner Error:", error.message);
    throw error;
  }
};

// runScraper();

export const runScraperManually = async () => {
    try {
        const result = await runScraper();
        console.log("Manual Scraper Result:", result);
        return result;
    } catch (error) {
        console.error("Manual Scraper Error:", error.message);
        throw error;
    }
};

connectDB()
runScraperManually();


export default runScraper;