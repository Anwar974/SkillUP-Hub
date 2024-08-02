import userModel from "../../../db/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../ults/email.js";
import { customAlphabet } from "nanoid";
import { sendCodeTemplate, welcomeEmailTemplate } from "../../ults/emailTemplete.js";

export const register = async (req, res)=>{
    const {userName,email,password} = req.body;
  
    if ( await userModel.findOne({ userName })) {
        return res.status(400).json({ message: 'Username already in use' });
    }

    const hashedPassword= bcrypt.hashSync(password,parseInt(process.env.SALTROUND))
    const createUser= await userModel.create({userName,email,password:hashedPassword})
    const token = jwt.sign({email},process.env.CONFIRMSIGN)
 
    
    await sendEmail(email, 'Welcome', welcomeEmailTemplate, { userName, token });
    return res.status(201).json({message:"success",user:createUser})

}

export const confirmEmail = async (req, res)=>{
    try{
    const token= req.params.token;
    const decoded= jwt.verify(token,process.env.CONFIRMSIGN)
 await userModel.findOneAndUpdate({email:decoded.email},{confirmEmail:true})
 return res.status(200).json({message:"success"})
} catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
}

}

export const login = async(req, res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    if(!user) {
        return res.status (400).json({message: "invalid data"});

    }

    if (!user.confirmEmail){
        return res.status(400).json({message:"plz confirm your email"});
    }

    const match = await bcrypt.compare(password, user.password);
    if(user.status=="NotActive"){
        return res.status(400).json({message: "your account is blocked"});


    }
    if(!match) {
    return res.status(400).json({message: "invalid data"});
    }
    

const token = jwt.sign({id:user._id, role:user.role, status:user.status}, process.env.LOGINSIG);

    return res.status (200).json({message: "success", token});
}

export const sendCode = async(req,res) => {
    const {email} = req.body;

    const code = customAlphabet('1234567890abcdef', 6)();
    const user = await userModel.findOneAndUpdate({email},{sendCode:code}, {new:true});

    if (!user){
        return res.status(404).json({message:"email not found"});
    }

    await sendEmail(email, 'Password Reset Code', sendCodeTemplate,  {userName:user.userName,code});

    return res.status(200).json({message:"success"});

}

export const forgotPassword = async(req,res) => {
    const {email,password,code} = req.body;
    const user = await userModel.findOne({email});

    if (!user){
        return res.status(404).json({message:"email not found"});
    }
    if (user.sendCode!= code){
        return res.status(400).json({message:"invalid code"});
    }
    user.password = await bcrypt.hash(password,parseInt(process.env.SALTROUND));

    await user.save();

    return res.status(200).json({message:"success"});

}
