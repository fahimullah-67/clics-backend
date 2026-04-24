import LoanSchemes from "../models/loanSchemes.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createLoanScheme = async (req, res) => {
  try {
    const { schemeCode } = req.body;
    const loanScheme = new LoanSchemes(req.body);

    const existScheme = await LoanSchemes.findOne({
      schemeCode: schemeCode,
    });
    if (existScheme) {
      console.log(`Scheme already exists. Code: ${schemeCode}`);

      return res
        .status(401)
        .json(new ApiError(401, "SchemeExist", "Scheme already exists!"));
    }

    const createdLoanScheme = await loanScheme.save();

    console.log("Loan Scheme is Created SuccessFully!");
    res
      .status(201)
      .json(new ApiResponse(201, createdLoanScheme, "Loan Scheme is Created"));
  } catch (error) {
    console.log("Error Creating Loan Scheme:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllLoanSchemes = async (req, res) => {
  try {
    const allLoanScheme = await LoanSchemes.find().populate("bankId", "name");
    if (allLoanScheme.length === 0) {
      return res.status(401).json({
        Message: "Scheme not Found",
        error: "SchemeNotFound",
      });
    }

    console.log("All Loan Scheme fetched!");
    res.status(201).json({
      message: "All Scheme data fetch Successfully!",
      data: {
        allLoanScheme,
      },
    });
  } catch (error) {}
};

export const getLoanSchemeById = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(" Request From : ", id);

    const loanScheme = await LoanSchemes.findById({ _id: id }).populate(
      "bankId",
      "name",
    );
    // const loanScheme = await LoanSchemes.findById(req.params.id);
    if (!loanScheme) {
      return res
        .status(401)
        .json(new ApiError(401, "Scheme not Found!", "SchemeNotFound"));
    }
    res
      .status(201)
      .json(
        new ApiResponse(201, loanScheme, "Scheme data fetch Successfully!"),
      );
  } catch (error) {
    console.log(" Internal Server Error:", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.message));
  }
};

export const updateLoanScheme = async (req, res) => {
  try {
    const { id } = req.body;
    const existScheme = await LoanSchemes.findById({ _id: id });
    // const existScheme = await LoanSchemes.findByOne(req.params.id);
    if (!existScheme) {
      console.log(
        `This code ${existScheme.id} of Scheme is Not already Exist!`,
      );
      throw new ApiError(402, "Scheme not Exist!", "NotExist");
    }

    const updateScheme = await LoanSchemes.findByIdAndUpdate(
      existScheme._id,
      { $set: req.body },
      { new: true },
    );
    console.log("Update Scheme SuccessFully!");

    res.status(200).json(new ApiResponse(200, updateScheme, "Scheme Updated!"));
  } catch (error) {
    console.log("Error Update Scheme:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteLoanScheme = async (req, res) => {
  try {
    const schemeDelete = await LoanSchemes.findByIdDelete(req.params.id);
    console.log("Delete Scheme Data SuccessFully!");
    res.status(201).json({
      message: "Delete Scheme!",
      data: {
        schemeDelete,
      },
    });
  } catch (error) {
    console.log("Error Delete Loan Scheme :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// loanSchemeController.js

export const verifyLoanScheme = async (req, res) => {
  try {
    const { id } = req.params; // loanSchemeId
    const adminId = req.user.id; // verified admin

    const updateVerified = await LoanSchemes.findByIdAndUpdate(id, {
      isVerified: true,
      verifiedBy: adminId,
      lastUpdatedAt: new Date(),
    });

    res.status(200).json({
      message: "Loan scheme verified",
      data: {
        updateVerified,
      },
    });
  } catch (error) {
    console.log("Error Verify Scheme:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const filterLoanSchemes = async (req, res) => {
  try {
    const { bankId, loanType, minInterest, maxInterest, tenure, isVerified } =
      req.query;

    let filter = {};

    if (bankId) {
      filter.bankId = bankId;
    }

    if (loanType) {
      filter.loanType = loanType;
    }

    if (tenure) {
      filter.tenure = tenure;
    }

    if (isVerified) {
      filter.isVerified = isVerified;
    }

    if (minInterest || maxInterest) {
      filter.interestRate = {};

      if (minInterest) {
        filter.interestRate.$gte = minInterest;
      }

      if (maxInterest) {
        filter.interestRate.$lte = maxInterest;
      }
    }

    const schemes = await LoanSchemes.find(filter);

    res.status(200).json({
      message: "Filtered loan schemes",
      data: schemes,
    });
  } catch (error) {
    console.log("Error filtering schemes:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const compareLoanSchemes = async (req, res) => {
  try {
    const { schemeIds } = req.body;

    if (!schemeIds || schemeIds.length < 2) {
      return res.status(400).json({
        message: "Select at least two schemes for comparison",
      });
    }

    const schemes = await LoanSchemes.find({
      _id: { $in: schemeIds },
    });

    res.status(200).json({
      message: "Loan schemes comparison data",
      data: schemes,
    });
  } catch (error) {
    console.log("Error comparing schemes:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const recommendLoanScheme = async (req, res) => {
  try {
    const { loanType } = req.query;

    const schemes = await LoanSchemes.find({
      loanType: loanType,
      isVerified: true,
    });

    if (schemes.length === 0) {
      return res.status(404).json({
        message: "No schemes found",
      });
    }

    let bestScheme = schemes[0];

    for (let scheme of schemes) {
      if (scheme.interestRate < bestScheme.interestRate) {
        bestScheme = scheme;
      }
    }

    res.status(200).json({
      message: "Best loan scheme recommendation",
      data: bestScheme,
    });
  } catch (error) {
    console.log("Recommendation error:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
