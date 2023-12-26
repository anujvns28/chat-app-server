const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true 
    }).then(() => console.log("DB Connection Successfull"))
    .catch((err) => {
        console.log("error occuring in db conncection")
        console.log(err)
    })
}