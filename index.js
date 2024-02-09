const express = require("express");
const app = express();
const {createServer}  = require("node:http")
const cors = require("cors")
const {Server} = require("socket.io");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");
const fileUpload = require("express-fileupload");
const {dbConnect} = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudnery")
require("dotenv").config();

const server = createServer(app)

const PORT = process.env.PORT || 4000

//db connection
dbConnect();

// middle wares
app.use(express.json());

app.use(
    cors({
        origin:"'http://localhost:3000'",
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
app.use("/api/v1/group",groupRoutes)


// start server
server.listen(PORT, () => {
    console.log("server started successfully");
})

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  global.onlineUser = new Map();

  io.on('connection', (socket) => {
    global.chatSocket = socket

        socket.on("add-user",(data) => {
        onlineUser.set(data.userId,socket.id)
        console.log('a user connected',data.userName,socket.id);
    })

    socket.on("msz",(data) => { 
          if(typeof(data.chatId) !== "object"){
            const userSocket = onlineUser.get(data.chatId);
            if(userSocket){
              socket.join(userSocket);
          }
            console.log(io.sockets.adapter.rooms.get(userSocket),"sokcets number before");
            io.sockets.in(userSocket).emit("msg-recive",data)
          }else{
            let userSocket
            console.log(data)
            data.chatId.members.map((user) => {
               userSocket = onlineUser.get(user);
                if(userSocket){
                    socket.join(userSocket);
                }
            })
            console.log(io.sockets.adapter.rooms.get(userSocket),"sokcets number");
            io.sockets.in(userSocket).emit("msg-recive",data)
          }
    })

  });


