import mongoose, { Schema, Types, model } from "mongoose";

const applicationSchema = new Schema({
    
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
    gender:{
        type:String,
        enum:['Male','Female'],
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
        enum:['تدريب ميداني 1','تدريب ميداني 2','كليهما','غير ذلك'],
        required: true
    },
    branch: {
        type: String, 
        enum:['طولكرم','رام الله','العروب'],
        required: true
    },
    notes: {
        type: String,
        required:false,
    },
    enrollmentStatus: {
        type: String,
        enum: ['Enrolled', 'Passed', 'Failed', 'Off Track'],
        default: 'Off Track'
    },
    status:{
        type:String,
        default:'Pending',
        enum:['Pending','Rejected','Accepted'],

    },
    programType: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
},
{
    timestamps:true,
    discriminatorKey: 'applicationType',
});



const applicationModel = model('Application',applicationSchema);
export default applicationModel;

