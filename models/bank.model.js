import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true,
    },
    bankCode:{
        type : String,
        required: true,
        unique:true,
    },
    webUrl:{
        type: String,
        required: true,
    },
    contactEmail:{
        type : String,
        required: true,
        unique:true,
        match: /.+\@.+\..+/
    },
    contactPhone:{
        type : String,
        required: true,
        unique:true,
    },
    logoURL:{
        type : String,
    }
})

const Bank = mongoose.model("Bank", bankSchema);
export default Bank;