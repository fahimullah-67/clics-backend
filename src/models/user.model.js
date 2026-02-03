import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required: true,
    },
    email:{
        type : String,
        required: true,
        unique:true,
        match: /.+\@.+\..+/

    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type:String,
        enum : ["user" , "admin" ]
    },
    language:{
        type: String,
        default: "en"
    },
    address:{
        country: String,
        street: String,
        city: String,
    },
    phone:{
        type: String,
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    lastLoginAt:{
        type: Date,
        default: null,
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;