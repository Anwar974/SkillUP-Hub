import applicationModel from "./application.model.js";
import mongoose, { Schema, Types, model } from "mongoose";

const localApplicationSchema = new Schema({
    trainingsParticipatedIn: {
        type: String,
        required: false,
    },
    awardsReceived: {
        type: String,
        required: false,
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
});

const LocalApplication = applicationModel.discriminator('LocalApplication', localApplicationSchema);

export default LocalApplication;
