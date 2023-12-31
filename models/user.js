const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    trim:true
},
password:{
    type:String,
    required:true,
    trim:true
},
image:{
    type:String,
    required:true
},
token:{
   type:String,
},
additionalInfo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Profile"
},
contact:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}],
block:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}]

})

module.exports = mongoose.model("User",userSchema)