import userModel from "../../../db/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { welcomeEmailTemplate } from "../../ults/emailTemplete.js";
import { sendEmail } from "../../ults/email.js";
import cloudinary from "../../ults/cloudinary.js";
import { confirmEmail } from "../auth/auth.controller.js";

export const createUser = async (req, res) => {
    const { userName, email, password } = req.body;
    if (await userModel.findOne({ userName })) {
        return res.status(400).json({ message: "Username already in use" });
    }
    const hashedPassword = bcrypt.hashSync(
        password,
        parseInt(process.env.SALTROUND)
    );
    const createUser = await userModel.create({
        userName,
        email,
        password: hashedPassword,
        role:'Instructor',
    });
    const token = jwt.sign({ email }, process.env.CONFIRMSIGN);
    await sendEmail(email, "Welcome", welcomeEmailTemplate, { userName, token });

    return res.status(201).json({ message: "success", user: createUser });
};

export const getUsers = async (req, res) => {
    try{
    const users = await userModel.find({});
    return res.status(200).json({ message: "successs", users });
}catch (err) {
    return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
}
};

export const getUserData = async (req, res) => {
    const user = await userModel.findById(req.user._id);
    return res.status(200).json({ message: "successs", user });
};
export const changeUserStatus = async (req, res) => {
    const userId = req.params.id;
    const { status } = req.body; // Expecting 'active' or 'inactive' in the request body
    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { status },
        // { new: true }
    );
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    return res
        .status(200)
        .json({ message: "User status updated successfully", user: updatedUser });
};

export const editProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: `${process.env.APPNAME}/users`,
                }
            );
            if (user.image && user.image.public_id) {
                await cloudinary.uploader.destroy(user.image.public_id);
            }
            user.image = { secure_url, public_id };
        }

        const { userName, email, password, phone, department, socialLinks } = req.body;

        if (userName && userName !== user.userName) {
            if (await userModel.findOne({ userName })) {
                return res.status(404).json({ message: "Username already in use" });
            }
            user.userName = userName;
        }

        if (email && email !== user.email){
            user.email = email;
            
                const token = jwt.sign({email},process.env.CONFIRMSIGN)
                
                    const decoded = jwt.verify(token, process.env.CONFIRMSIGN);
                    console.log('Decoded:', decoded);
        

            await sendEmail(email, 'Welcome', welcomeEmailTemplate, { userName: user.userName, token });
            user.confirmEmail=false;

        } 
        if (password && password !== user.password) {
            const hashedPassword = bcrypt.hashSync(
                password,
                parseInt(process.env.SALTROUND)
            );
            user.password = hashedPassword;
        }
        if (phone & phone !== user.phone) user.phone = phone;

        // Update socialLinks only with provided fields
        if (socialLinks) {
            user.socialLinks = {
                facebook:
                    socialLinks.facebook !== undefined
                        ? socialLinks.facebook
                        : user.socialLinks.facebook,
                linkedIn:
                    socialLinks.linkedIn !== undefined
                        ? socialLinks.linkedIn
                        : user.socialLinks.linkedIn,
                github:
                    socialLinks.github !== undefined
                        ? socialLinks.github
                        : user.socialLinks.github,
            };
        }
        // console.log('Request Body:', req.body);
        // console.log('Extracted Social Links:', socialLinks)

        await user.save();

        return res
            .status(200)
            .json({ message: "Profile updated successfully", user });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        // Find the user by ID
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's status to "NotActive" instead of deleting
        user.status = "NotActive";
        await user.save();
        
        return res.status(200).json({ message: "User status updated to NotActive successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
