import mongoose, { Schema, Types, model } from "mongoose";
import reviewModel from "./review.model.js";

const applicationSchema = new Schema({
    status:{
        type:String,
        default:'Pending',
        enum:['Pending','Rejected','Accepted'],

    },
    userId:{
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
    arabicName: {
         type: String,
          required: true  
    },
    englishName: {
        type: String,
        required: true 
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    studentId: {
        type: String,
        required: true,
        unique: false
    },
    major: {
        type: String,
        required: true
    },
    gradeEnglish1: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    gradeEnglish2: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    gba: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    hoursPassed: {
        type: Number,
        required: true
    },
    year: {
        type: String, 
        enum:['سنة أولى','سنة ثانية','سنة ثالثة','سنة رابعة','سنة خامسة'],
        required: true
    },
    fieldTrainingsPassed: {
        type: String, 
        enum:['تدريب ميداني 1','تدريب ميداني 2','كليهما','لا شيئ مما ذكر'],
        required: true
    },
    notes: {
        type: String
    },
    enrollmentStatus: {
        type: String,
        enum: ['Enrolled', 'Passed', 'Failed', 'Off Track'],
        default: 'Off Track'
    },
    
},
{
    timestamps:true,
    // toJSON:{virtuals:true},
    // toObject:{virtuals:true}
});

// reviewSchema.virtual('reviews',{
//     ref:'Review',
//     localField:'_id',
//     foreignField: 'programId'
// }));

const applicationModel = model('Application',applicationSchema);
export default applicationModel;

