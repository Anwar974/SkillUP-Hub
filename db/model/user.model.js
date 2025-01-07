import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        min:4,
        max:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    sendCode:{
        type:String,
        default:null,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
        required: false

    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','NotActive'],

    },
    role:{
        type:String,
        default:'User',
        enum:['User','Admin','Instructor']
    },
    image:{
        type:Object,
    },
    phone:{
        type:String,
        required: false // Allow empty value

    },
    department:{
        type:String,
        required: false // Allow empty value

    },
    socialLinks: {
        facebook: {
            type: String,
        },
        linkedIn: {
            type: String,
        },
        github: {
            type: String,
        },
        
    },
    bookmarkedPrograms: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Program',
        },
      ],
},
{
    timestamps:true,
   
});

const userModel = model('User',userSchema);
export default userModel;

