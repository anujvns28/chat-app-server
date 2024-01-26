const Group = require("../models/group");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// creating group
exports.createGroup = async (req, res) => {
    try {
        //fetching data
        console.log("habibi come to banars")
        const { groupName, members, groupDesc, userId } = req.body;


        //vallidation
        if (!groupName || !members || !groupDesc || !userId) {
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
            groupDesc: groupDesc,
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




        return res.status(200).json({
            success: true,
            message: "group created",
            data: group
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