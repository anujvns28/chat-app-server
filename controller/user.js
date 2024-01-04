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
           contact : userId 
        }
    },{new:true})

    //update reciver
    const senderId = sender._id
    await User.findByIdAndUpdate(userId,{
        $push : {
           contact : senderId 
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