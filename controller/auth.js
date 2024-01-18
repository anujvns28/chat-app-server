const User = require("../models/user");
const Otp = require("../models/otp")
const Profile = require("../models/profile")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const otpGenartor = require("otp-generator");
const sendMail = require("../utils/mailSender");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const crypto = require("crypto")



exports.sendOtp = async(req,res) =>{
    try{
   // fetching data
  const {email} = req.body;
  console.log(req.body,"this is req.body")

  // vallidation
  if (!email ) {
      return res.status(500).json({
          success: false,
          message: 'all fileds required afasfa'
      })
  }

  if(!email.includes("@gmail.com")){
    return res.status(500).json({
        success: false,
        message: 'This is not vallid email'
    })
  }

  //check user alredy rejustered or not
  const isUserExist = await User.findOne({ email: email });
  if (isUserExist) {
      return res.status(500).json({
          success: false,
          message: "User is already resjustered"
      })
  }

  // genarate otp
  const otp =  otpGenartor.generate(4,{
    lowerCaseAlphabets:false,
    upperCaseAlphabets:false,
    specialChars:false
  })

  // Unique otp
  let result = await Otp.findOne({ otp: otp });
            
            while (result) {
                otp = otpGenartor.generate(4, {
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                })
                result = await Otp.find({ otp: otp });
            }


  // create otp in db
  const otpPayload = {
    email:email,
    otp:otp
  }

  await Otp.create(otpPayload);

  // send otp in mail
   sendMail(email,"Email Varifaction mail",`otp : ${otp}`)


  return res.status(200).json({
    success:true,
    message:"otp Genarte successfully",
    otp:otp
  })

   

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "error occuring in genrating otp",
        })
    }
}

exports.signup = async(req,res) =>{
try{
// fetch data
const {email,name,password,confirmPassword,otp,} = req.body;

let image = req.body.image;
let imageUrl


if(image === undefined){
    image = req.files.image
}

// vallidation
if (!email || !name || !password || !confirmPassword || !otp ) {
    return res.status(500).json({
        success: false,
        message: 'all fileds required afasfa'
    })
}
//match passwords 
if (password !== confirmPassword) {
    return res.status(500).json({
        success: false,
        message: "password are not matching"
    })
}
//check user alredy rejustered or not
const isUserExist = await User.findOne({ email: email });
if (isUserExist) {
    return res.status(500).json({
        success: false,
        message: "User is already resjustered"
    })
}

const dbOtp = await  Otp.findOne({email:email}).sort({createdAt:-1}).limit(1);

console.log(dbOtp.otp,"this is dbotp")

if(otp !== dbOtp.otp){
    return res.status(500).json({
        success: false,
        message: "Invallid Otp"
    }) 
}
const uuid = crypto.randomUUID()
const hasedPassword = await bcrypt.hash(password, 10)

      // additional info
      const profilePayload = {
        gender:null,
        phone:null,
        dateOfBirth:null,
        about:null
      }

    const profile = await Profile.create(profilePayload);

    if(typeof(image)=== "object"){
        console.log("printing  url jiii")
      const  currimage = await uploadImageToCloudinary(image) ;
        console.log(currimage,"printing currimage url jiii")
        imageUrl = currimage.secure_url;
    }else{
        imageUrl = image
    }

        const userPayload = {
            name : name,
            email: email,
            password: hasedPassword,
            image: imageUrl,
            additionalInfo: profile._id,
            token: uuid
        }

        // creading data in deb
        const user = await User.create(userPayload);
       
        return res.status(200).json({
            success: true,
            message: "entry created",
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



    exports.login = async (req, res) => {
        try {
            // fetching data
            const { email, password } = req.body;
            //valildation
            if (!email || !password) {
                return res.status(500).json({
                    success: false,
                    message: "all filed are requird",
                })
            }
            // user is resjusterd or not
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "user is not rejustered plese Signup first",
                })
            }
            // matching password
            if (await bcrypt.compare(password, user.password)) {
                const payload = {
                    email:user.email,
                     id : user._id
                }
                // create jwt 
                const token = jwt.sign(payload, process.env.JWT_SERCET, {
                    expiresIn: "2h"
                })

                console.log(token,"this is token")
              
                user.token = token
        
                return res.status(200).json({
                    success: true,
                    token,
                    user,
                    messege: "Loged in successfully"
                })
            }
            else{
                return res.status(500).json({
                    success: false,
                    message: "password is not matching",
                })
            }
    
           
    
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: "error occuring in doing login",
            })
        }
    }



exports.getUser = async(req,res) =>{
    try{
   const userId = req.body.userId;

   const user = await User.findById(userId).populate("contact").populate("block").exec();

   console.log(user)

   
   return res.status(200).json({
    success: true,
    message: "entry created",
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