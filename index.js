const express = require("express");
const app = express();
const cors = require("cors")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const chatRoutes = require("./routes/chat")
const fileUpload = require("express-fileupload");
const {dbConnect} = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudnery")
require("dotenv").config();


const PORT = process.env.PORT || 4000

//db connection
dbConnect();

// middle wares
app.use(express.json());

app.use(
    cors({
        origin:"*",
		credentials:true,
    },)
);

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    })
)


cloudinaryConnect();

// mounting
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes)



// start server
app.listen(PORT, () => {
    console.log("server started successfully");
})

