
const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    fileUrl: {
        type:String,
        required:true,
    },
    fileType : {
        type:String,
        required:true,  
    },
    userId: {
        type :mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    label: {
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        exexpires:24*60*60
    }

})

module.exports = mongoose.model("Status", statusSchema);