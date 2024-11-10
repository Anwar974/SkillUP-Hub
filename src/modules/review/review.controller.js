
import applicationModel from "../../../db/model/application.model.js";
import reviewModel from "../../../db/model/review.model.js";


export const postReview = async (req, res) => {
    try {
        const { programId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const application = await applicationModel.findOne({ userId, programId });

        if (!application) {
            
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.enrollmentStatus !== 'Passed') {
            return res.status(403).json({ message: "You can only post a review if your enrollment status is 'Passed'" });
        }

        // Check if the user has already posted a review for this program
        const existingReview = await reviewModel.findOne({ userId, programId });

        if (existingReview) {
            return res.status(400).json({ message: "You have already posted a review for this program" });
        }
        
        const newReview = new reviewModel({
            userId,
            programId,
            rating,
            comment,
            createdAt: new Date(),
        });

        await newReview.save();


        return res.status(201).json({ message: "Review posted successfully", review: newReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { programId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        // Check if the review exists for this user and program
        const existingReview = await reviewModel.findOne({ userId, programId });

        if (!existingReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Update the review fields if they are provided
        if (rating) existingReview.rating = rating;
        if (comment) existingReview.comment = comment;
        existingReview.updatedAt = new Date();

        // Save the updated review
        await existingReview.save();

        return res.status(200).json({ message: "Review updated successfully", review: existingReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const deleteReview = async (req, res) => {
    try {
        const { programId } = req.params;
        const userId = req.user._id;

        // Log inputs for debugging
        console.log("User ID:", userId);
        console.log("Program ID:", programId);

        // Find and delete the review
        const deletedReview = await reviewModel.findOneAndDelete({ userId, programId });

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};