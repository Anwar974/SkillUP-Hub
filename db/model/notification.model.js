import mongoose, { Schema, Types, model } from "mongoose";

const notificationSchema = new Schema({
    content:{
        type:String,
        required:true,
        trim: true,
        
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:time,
        required:true,
    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },
    
},
{
    timestamps:true,
    
});



const notificationModel = model('Notification',notificationSchema);
export default notificationModel;

