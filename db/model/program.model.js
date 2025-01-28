import mongoose, { Schema, Types, model } from "mongoose";

const programSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim: true,
        
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    company: {
        type: Types.ObjectId,
        ref: 'Company', 
        required: true,
    },
    location:{
        type:String,
        required:false,
    },
    majors:[
        {
        type:String,
        }
    ],
    mode:{
        type:String,
        default:'offline',
        enum:['online','offline','hybrid'],

    },
    type: {
        type: String,
        enum: ['local', 'international'],
        required: true,

    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    hasApplicationForm: {
        type: Boolean,
        default: true,
    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true,

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
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

programSchema.virtual('review',{
    ref:'Review',
    localField:'_id',
    foreignField: 'programId'
})

const programModel = model('Program',programSchema);
export default programModel;

