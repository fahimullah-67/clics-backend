import express from "express";
import { runScraper, runScraperController } from "../controllers/scraper.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const scraperRouter = express.Router();

/**
 * POST /api/v1/scraper/run
 * Run scraper with uploaded data or default data
 * Admin only
 */
scraperRouter.post(
  "/run",
  verifyToken,
  verifyAdmin,
  runScraperController
);

/**
 * POST /api/v1/scraper/run-default
 * Run scraper with default data from JSON file
 * Admin only
 */
scraperRouter.post(
  "/run-default",
  verifyToken,
  verifyAdmin,
  runScraper
);

export { scraperRouter };
