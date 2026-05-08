import fs from "fs";
import path from "path";
import { runScraperService } from "../services/scraper.service.js";

// ==========================================
// 🔹 OPTION 1: Run scraper using JSON file
// ==========================================
export const runScraper = async (req, res) => {
  try {
    const filePath = path.resolve("src/scraper/raw-data/verifiedBankData.json");

    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    const result = await runScraperService(jsonData, req.user?.id);

    res.status(200).json({
      message: "Scraper executed successfully (file data)",
      data: result,
    });

  } catch (error) {
    console.log("Scraper Error:", error);

    res.status(500).json({
      message: "Error running scraper",
      error: error.message,
    });
  }
};

// ==========================================
// 🔹 OPTION 2: Run scraper using API data
// ==========================================
export const runScraperController = async (req, res) => {
  try {
    const data = req.body; // send JSON array from Postman

    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "No data provided",
      });
    }

    const result = await runScraperService(data, req.user?.id);

    res.status(200).json({
      message: "Scraper executed successfully (API data)",
      data: result,
    });

  } catch (error) {
    console.log("Scraper Error:", error);

    res.status(500).json({
      message: "Error running scraper",
      error: error.message,
    });
  }
};