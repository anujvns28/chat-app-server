const User = require("../models/user");
const Groupchat = require("../models/groupChat");
const OneOneChat = require("../models/oneoneChat");


exports.createGroupChat = async(req,res) => {
    try{
    const {userId,groupMem,msz,groupId} = req.body;

    if(!userId  || !groupMem || !msz || !groupId){
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
       // users : groupMem
       groupId : groupId
    }

    const message = await Groupchat.create(chatPayload);
   // console.log(message)

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

exports.fetchGroupChat = async(req,res) => {
    try{
    const {userId,chat} = req.body;
   
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
    
    
    let messages = await Groupchat.find({
        groupId : chat
    }).populate("senderId").exec();

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

exports.createOneOneChat = async(req,res) => {
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

    const message = await OneOneChat.create(chatPayload);
   // console.log(message)

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

exports.fetchOneoneChat = async(req,res) => {
    try{
    const {userId,chat} = req.body;
   
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
    
    
    let messages = await OneOneChat.find({
            users : {
                $all : [userId,chat]
            }
        })

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