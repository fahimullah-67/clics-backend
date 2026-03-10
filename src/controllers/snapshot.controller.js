import Snapshot from "../models/snapshots.model.js";
import LoanSchemes from "../models/loanSchemes.model.js";

export const createSnapshot = async (req, res) => {
  try {
    const { loanSchemeId, sourceUrl, snapshotType } = req.body;

    const scheme = await LoanSchemes.findById(loanSchemeId);

    if (!scheme) {
      return res.status(404).json({
        message: "Loan scheme not found",
      });
    }

    const snapshot = new Snapshot({
      loanSchemeId,
      sourceUrl,
      snapshotType,
      filePath: req.file ? req.file.path : null,
      capturedAt: new Date(),
      createdBy: req.user?.id,
    });

    const savedSnapshot = await snapshot.save();

    res.status(201).json({
      message: "Snapshot created successfully",
      data: savedSnapshot,
    });
  } catch (error) {
    console.log("Error creating snapshot:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSnapshotsByLoanScheme = async (req, res) => {
  try {
    const { loanSchemeId } = req.params;

    const snapshots = await Snapshot.find({ loanSchemeId });

    if (snapshots.length === 0) {
      return res.status(404).json({
        message: "No snapshots found for this loan scheme",
      });
    }

    res.status(200).json({
      message: "Snapshots fetched successfully",
      data: snapshots,
    });
  } catch (error) {
    console.log("Error fetching snapshots:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const viewSnapshot = async (req, res) => {
  try {
    const { id } = req.params;

    const snapshot = await Snapshot.findById(id);

    if (!snapshot) {
      return res.status(404).json({
        message: "Snapshot not found",
      });
    }

    res.status(200).json({
      message: "Snapshot retrieved",
      data: snapshot,
    });
  } catch (error) {
    console.log("Error viewing snapshot:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteSnapshot = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSnapshot = await Snapshot.findByIdAndDelete(id);

    if (!deletedSnapshot) {
      return res.status(404).json({
        message: "Snapshot not found",
      });
    }

    res.status(200).json({
      message: "Snapshot deleted successfully",
      data: deletedSnapshot,
    });
  } catch (error) {
    console.log("Error deleting snapshot:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
