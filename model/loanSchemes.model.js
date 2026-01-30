import mongoose from "mongoose";

const loanSchemesSchema = new mongoose.Schema({
    bankId:{
        type: mongoose.schema.types.ObjectID,
        ref: "Bank",
        required: true,
    },
    schemeName:{
        type: String,
        required: true,

    },
    schemeCode:{
        type: String,
        required: true,
        unique: true,
    },
    typeLoan:{
        type: String,
        required: true,
        enum: ["personal", "home", "auto", "education", "business"],
    },
    interestRate:{
        type: Number,
        required: true,
        min: 0,
    },
    interestType:{
        type: String,
        enum: ["fixed", "variable"],
        required: true,
    },
    tenureMin:{
        type: Number,
        required: true,
        min: 1,
    },
    tenureMax:{
        type: Number,
        required: true,
        min: 1,
    },
    processingFee:{
        type: String,
        required: true,
        enum: ["flat", "percentage", "none"],
    },
    latePaymentFee:{
        type: Number,
        required: true,
        min: 0,
    },
    minSalaryRequired:{
        type: Number,
        required: true,
        min: 0,
    },
    ageMin:{
        type: Number,
        required: true,
        min: 0,
    },
    ageMax:{
        type: Number,
        required: true,
        min: 0,
    },
    eligibilityCriteria:{
        type: String,
        required: true,

    },
    requiredDocuments:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    currency:{
        type: String,
        required: true,
        default: "PKR",

    },
    isIslamic:{
        type: Boolean,
        required: true,
        default: false,
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    lastScriptedAt:{
        type: Date,
        default: null,
    },
    lastUpdatedAt:{
        type: Date,
        default: null,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    verifiedBY:{
        type: mongoose.schema.types.ObjectID,
        ref: "User",
        default: null,
    },
    
},{
    timestamps: true
})

const LoanSchemes = mongoose.model("LoanSchemes", loanSchemesSchema);

export default LoanSchemes;