const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
about : {
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
group:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Group"   
}],

 block:Array,
  
allUser:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}],

isGroup:{
    type:Boolean,
    default:false
}
})

module.exports = mongoose.model("User",userSchema)