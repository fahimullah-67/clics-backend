import { Router } from "express";

import {
  createSnapshot,
  deleteSnapshot,
  getSnapshotsByLoanScheme,
  viewSnapshot,
} from "../controllers/snapshot.controller.js";

const router = Router();

router.route("/snapshots/create").post(createSnapshot);
router.route("/snapshots/getByLoanScheme").get(getSnapshotsByLoanScheme);
router.route("/snapshots/View").get(viewSnapshot);
router.route("/snapshots/delete").put(deleteSnapshot);

export { router as snapshotRouter };