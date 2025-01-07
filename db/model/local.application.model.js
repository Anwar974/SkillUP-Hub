import applicationModel from "./application.model.js";
import mongoose, { Schema, Types, model } from "mongoose";

const localApplicationSchema = new Schema({

    major: {
        type: String,
        required: true
    },
});

const LocalApplication = applicationModel.discriminator('LocalApplication', localApplicationSchema);

export default LocalApplication;
