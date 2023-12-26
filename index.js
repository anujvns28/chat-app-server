const express = require("express");
const app = express();

const {dbConnect} = require("./config/database");
require("dotenv").config();


const PORT = process.env.PORT || 4000

//db connection
dbConnect();

// middle wares
app.use(express.json());



// mounting


// start server
app.listen(PORT, () => {
    console.log("server started successfully");
})

