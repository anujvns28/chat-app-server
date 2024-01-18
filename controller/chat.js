const User = require("../models/user");
const Chat = require("../models/chat");

exports.createChat = async(req,res) => {
    try{
    const {userId,chat,msz} = req.body;
    let member = [...chat];
    console.log(member,"this are members")
    if(!userId  || !chat || !msz){
        return res.status(400).json({
            success:false,
            message:"All filds are required"
        })
    }

    
    const user = User.findById(userId);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"You are not vallid user"
        }) 
    }

    
    const chatPayload = {
        msz : msz,
        senderId : userId,
        users : typeof(chat) == "object" ? member : [userId,chat]
    }

    const message = await Chat.create(chatPayload);
    console.log(message)

    return res.status(200).json({
        success:true,
        message:"msz send successfully",
        msz : message
    })

   }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in Sending msz "
        })
    }
}

exports.fetchedChat = async(req,res) => {
    try{
    const {userId,chat} = req.body;
    let messages
   
    if(!userId || !chat) {
        return res.status(400).json({
            success:false,
            message:"userId is required"
        })
    }

    const user = User.findById(userId);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"You are not vallid user"
        }) 
    }
    
    if(typeof(chat) !== "object"){
         messages = await Chat.find({
            users : {
                $all : [userId,chat]
            }
        })
    }else{
         messages = await Chat.find({
            users : {
                $eq :  chat
            }
        })
    }

    

    //console.log(messages)

    return res.status(200).json({
        success:true,
        message:"Chat fetched successfully",
        chats:messages
    })

    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in fetchig msz "
        }) 
    }
}