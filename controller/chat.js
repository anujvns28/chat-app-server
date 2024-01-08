const User = require("../models/user");
const Chat = require("../models/chat");

exports.createChat = async(req,res) => {
    try{
    const {userId,chatId,msz} = req.body;
    if(!userId  || !chatId || !msz){
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
        users : [userId,chatId]
    }

    const chat = await Chat.create(chatPayload);
    console.log(chat)

    return res.status(200).json({
        success:true,
        message:"msz send successfully",
        msz : chat
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
    const {userId,chatId} = req.body;
    if(!userId || !chatId) {
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

    const chats = await Chat.find({
        users : {
            $all : [userId,chatId]
        }
    })

    console.log(chats)

    return res.status(200).json({
        success:true,
        message:"Chat fetched successfully",
        chats:chats
    })

    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in fetchig msz "
        }) 
    }
}