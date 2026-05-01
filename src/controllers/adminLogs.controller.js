import AdminLog from "../models/admin/adminLogs.model.js";


//  Get All Logs
export const getAllAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Admin logs fetched",
      data: logs,
    });
  } catch (error) {
    console.log("Error fetching logs:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//  Filter Logs
export const filterAdminLogs = async (req, res) => {
  try {
    const { action, targetCollection } = req.query;

    let filter = {};

    if (action) filter.action = action;
    if (targetCollection) filter.targetCollection = targetCollection;

    const logs = await AdminLog.find(filter)
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Filtered logs",
      data: logs,
    });
  } catch (error) {
    console.log("Error filtering logs:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//  Get Single Log Detail
export const getAdminLogById = async (req, res) => {
  try {
    const log = await AdminLog.findById(req.params.id)
      .populate("adminId", "name email");

    if (!log) {
      return res.status(404).json({
        message: "Log not found",
      });
    }

    res.status(200).json({
      message: "Log details",
      data: log,
    });
  } catch (error) {
    console.log("Error fetching log:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};