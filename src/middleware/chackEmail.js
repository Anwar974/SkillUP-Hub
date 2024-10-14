import userModel from "../../db/model/user.model.js";
import { AppError } from "../ults/AppError.js";

export const checkEmail=async(req,res,next)=>{
    
    const {email} = req.body;
    const user= await userModel.findOne({email})
    if(user){
        return res.status(409).json({message: 'Email already exists'});
    }
    next();
}