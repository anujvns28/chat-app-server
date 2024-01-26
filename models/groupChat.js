
const mongoose = require("mongoose");

const groupChatSchema = new mongoose.Schema({
    msz: {
        type:String,
        required:true,
    },
    users : Array,

     senderId: {
        type :mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date:{
     type :Date,
     default : Date.now
    }

})

module.exports = mongoose.model("Chat", groupChatSchema)