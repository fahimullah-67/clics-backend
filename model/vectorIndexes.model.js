import mongoose from "mongoose";

const vectorIndexSchema = new mongoose.Schema({
    loanSchemeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanSchemes",
        required: true,
    },
    snapshotId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snapshot",
        required: true,
    },
    textChunks:{
        type: [String],
        required: true,
    },
    vectorEmbeddings:{
        type: [[Number]],
        required: true,
    },

},
{
    timestamps:true,
})

const VectorIndex = mongoose.model("VectorIndex", vectorIndexSchema);
export default VectorIndex;

// VectorIndex stores vector embeddings of text chunks extracted from loan scheme snapshots
// to facilitate efficient semantic search and retrieval for AI-driven functionalities.