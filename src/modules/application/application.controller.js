import applicationModel from "../../../db/model/application.model.js";
import programModel from "../../../db/model/program.model.js";
import { ApplicationsPagination } from "../../ults/pagination.js";

export const postApplication = async (req, res) => {
    try {
        const { programId } = req.params;
        const { arabicName, englishName, email, phone, studentId, major, gradeEnglish1, gradeEnglish2, gba,
            hoursPassed, year, fieldTrainingsPassed, notes } = req.body;

        const program = await programModel.findById(programId);
        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        // Check if the program accepts applications through the platform
        if (!program.hasApplicationForm) {
            return res.status(400).json({ message: "This program does not accept applications through the platform" });
        }
    
        const existingApplication = await applicationModel.findOne({ userId:req.user._id, programId });
        
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this program" });
        }



        // Create the application
        const newApplication = new applicationModel({
            arabicName,
            englishName,
            studentId,
            email,
            phone,
            major,
            gradeEnglish1,
            gradeEnglish2,
            gba,
            hoursPassed,
            year,
            fieldTrainingsPassed,
            notes,
            userId: req.user._id, // Assuming the user ID is obtained from the auth middleware
            programId,
            appliedAt: new Date(),
        });

        await newApplication.save();

        const totalApplications = await applicationModel.countDocuments();
    const totalPages = Math.ceil(totalApplications / limit);


        return res.status(201).json({
            message: "Application created successfully",
            application: newApplication,
            totalApplications,
            totalPages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getApplicationsByProgram = async (req, res) => {
    
    const { programId } = req.params;
    const { skip, limit } = ApplicationsPagination(req.query.page, req.query.limit);
  
    
    let queryObject = { ...req.query };

    const excludeQuery = ["page", "limit", "sort", "search"];
  
    excludeQuery.forEach((ele) => {
        delete queryObject[ele];
    });
  
    queryObject.programId = programId;

    queryObject = JSON.stringify(queryObject);
    queryObject = queryObject.replace(
      /\b(gt|gte|lt|lte|in|nin|eq)\b/g,
      (match) => `$${match}`
    );
    queryObject = JSON.parse(queryObject);
  
    if (req.query.search) {
      queryObject.$or = [
        { arabicName: { $regex: req.query.search, $options: "i" } },
        { englishName: { $regex: req.query.search, $options: "i" } },
        { studentId: { $regex: req.query.search, $options: "i" } },
      ];
    }
  
    if (req.query.status) {
      queryObject.status = { $regex: req.query.status, $options: "i" };
    }
  
    if (req.query.year) {
      queryObject.year = { $regex: req.query.year, $options: "i" };
    }
    if (req.query.fieldTrainingsPassed) {
        queryObject.fieldTrainingsPassed = { $regex: req.query.fieldTrainingsPassed, $options: "i" };
    }
  
    const mongoseQuery = applicationModel.find(queryObject).skip(skip).limit(limit);
  
    const count = await applicationModel.countDocuments(queryObject); // To get the count of filtered documents
    // mongoseQuery.select(req.query.fields);
    let applications = await mongoseQuery.sort(req.query.sort);
  
    applications = applications.map((application) => {
      return {
        ...application.toObject(),
      };
    });
  
      return res.status(200).json({ message: "success", count, applications });
  
   
};

export const getApplicationById = async (req, res) => {
    try { 
        
        const { programId } = req.params;
        const application = await applicationModel.findOne({ programId,userId:req.user._id });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ application });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateApplication = async (req, res) => {
    try {
        const { programId, id } = req.params;
        const updateData = req.body;
        const application = await applicationModel.findOneAndUpdate({ _id: id, programId }, updateData, { new: true });

        if (updateData.status === 'Accepted') {
            application.enrollmentStatus = 'Enrolled';
        }

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ message: "Application updated successfully", application });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {

    const { programId, id } = req.params;
    const {status}  = req.body; 
    const application = await applicationModel.findOneAndUpdate({ _id: id, programId }, { status }, { new: true });
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }

     // Prevent changing from Accepted to Pending if enrollmentStatus is not Off Track
     if (application.status === 'Accepted' && status === 'Pending' && application.enrollmentStatus !== 'Off Track') {
        return res.status(400).json({ message: "Cannot change status from Accepted to Pending when enrollment status is not Off Track" });
    }

    // Update the status as requested
    application.status = status;
    
    if (status === 'Accepted') {
        application.enrollmentStatus = 'Enrolled';
        await application.save();
    }

    return res.status(200).json({ message: "success", application });
};
export const updateEnrollmentStatus = async (req, res) => {
    const { id } = req.params;
    const { enrollmentStatus } = req.body; 
    const application = await applicationModel.findById(id);
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === 'Pending') {
        if (enrollmentStatus !== 'Off Track' || enrollmentStatus !== 'Enrolled') {
            return res.status(400).json({ message: `Student cannot be ${enrollmentStatus} when application is still pending` });
        }
    } else if (application.status === 'Rejected') {
        return res.status(400).json({ message: "Cannot change enrollment status when application is Rejected" });
    } else if (application.status === 'Accepted') {
        application.enrollmentStatus = enrollmentStatus;
        await application.save();
        return res.status(200).json({ message: "success", application });
    }
    application.enrollmentStatus = enrollmentStatus;
    await application.save();

    return res.status(200).json({ message: "success", application });
};

export const deleteByStatus = async (req, res) => {
    
    const { programId } = req.params;
    const { status } = req.body; // Assuming status is provided in the request body

    const applications = await applicationModel.deleteMany({ programId, status });
    if (applications.deletedCount === 0) {
        return res.status(404).json({ message: "No applications found with the specified status" });
    }
    return res.status(200).json({ message: "Applications deleted successfully" });
  
   
};

export const deleteApplication = async (req, res) => {
    
        const { programId, id } = req.params;
        const application = await applicationModel.findOneAndDelete({ _id: id, programId });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ message: "Application deleted successfully" });
   
};
