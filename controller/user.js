const User = require("../models/user");
const Status = require("../models/status")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
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

        
        if(fraind){
            await User.findByIdAndUpdate(fraind._id,{
                $push : {
                request : userId
                }
            },{new:true})
    
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
    const userData =   await User.findByIdAndUpdate(userId,{
        $push : {
           contact : senderId,
           allUser : senderId
        }
    },{new:true}).populate("contact").populate("group").exec();

    return res.status(200).json({
        success:true,
        message:"Accepted Request",
        data : userData
    })
       

    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in Accepting fraind request"
        })   
    }
}

//fetching fraind request sender data
exports.getSenderRequestData = async(req,res) =>{
    try{
    const tokenId = req.body.token;

    if(!tokenId){
        return res.status(500).json({
            success:false,
            message:"Token is required"
        })
    }

    const user = await User.findOne({token:tokenId})

    return res.status(200).json({
        success:true,
        message:"fetched Successfully",
        data : user
    })
    
    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:"Error occuring in fetching fraind request data"
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

    const user = await User.findById(userId).populate({
        path : "contact",
        populate : {
        path : "status"
        }
    }).exec();

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
const userInfo =     await User.findByIdAndUpdate(userId,{
        $push : {
           block :  {user: chatId, isYouBlock : true}
        }
    },({new:true})).populate("contact").populate("group").exec();

    await User.findByIdAndUpdate(chatId,{
        $push : {
           block : {user: userId, isYouBlock :false} 
        }
    },({new:true}))

    
    return res.status(200).json({
        success : true,
        message : "User blocked successfull",
        data : userInfo
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
const userInfo =   await User.findByIdAndUpdate(userId,{
        $pull : {
           block : {user : chatId} 
        }
    },({new:true})).populate("contact").populate("group").exec();

    await User.findByIdAndUpdate(chatId,{
        $pull : {
           block : {user : userId} 
        }
    },({new:true}))


    
    return res.status(200).json({
        success : true,
        message : "User unblocked successfull",
       data : userInfo
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
   const {userId} = req.body;
   if(!userId){
    return res.status(500).json({
        success:false,
        message:"userId is required"
    })
   }

   const user = await User.findById(userId).populate("contact").populate("group").exec();

   if(!user){
    if(!userId){
        return res.status(500).json({
            success:false,
            message:"You are not vallied user"
        })
       }
   }

   
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
    const userInfo =   await User.findByIdAndUpdate(userId,{
           $pull : {
              contact : chatId
           }
       },({new:true})).populate("contact").populate("group").exec();
       
       return res.status(200).json({
           success : true,
           message : "User deleted successfull",
           data : userInfo
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
     const updatedData =   await User.findByIdAndUpdate(userId,{
           $push : {
              contact : chatId
           }
       },({new:true})).populate("contact").populate("group").exec();
       
       return res.status(200).json({
           success : true,
           message : "User Added successfully",
           data : updatedData
       })
   
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in adding user",
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


    // change group img
exports.changDp = async(req,res) => {
    try{
    // fetch img
    const {userId} = req.body;

    const groupImg = req.files.image;

    console.log(req.body)
    console.log(req.files)
    if(!groupImg ||  !userId ){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }
     
    const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }  

    const img = await uploadImageToCloudinary(groupImg);

    const userData = await User.findByIdAndUpdate(userId,{
        image : img.secure_url
    },{new:true}).populate("contact").populate("group").exec();

    return res.status(200).json({
        success:true,
        message : "Dp updated successfull",
        data : userData
    })

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in updating group img"
        })
    }
}


// change user  name
exports.changeUserName = async(req,res) => {
    try{
    // fetch img
    const {userId,userName} = req.body;

    
    if( !userName || !userId ){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }
     
    const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }  

  const userData =  await User.findByIdAndUpdate(userId,{
       name : userName
    },{new:true}).populate("contact").populate("group").exec();


    return res.status(200).json({
        success:true,
        message : "Group Name updated successfull",
        data: userData
    })

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in chaenging user name"
        })
    }
}

// chenge group des
exports.changeUserAbout = async(req,res) => {
    try{
    // fetch img
    const {userId,about} = req.body;


    if(!about || !userId ){
        return res.status(500).json({
            success:false,
            message:"all filds are required"
        })
    }
     
    const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }  

  const userData =  await User.findByIdAndUpdate(userId,{
       about : about 
    },{new:true}).populate("contact").populate("group").exec();


    return res.status(200).json({
        success:true,
        message : "user desc updated successfull",
        data : userData
    })



    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in updating  user desc"
        })
    }
}

//fetcha all requies
exports.fetchAllRequest = async(req,res) => {
    try{
  const {userId} = req.body;
  console.log(userId,"printig req body")

  const user = await User.findById(userId).populate("request").exec();

  if(!user){
    return res.status(500).json({
        success:false,
        message:"You are not vallied user",
      
    })
  }

  return res.status(200).json({
    success:true,
    message:"Request feteched sucessfully",
    data:user.request
  })


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching reqests"
        })  
    }
}

//create status
exports.createStatus = async(req,res) => {
    try{
    const {userId,label,fileType} = req.body;
    
    const file = req.files.file

    console.log(userId,label,fileType,file)

    if(!userId || !fileType){
         return res.status(500).json({
            success:false,
            message:"all filds are required"
    })
    }

    const user = await User.findById(userId);

  if(!user){
    return res.status(500).json({
        success:false,
        message:"You are not vallied user",
      
    })
  }

  const img = await uploadImageToCloudinary(file);
 
  const statusPayload = {
    label:label ? label : null,
    fileUrl:img.secure_url,
    fileType:fileType,
    userId:userId
  }

  const status = await Status.create(statusPayload);

  const userData = await User.findByIdAndUpdate(userId,{
    $push : {
        status : status
    }
  })

  return res.status(200).json({
    success:true,
    message:"Status add successfully",
    data : userData
  })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in creating status"
        }) 
    }
}

// fetch user all status
exports.fetchallStatus = async(req,res) => {
    try{
    const {userId} = req.body

    const user = await User.findById(userId);

    if(!user){
        return res.status(500).json({
            success:false,
            message:"You are not vallied user",
          
        })
      }

      const status = await Status.find({userId:userId});

      return res.status(200).json({
        success:true,
        message:"status fetched sucesfully",
        data : status
      })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in creating status"
        }) 
    }
}

// delete user Status
exports.deleteStatus = async(req,res) => {
    try{
    const {userId,statusId} = req.body;
    
    if(!userId || !statusId){
        return res.status(500).json({
            success:false,
            message:"All filds required"
        })
    }
    
    const user = await User.findById(userId);

    if(!user){
        return res.status(500).json({
            success:false,
            message:"You are not vallied user",
          
        })
    }

    await Status.findByIdAndDelete(statusId);

    await User.findByIdAndUpdate(userId,{
        $pull : {
            status : statusId
        }
    },{new:true})
    
    return res.status(200).json({
        success:true,
        message:"Status deleted sucessfully"
    })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in deleting stats status"
        })  
    }
}