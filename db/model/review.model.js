import mongoose, { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    programId:{
        type:Types.ObjectId,
        ref:'Program',
        required:true,

    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    
},
);

const reviewModel = model('Review',reviewSchema);
export default reviewModel;