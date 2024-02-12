const Group = require("../models/group");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// creating group
exports.createGroup = async (req, res) => {
    try {
        //fetching data
        console.log("habibi come to banars")
        const { groupName, members,  userId,groupDesc } = req.body;

        //vallidation
        if (!groupName || !members  || !userId) {
            return res.status(500).json({
                success: false,
                message: "All fild are required"
            })
        }
        let image = req.body.image;
        let imageUrl


        if (image == undefined) {
            const image = req.files.groupProfile
            image = req.files.image
        }

        // upload image or updat image
        if (typeof (image) === "object") {
            const currimage = await uploadImageToCloudinary(image);
            console.log(currimage.secure_url, "printing currimage url jiii")
            imageUrl = currimage.secure_url;
        } else {
            imageUrl = image
        }

        // create grooup
        const groupPayload = {
            groupName: groupName,
            groupDesc: groupDesc ? groupDesc : null,
            members: members,
            groupImg: imageUrl,
            admin: userId,
        }

        const group = await Group.create(groupPayload);

        // push group id in member groups
        members.map(async (mem) => {
            await User.findByIdAndUpdate(mem, {
                $push: {
                    group: group._id
                }
            }, { new: true })
        })

        const userData = await User.findById(userId).populate("contact").populate("group").exec();




        return res.status(200).json({
            success: true,
            message: "group created",
            data: userData
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in creating group"
        })
    }
}


// fetching group
exports.fetchGroup = async (req, res) => {
    try {
        // fetching data
        const { userId } = req.body;

        if (!userId) {
            return res.status(500).json({
                success: false,
                message: "userid is required"
            })
        }

        const user = await User.findById(userId)
            .populate("group").exec();

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }

        // return res
        return res.status(200).json({
            success: false,
            message: true,
            data: user.group
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching group"
        })
    }
}


exports.fetchGroupInformation = async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Groupid is required"
            })
        }

        const groupInfo = await Group.findById(groupId)
            .populate("members")
            .populate("admin")
            .exec()

        if(!groupInfo){
            return res.status(400).json({
                success: false,
                message: "Groupid is not vallied"
            })  
        }  

      //  console.log(groupInfo)
        
        return res.status(200).json({
            success : true,
            message : " group in fromation send sucessful",
            data : groupInfo
        })
        

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching group information"
        })
    }
}

// fetching common group
exports.commonGroup = async (req, res) => {
    try {
        const {userId,chatId } = req.body;
       console.log(req.body)
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

        const commonGroup = await Group.find({
            members : {
                $in : [userId,chatId]
            }
        })
        console.log(commonGroup,"printing common group")
        
        return res.status(200).json({
            success : true,
            message : " group in fromation send sucessful",
            data : commonGroup
        })
        

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching group information"
        })
    }
}

// exist in group
exports.exitUser = async(req,res) => {
    try{
        const {userId,groupId} = req.body;
     
        if (!userId || !groupId) {
           return res.status(400).json({
               success: false,
               message: "All filds are required"
           })
       }
   
       const userData = await User.findById(userId);
       const groupData = await Group.findById(groupId);
   
       // console.log(chatData)
   
       if(!userData){
           return res.status(400).json({
               success: false,
               message: "You aer not vallid user"
           }) 
       }
   
       if(!groupData){
           return res.status(400).json({
               success: false,
               message: "Chat is not vallid user"
           }) 
       }
   
       // pull user id in block array
       await User.findByIdAndUpdate(userId,{
           $pull : {
              group : groupId
           }
       },({new:true}))

       // pull userid in group member section
       await Group.findByIdAndUpdate(groupId,{
           $pull : {
            members : userId
           }
       },{new:true})
       
       return res.status(200).json({
           success : true,
           message : " you are successfull exist in the group",
       })
   
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in Deleting  user",
        })  
    }
}


// add group members
exports.addGroupMember = async(req,res) => {
    try{
        const {userId,groupId,members} = req.body;
        console.log(req.body)
     
        if (!userId || !groupId || !members ) {
           return res.status(400).json({
               success: false,
               message: "All filds are required"
           })
       }
   
       const userData = await User.findById(userId);
       const groupData = await Group.findById(groupId);
   
       // console.log(chatData)
   
       if(!userData){
           return res.status(400).json({
               success: false,
               message: "You aer not vallid user"
           }) 
       }
   
       if(!groupData){
           return res.status(400).json({
               success: false,
               message: "This is not vallied group"
           }) 
       }
   
       // pull user id in block array
       members.map( async(userId) => {
        await User.findByIdAndUpdate(userId,{
            $push : {
               group : groupId
            }
        },({new:true}))
       })

       // pull userid in group member section
       members.map(async(userId) =>{
        await Group.findByIdAndUpdate(groupId,{
            $push : {
             members : userId
            }
        },{new:true})
       })
       
       return res.status(200).json({
           success : true,
           message : " you are successfull exist in the group",
       })
   
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in adding user in group",
        })   
    }
}


// make adimn
exports.makeGroupAdmin = async (req, res) => {
    try {
        // fetching data
        const { userId ,groupId} = req.body;

        if (!userId || !groupId) {
            return res.status(500).json({
                success: false,
                message: "all filds are rquired is required"
            })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }

        await Group.findByIdAndUpdate(groupId,{
            $push: {
               admin : userId 
            }
        },{new:true})

        // return res
        return res.status(200).json({
            success: true,
            message : "User is successfully made admin"
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching group"
        })
    }
}

exports.dismissGroupAdmin = async (req, res) => {
    try {
        // fetching data
        const { userId ,groupId} = req.body;

        if (!userId || !groupId) {
            return res.status(500).json({
                success: false,
                message: "all filds are rquired is required"
            })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(500).json({
                success: false,
                message: "you are not vallied user"
            })
        }

        await Group.findByIdAndUpdate(groupId,{
            $pull: {
               admin : userId 
            }
        },{new:true})

        // return res
        return res.status(200).json({
            success: true,
            message : "User is successfully made admin"
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching group"
        })
    }
}

// change group img
exports.changeGroupImg = async(req,res) => {
    try{
    // fetch img
    const {groupId,userId} = req.body;

    const groupImg = req.files.image;
    if(!groupImg || !groupId || !userId ){
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

    const group = await Group.findById(groupId);
        if (!group) {
            return res.status(500).json({
                success: false,
                message: "Group id is not vallied"
            })
        }
    if(!group.admin.includes(userId)){
        return res.status(500).json({
            success: false,
            message: "You are not admin"
        })
    } 

    const img = await uploadImageToCloudinary(groupImg);

    const groupData = await Group.findByIdAndUpdate(groupId,{
        groupImg : img.secure_url
    },{new:true})

    return res.status(200).json({
        success:true,
        message : "Group img updated successfull",
        data : groupData
    })

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching group"
        })
    }
}


// change group name
exports.changeGroupName = async(req,res) => {
    try{
    // fetch img
    const {groupId,userId,groupName} = req.body;

    
    if(!groupName || !groupId || !userId ){
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

    const group = await Group.findById(groupId);
        if (!group) {
            return res.status(500).json({
                success: false,
                message: "Group id is not vallied"
            })
        }
    if(!group.admin.includes(userId)){
        return res.status(500).json({
            success: false,
            message: "You are not admin"
        })
    } 

  const groupData =  await Group.findByIdAndUpdate(groupId,{
       groupName : groupName
    },{new:true})

    return res.status(200).json({
        success:true,
        message : "Group Name updated successfull",
        data: groupData
    })

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in chaenging group name"
        })
    }
}

// chenge group des
exports.changeGroupDes = async(req,res) => {
    try{
    // fetch img
    const {groupId,userId,groupDes} = req.body;


    if(!groupDes || !groupId || !userId ){
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

    const group = await Group.findById(groupId);
        if (!group) {
            return res.status(500).json({
                success: false,
                message: "Group id is not vallied"
            })
        }
    if(!group.admin.includes(userId)){
        return res.status(500).json({
            success: false,
            message: "You are not admin"
        })
    } 


  const groupData =  await Group.findByIdAndUpdate(groupId,{
        groupDesc : groupDes
    },{new:true})

    return res.status(200).json({
        success:true,
        message : "Group desc updated successfull",
        data : groupData
    })

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in updating  group desc"
        })
    }
}