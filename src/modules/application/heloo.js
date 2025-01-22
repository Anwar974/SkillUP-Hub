export const updateApplicationStatus = async (req, res) => {
    try {
        const { programId, id } = req.params;
        const { status, message } = req.body; // Use 'message' directly

        // First, find the application
        const application = await applicationModel.findOne({ _id: id, programId }).populate('programId', 'title');
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

       

       

        // Update enrollment status based on the new status
        if (status === 'Accepted') {
            application.enrollmentStatus = 'Enrolled';
        } else {
            application.enrollmentStatus = 'Off Track';
        }

        // Save the application after status update
        await application.save();

        // Send email if the status is 'Accepted' or 'Rejected'
        if (status === 'Accepted' || status === 'Rejected') {
            await sendEmail(
                application.email,
                `Your application for the program has been ${status}`,
                statusChangeEmailTemplate({
                    userName: application.englishName.split(" ")[0],
                    newStatus: status,
                    programTitle: application.programId.title,
                    message, // Pass 'message' directly
                })
            );
        }

        // Return the updated application
        return res.status(200).json({ message: "Success", application });
    } catch (error) {
        console.error("Error updating application status:", error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
