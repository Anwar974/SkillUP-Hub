import applicationModel from "./application.model.js";
import mongoose, { Schema, Types, model } from "mongoose";

const internationalApplicationSchema = new Schema({
    passportInfo: {
        type: String, 
        enum:['جواز فلسطيني','جواز أردني','جواز سفر آخر','لا املك جواز سفر'],
        required: true,
    },
    visa: { type: String, required: true },
    
});

const InternationalApplication = applicationModel.discriminator('InternationalApplication', internationalApplicationSchema);
export default InternationalApplication;