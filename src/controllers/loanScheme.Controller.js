import LoanSchemes from "../models/loanSchemes.model";

export const createLoanScheme = async (req, res) => {
    try {
        
        const {schemeCode} = req.body;
        const loanScheme = new LoanSchemes(req.body);

        const existScheme = await LoanSchemes.findOne({
          schemeCode: schemeCode,
        });
        if (existScheme) {
          console.log(`Scheme already exists. Code: ${schemeCode}`);

          return res.status(401).json({
            message: "Scheme All Ready Exist!",
            error: "SchemeExist",
          });
        }

        const createdLoanScheme = await loanScheme.save();

        console.log("Loan Scheme is Created SuccessFully!");
        res.status(201).json({
            message:"Loan Scheme is Created",
            data:{
                createdLoanScheme
            }
        })
        
    } catch (error) {
        console.log("Error Creating Loan Scheme:", error);
        res.status(500).
        json({
            message: "Internal Server Error",
            error: error.message,
        })
        
    }
}

export const getAllLoanSchemes = async (req, res) => {
  try {
    const allLoanScheme = await LoanSchemes.find();
    if (allLoanScheme.length === 0){
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
  const loanScheme = await LoanSchemes.findById(req.params.id);
  if (!loanScheme) {
    res.status(401).json({
      message: " Loan Scheme already Exist!",
      error: "NotExist",
    });
  }
  res.status(201).json({
    message: " Loan Scheme fetch! ",
    data: {
      loanScheme,
    },
  });
};

export const updateLoanScheme = async (req, res) => {
  try {
    const existScheme = await LoanSchemes.findByOne(req.params.id);
    if (existScheme) {
      console.log("This code {$existScheme} of Scheme is already Exist!");
      res.status(401).json({
        message: " Loan Scheme already Exist!",
        error: "NotExist",
      });
    }

    const updateScheme = await LoanSchemes.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    console.log("Update Scheme SuccessFully!");

    res.status(201).json({
      message: " Update Scheme",
      data: {
        updateScheme,
      },
    });
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

    const { bankId, loanType, minInterest, maxInterest, tenure, isVerified } = req.query;

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
      _id: { $in: schemeIds }
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