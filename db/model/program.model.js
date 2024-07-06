import mongoose, { Schema, Types, model } from "mongoose";

const programSchema = new Schema({
    title:{
        type:String,
        unique: true,
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
    location:{
        type:String,
        required:true,
    },
    mode:{
        type:String,
        default:'offline',
        enum:['online','offline','hybrid'],
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    // status:{
    //     type:String,
    //     default:'Active',
    //     enum:['Active','NotActive'],

    // },
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
    // subcategoryId:{
    //     type:Types.ObjectId,
    //     ref:'Subcategory',
    //     required:true,

    // },
    createdBy:{type:Types.ObjectId, ref:'User'},
    updatedBy:{type:Types.ObjectId, ref:'User'}
    
},
{
    timestamps:true,
    // toJSON:{virtuals:true},
    // toObject:{virtuals:true}
});

// programSchema.virtual('reviews',{
//     ref:'Review',
//     localField:'_id',
//     foreignField: 'programId'
// })

const programModel = model('Program',programSchema);
export default programModel;

