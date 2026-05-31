import express from "express";
import {
  getScraperLogs,
  runScraper,
  runScraperController,
} from "../controllers/scraper.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

/**
 * POST /api/v1/scraper/run
 * Run scraper with uploaded data or default data
 * Admin only
 */

router.route("/run").post(verifyToken, verifyAdmin, runScraperController);

/**
 * POST /api/v1/scraper/run-default
 * Run scraper with default data from JSON file
 * Admin only
 */
// scraperRouter.post("/run-default", verifyToken, verifyAdmin, runScraper);

router.route("run-default").post(verifyToken, verifyAdmin, runScraper);

router.route("/logs").get(verifyToken, verifyAdmin, getScraperLogs);

export { router as scraperRouter };
