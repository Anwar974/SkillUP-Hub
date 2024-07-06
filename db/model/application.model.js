import mongoose, { Schema, Types, model } from "mongoose";

const applicationSchema = new Schema({
    status:{
        type:String,
        default:'Pending',
        enum:['Pending','Rejected','Accepted'],

    },
    studentId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },
    programId:{
        type:Types.ObjectId,
        ref:'Program',
        required:true,

    },
    appliedAt:{
        type:Date,
    },
   
    createdBy:{type:Types.ObjectId, ref:'User'},
    updatedBy:{type:Types.ObjectId, ref:'User'}
    
},
{
    timestamps:true,
   
});

const applicationModel = model('Application',applicationSchema);
export default applicationModel;

