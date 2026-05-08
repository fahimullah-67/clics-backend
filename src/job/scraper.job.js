import cron from "node-cron";
import runScraper from "../scraper/scraper.runner.js";
import { runScraperService } from "../services/scraper.service.js";
import ScraperLog from "../models/scraperLogs.model.js";

/**
 * Schedule scraper to run at specified intervals
 * 
 * Cron patterns:
 * * * * * * * (second, minute, hour, day of month, month, day of week)
 * 
 * Examples:
 * '0 0 * * *' - Every day at midnight
 * '0 */6 * * *' - Every 6 hours
 * '0 0 * * 0' - Every Sunday at midnight
 * '0 9 * * 1-5' - Every weekday at 9 AM
 */

let scheduledJob = null;

/**
 * Initialize scheduler
 * Runs every day at 2 AM by default
 */
export const initializeScraperScheduler = () => {
  // Schedule: Every day at 2:00 AM
  // Format: minute hour day month dayOfWeek
  scheduledJob = cron.schedule("0 2 * * *", async () => {
    console.log("[SCRAPER JOB] Starting scheduled scraper run...");
    
    try {
      const result = await runScraper();
      console.log("[SCRAPER JOB] Completed successfully:", result);
      
      // Optional: Send notification after completion
      // await sendCompletionNotification(result);
    } catch (error) {
      console.error("[SCRAPER JOB] Error during scheduled run:", error.message);
      
      // Optional: Send error notification
      // await sendErrorNotification(error);
    }
  });

  console.log("[SCRAPER JOB] Scheduler initialized - runs every day at 2:00 AM");
};

/**
 * Manually trigger scraper (e.g., from controller or API)
 */
export const triggerScraperManually = async (adminId = null) => {
  console.log("[SCRAPER JOB] Manual trigger initiated...");
  
  try {
    const result = await runScraper();
    console.log("[SCRAPER JOB] Manual run completed:", result);
    return result;
  } catch (error) {
    console.error("[SCRAPER JOB] Error during manual run:", error.message);
    throw error;
  }
};

/**
 * Stop the scheduler (if needed for maintenance)
 */
export const stopScraperScheduler = () => {
  if (scheduledJob) {
    scheduledJob.stop();
    console.log("[SCRAPER JOB] Scheduler stopped");
  }
};

/**
 * Restart the scheduler
 */
export const restartScraperScheduler = () => {
  stopScraperScheduler();
  initializeScraperScheduler();
  console.log("[SCRAPER JOB] Scheduler restarted");
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = () => {
  return {
    active: scheduledJob ? !scheduledJob.status : false,
    status: scheduledJob ? scheduledJob.status : "not-initialized",
    schedule: "0 2 * * * (Every day at 2:00 AM)",
  };
};