import applicationModel from "./application.model.js";
import mongoose, { Schema, Types, model } from "mongoose";

const internationalApplicationSchema = new Schema({

    isRegisteredThisSemester: {
        type: Boolean,
        required: true,
    },
    hasDisciplinaryActions: {
        type: Boolean,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    passportInfo: {
        type: String,
        // enum: ['جواز فلسطيني', 'جواز أردني', 'جواز سفر آخر', 'لا أملك جواز سفر'],
        required: true,
    },
    isPassportValid: {
        type: Boolean,
        required: true,
    },
    academicDegree: {
        type: String,
        enum: ['بكالوريوس', 'ماجستير', 'دكتوراه'],
        required: true,
    },
    hasTravelRestrictions: {
        type: Boolean,
        required: true,
    },
    hasEUVisa: {
        type: Boolean,
        required: true,
    },
    visaDetails: {
        type: String,
        required: function () {
            return this.hasEUVisa === true;
        },
    },
    
});

const InternationalApplication = applicationModel.discriminator('InternationalApplication', internationalApplicationSchema);
export default InternationalApplication;