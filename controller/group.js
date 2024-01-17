const Group = require("../models/group");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.createGroup = async(req,res) => {
    try{
    //fetching data
    console.log("habibi come to banars")
    const {groupName,members,groupDesc,userId} = req.body;

    console.log(typeof(members))

    //vallidation
    if(!groupName || !members || !groupDesc || !userId){
        return res.status(500).json({
            success:false,
            message:"All fild are required"
        })
    }
    let image = req.body.image;
    let imageUrl


    if(image == undefined){
        const image = req.files.groupProfile
        image = req.files.image
    }

    // upload image or updat image
    if(typeof(image)=== "object"){
      const  currimage = await uploadImageToCloudinary(image) ;
        console.log(currimage.secure_url,"printing currimage url jiii")
        imageUrl = currimage.secure_url;
    }else{
        imageUrl = image
    }

    // push group id in user contact
    members.map(async(mem) => {
        await  User.findByIdAndUpdate(mem,{
        $push : {
            group : mem
        }
       },{new:true})
    })

    
    // create grooup
     const groupPayload = {
         groupName : groupName,
        groupDesc : groupDesc,
        groupImg : imageUrl,
        members : members,
        admin : userId,
    }

    const group = await Group.create(groupPayload);

    console.log(group)

    return res.status(200).json({
        success : true,
        message : "group created",
        data : group
    })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Error occured in creating group"
        })
    }
}