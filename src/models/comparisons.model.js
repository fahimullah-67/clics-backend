import mongoose from "mongoose";

const comparisonsSchema = new mongoose.schema({
    userId:{
        type: mongoose.schema.Types.ObjectID,
        ref: "User",
        required: true,
    },
    loanSchemeId:{
        type: mongoose.schema.Types.ObjectID,
        ref: "LoanSchemes",
        required: true,
    }
    
},{
    timestamps: true,
})

const Comparison = mongoose.model("Comparison", comparisonsSchema);
export default Comparison;