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
        
    } catch (error) {
        
    }
    
}