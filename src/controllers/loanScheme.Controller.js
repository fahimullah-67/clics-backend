import LoanSchemes from "../models/loanSchemes.model";

export const createLoanScheme = async (req, res) => {
    try {
        
        const {schemeCode} = req.body;
        const loanScheme =  LoanSchemes(req.body)

        const existScheme = await findByOne({schemeCode: schemeCode});
        if(schemeCode){
            console.log("Scheme Already Exist, The Scheme code is : {$schemeCode}");
            
            return res.status(401).json({
                message:"Scheme All Ready Exist!",
                error: "SchemeExist"
            })
        }

        const createdLoanScheme = await loanScheme.save().select(
            -lastUpdatedAt -lastScriptedAt
        )

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
    if (!allLoanScheme) {
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
  const loanScheme = LoanSchemes.findById(req.params.id);
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
    const existScheme = await findByOne(req.params.id);
    if (existScheme) {
      console.log("This code {$existScheme} of Scheme is already Exist!");
      res.status(401).json({
        message: " Loan Scheme already Exist!",
        error: "NotExist",
      });
    }

    const updateScheme = await findByIdAndUpdate(
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
    const schemeDelete = await findByIdDelete(req.params.id);
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
};

export const filterLoanSchemes = async (req, res) => {
  try {
  } catch (error) {}
};

export const compareLoanSchemes = async (req, user) => {
  try {
  } catch (error) {}
};