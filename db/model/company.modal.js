import { Schema, model, Types } from "mongoose";

const companySchema = new Schema({

    companyName:{
        type:String,
        required:true,
        unique: true,
        min:4,
        max:30
    },
    slug:{
        type:String,
        required:true,
        unique: true,
    },
    description:{
        type:String,
        required:false

    },
    image:{
        type:Object,
        required:false,
    },
    locations:[
        {
        type:String,
        required:true,
        }
    ],
    industry:{
        type:String,
        required:true,
    },
    companySize:{
        type:String,
        required:false,
    },
    foundedIn:{
        type:String,
        required:false,
    },
    socialLinks: {
        facebook: {
            type: String,
        },
        linkedIn: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        email:{
            type:String,
            required:false,
            unique:true,
        },
        
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','NotActive'],

    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
    },
},
{
    timestamps:true,
   
});

const companyModel = model('Company',companySchema);
export default companyModel;

