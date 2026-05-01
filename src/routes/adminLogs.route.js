import express from "express";
import {
  getAllAdminLogs,
  filterAdminLogs,
  getAdminLogById,
} from "../controllers/adminLogs.controller.js";

import { verifyToken, verifyTokenAndAdmin } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyTokenAndAdmin, getAllAdminLogs);
router.get("/filter", verifyToken, verifyTokenAndAdmin, filterAdminLogs);
router.get("/:id", verifyToken, verifyTokenAndAdmin, getAdminLogById);

export  {router as adminLogsRouter}