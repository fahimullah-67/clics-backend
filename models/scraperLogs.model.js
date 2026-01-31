import mongoose from "mongoose";

const ScraperLogSchema = new mongoose.schema({
    bankId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
        required: true,
    },
    runDate:{
        type:Date,
        default: Date.now,
    },
    status:{
        type: String,
        enum: ['started', 'completed', 'failed'],
    },
    totalSchemesFound:{
        type: Number,
    },
    totalUpdated:{
        types:Number,
    },
    errorMessage:{
        type: String,
    },
    executedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
},{
    timestamps:true,
})

const ScraperLog = mongoose.model("ScraperLog", ScraperLogSchema);
export default ScraperLog;

// ScraperLog stores logs of each scraping run for auditing and monitoring purposes.
