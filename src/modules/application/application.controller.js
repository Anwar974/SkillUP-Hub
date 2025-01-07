import applicationModel from "../../../db/model/application.model.js";
// import InternationalApplication from "../../../db/model/international.application.model.js";
// import LocalApplication from "../../../db/model/local.application.model.js";
import programModel from "../../../db/model/program.model.js";
import { sendEmail } from "../../ults/email.js";
import { enrollmentStatusChangeEmailTemplate, statusChangeEmailTemplate } from "../../ults/emailTemplete.js";
import { ApplicationsPagination } from "../../ults/pagination.js";


export const addProgramType = async (req, res, next) => {
    try {
        const { programId } = req.params;
        const program = await programModel.findById(programId);

        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        req.body.programType = program.type; // Add programType to the request body
        next(); // Pass control to the next middleware
    } catch (error) {
        next(error); // Handle errors properly
    }
};

export const postApplication = async (req, res) => {
    try {

        const { programId } = req.params;
        const { arabicName, englishName, email, phone, studentId, gender, gradeEnglish1, gradeEnglish2, gba,
        hoursPassed, year, fieldTrainingsPassed,branch, notes,  } = req.body;

// visa,localId

        const program = await programModel.findById(programId);

        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        if (!program.hasApplicationForm) {
            return res.status(400).json({ message: "This program does not accept applications through the platform" });
        }

        const programType = program.type;
        req.body.programType = programType;


    
        const existingApplication = await applicationModel.findOne({ userId:req.user._id, programId });
        
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this program" });
        }

        // Create the application
        const applicationData ={
            arabicName,
            englishName,
            studentId,
            email,
            phone,
            gender,
            gradeEnglish1,
            gradeEnglish2,
            gba,
            hoursPassed,
            year,
            fieldTrainingsPassed,
            branch,
            notes,
            userId: req.user._id, // Assuming the user ID is obtained from the auth middleware
            programId,
            programType,
            appliedAt: new Date(),
        };

        let newApplication;

        // if (programType === 'international') {
        //     applicationData.passportInfo = passportInfo;
        //     applicationData.visa = visa;
        //     newApplication = new InternationalApplication(applicationData);
            

        // } else if (programType === 'local'){
        //     applicationData.localId = localId;
        //     newApplication = new LocalApplication(applicationData);
        // }

        newApplication = new applicationModel(applicationData);

        await newApplication.save();

        const totalApplications = await applicationModel.countDocuments();

        return res.status(201).json({
            message: "Application created successfully",
            application: newApplication,
            totalApplications,
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
    const application = await applicationModel.findOneAndUpdate({ _id: id, programId }, { status }, { new: true })
    .populate('programId', 'title');
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }

     if (application.status === 'Accepted') {
        return res.status(400).json({ message: "You cannot change Accpeted status." });
    }

    application.status = status;
    
    if (status === 'Accepted') {
        application.enrollmentStatus = 'Enrolled';
        await application.save();
    }else{
        application.enrollmentStatus = 'Off Track';
        await application.save();
    }

    if(application.status==='Accepted' || 'Rejected') {
    await sendEmail(
        application.email, // Replace with the appropriate field for the user's email
        `Your application for program has been
         ${status}`,
        statusChangeEmailTemplate,
        { userName: application.englishName.split(" ")[0],
         newStatus: status, programTitle: application.programId.title }
    );}

    return res.status(200).json({ message: "success", application });
};


export const updateEnrollmentStatus = async (req, res) => {
    const { id } = req.params;
    const { enrollmentStatus } = req.body;

    const application = await applicationModel.findById(id).populate('programId', 'title');
    
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === 'Pending' || application.status === 'Rejected') {
        if (enrollmentStatus !== 'Off Track') {
            return res.status(400).json({ message: `Student cannot be ${enrollmentStatus} when application is ${application.status}`});
        }
    }else{
       application.enrollmentStatus = enrollmentStatus;
    await application.save(); 
    }

    

    // Send enrollment status change email
    await sendEmail(
        application.email, // Replace with the appropriate field for the user's email
        `Enrollment Status Updated to ${enrollmentStatus}`,
        enrollmentStatusChangeEmailTemplate,
        { userName: application.englishName.split(" ")[0], newEnrollmentStatus: enrollmentStatus,
            programTitle: application.programId.title 
        }
    );

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
