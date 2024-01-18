const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupName : {
        require:true,
        type:String,
    },
    groupImg:{
        require:true,
        type:String
    },
    groupDesc : {
        type:String,
        default:null
    },
    members : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    admin : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isGroup:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("Group",groupSchema)