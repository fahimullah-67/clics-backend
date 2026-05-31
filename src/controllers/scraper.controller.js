import fs from "fs";
import path from "path";
import { runScraperService } from "../services/scraper.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ScraperLog from "../models/scraperLogs.model.js";

//  Run scraper using JSON file

export const runScraper = async (req, res) => {
  try {
    const filePath = path.resolve("src/scraper/raw-data/verifiedBankData.json");
    const filePath1 = path.resolve("src/scraper/raw-data/bankData.json");

    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    const rawData1 = fs.readFileSync(filePath1, "utf-8");
    const jsonData1 = JSON.parse(rawData1);

    const result = await runScraperService(jsonData, jsonData1, req.user?.id);

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

// Run scraper using API data

export const runScraperController = async (req, res) => {
  try {
    const data = req.body;

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

export const getScraperLogs = async (req, res) => {
  try {
    const logs = await ScraperLog.find().sort({ createdAt: -1 }).limit(20);
    res
      .status(200)
      .json(new ApiResponse(200, logs, "Scraper logs retrieved successfully"));
  } catch (error) {
    console.log("Error retrieving scraper logs:", error);
    res
      .status(500)
      .json(new ApiError(500, "Error retrieving scraper logs", error.message));
  }
};
