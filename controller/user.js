const User = require("../models/user")
const sendMail = require("../utils/mailSender")


exports.sendFraindRequest = async(req,res) =>{
    try{
        // fatching email
        const {email,userId} = req.body

        //vallidation
        if(!email || !userId){
            return res.status(500).json({
                success :false,
                message: "Email is required"
            })  
        }
        
        if(!email.includes("@gmail.com")){
            return res.status(500).json({
                success :false,
                message: "This is not vallied email"
            })
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(500).json({
                success :false,
                message: "You are not vallied user"
            })
        }
        
        const fraind = await User.findOne({email:email});
        if(fraind){
            const fraindId = fraind._id
            console.log(fraindId)
            if(user.contact.includes(fraindId)){
                return res.status(500).json({
                    success :false,
                    message: "This user is alredy in your contact"
                })  
            }
        }

        console.log("idar tak okk")

        const url = `http://localhost:3000/request/${user.token}`
        if(!url){
            return res.status(500).json({
                success :false,
                message: "Can not Send fraind request"
            })
        }

        sendMail(email,`Fraind Request from ${email}`,url)

        return res.status(200).json({
            success:true,
            message:"Fraind Request successfully",
            data: user
        })
        

    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in Sending fraind request"
        })
    }
}


exports.acceptFraindRequest = async(req,res) => {
    try{
     // fatching email
     const {userId,token} = req.body;

     //vallidation
     if(!userId || !token){
        return res.status(500).json({
            success :false,
            message: "all fileds required"
        })  
    }

    const reciver = await User.findById(userId)
        if(!reciver){
            return res.status(500).json({
                success :false,
                message: "You are not vallied user"
            })
        }

    const sender = await User.findOne({token:token})
        if(!sender){
            return res.status(500).json({
                success :false,
                message: "Sender is not vallied user"
            })
        } 
    
    if(sender){
            const senderId = sender._id
            if(reciver.contact.includes(senderId)){
                return res.status(500).json({
                    success :false,
                    message: "You are alredy accept This Fraind request"
                })  
            }
    }
    
        

    //update sender
    await User.findOneAndUpdate({token:token},{
        $push : {
           contact : userId,
           allUser : userId 
        }
    },{new:true})

    //update reciver
    const senderId = sender._id
    await User.findByIdAndUpdate(userId,{
        $push : {
           contact : senderId,
           allUser : userId
        }
    },{new:true})

    return res.status(200).json({
        success:true,
        message:"Accepted Request"
    })
       

    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in Accepting fraind request"
        })   
    }
}

// get all user in contact list
exports.getAllContact = async(req,res) => {
try{
    // fetching data
    const {userId} = req.body
    
    if(!userId){
        return res.status(400).json({
            success:false,
            message:"UserId is required"
        })
    }

    const user = await User.findById(userId).populate("contact").exec();
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Your are not vallied user"
        })
    }

    return res.status(200).json({
        success:true,
        message:"fetched successfully",
        data:user.contact
    })

}catch(err){
    console.log(err)
    return res.status(400).json({
        success:false,
        message:"Error occuring in fetching contacts"
    })   
}
}

// block user
exports.blockUser = async(req,res) => {
    try{
     const {userId,chatId} = req.body;
     
     if (!userId,!chatId) {
        return res.status(400).json({
            success: false,
            message: "All filds are required"
        })
    }

    const userData = await User.findById(userId);
    const chatData = await User.findById(chatId);

    // console.log(chatData)

    if(!userData){
        return res.status(400).json({
            success: false,
            message: "You aer not vallid user"
        }) 
    }

    if(!chatData){
        return res.status(400).json({
            success: false,
            message: "Chat is not vallid user"
        }) 
    }

    // push user id in block array
    await User.findByIdAndUpdate(userId,{
        $push : {
           block :  {user: chatId, isYouBlock : true}
        }
    },({new:true}))

    await User.findByIdAndUpdate(chatId,{
        $push : {
           block : {user: userId, isYouBlock :false} 
        }
    },({new:true}))

    
    return res.status(200).json({
        success : true,
        message : "User blocked successfull",
       
    })


    }catch(err){
    console.log(err)
    return res.status(400).json({
        success:false,
        message:"Error blocking chat"
    })   
}
}

// block user
exports.unBlockUser = async(req,res) => {
    try{
     const {userId,chatId} = req.body;
     
     if (!userId,!chatId) {
        return res.status(400).json({
            success: false,
            message: "All filds are required"
        })
    }

    const userData = await User.findById(userId);
    const chatData = await User.findById(chatId);

    // console.log(chatData)

    if(!userData){
        return res.status(400).json({
            success: false,
            message: "You aer not vallid user"
        }) 
    }

    if(!chatData){
        return res.status(400).json({
            success: false,
            message: "Chat is not vallid user"
        }) 
    }

    // push user id in block array
    await User.findByIdAndUpdate(userId,{
        $pull : {
           block : {user : chatId} 
        }
    },({new:true}))

    await User.findByIdAndUpdate(chatId,{
        $pull : {
           block : {user : userId} 
        }
    },({new:true}))


    
    return res.status(200).json({
        success : true,
        message : "User unblocked successfull",
       
    })


    }catch(err){
    console.log(err)
    return res.status(400).json({
        success:false,
        message:"Error unblocking chat"
    })   
}
}

exports.getUser = async(req,res) =>{
    try{
   const userId = req.body.userId;

   const user = await User.findById(userId).populate("contact").exec();

   console.log(user)

   
   return res.status(200).json({
    success: true,
    message: "User response",
    data: user,

})

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in sending resustring user",
        })  
    }
}

// delete user
exports.deleteUser = async(req,res) => {
    try{
        const {userId,chatId} = req.body;
     
        if (!userId,!chatId) {
           return res.status(400).json({
               success: false,
               message: "All filds are required"
           })
       }
   
       const userData = await User.findById(userId);
       const chatData = await User.findById(chatId);
   
       // console.log(chatData)
   
       if(!userData){
           return res.status(400).json({
               success: false,
               message: "You aer not vallid user"
           }) 
       }
   
       if(!chatData){
           return res.status(400).json({
               success: false,
               message: "Chat is not vallid user"
           }) 
       }
   
       // pull user id in block array
       await User.findByIdAndUpdate(userId,{
           $pull : {
              contact : chatId
           }
       },({new:true}))
       
       return res.status(200).json({
           success : true,
           message : "User deleted successfull",
       })
   
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in Deleting  user",
        })  
    }
}

// add user in contact
exports.addUserInConatact = async(req,res) => {
    try{
        const {userId,chatId} = req.body;
     
        if (!userId,!chatId) {
           return res.status(400).json({
               success: false,
               message: "All filds are required"
           })
       }
   
       const userData = await User.findById(userId);
       const chatData = await User.findById(chatId);
   
       // console.log(chatData)
   
       if(!userData){
           return res.status(400).json({
               success: false,
               message: "You aer not vallid user"
           }) 
       }
   
       if(!chatData){
           return res.status(400).json({
               success: false,
               message: "Chat is not vallid user"
           }) 
       }

       if(userData.contact.includes(chatId)){
        return res.status(400).json({
            success: false,
            message: "user is alredy in your contact"
        }) 
       }
   
       // puss user id in block array
       await User.findByIdAndUpdate(userId,{
           $push : {
              contact : chatId
           }
       },({new:true}))
       
       return res.status(200).json({
           success : true,
           message : "User deleted successfull",
       })
   
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in Deleting  user",
        })  
    }
} 

// get all user in allUser list
exports.getAllUser = async(req,res) => {
    try{
        // fetching data
        const {userId} = req.body
        
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"UserId is required"
            })
        }
    
        const user = await User.findById(userId).populate("allUser").exec();
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Your are not vallied user"
            })
        }
    
        return res.status(200).json({
            success:true,
            message:"fetched successfully",
            data:user
        })
    
    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in fetching allUser"
        })   
    }
    }

