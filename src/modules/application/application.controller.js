import applicationModel from "../../../db/model/application.model.js";
import InternationalApplication from "../../../db/model/international.application.model.js";
import LocalApplication from "../../../db/model/local.application.model.js";
import programModel from "../../../db/model/program.model.js";
import { sendEmail } from "../../ults/email.js";
import { enrollmentStatusChangeEmailTemplate, statusChangeEmailTemplate } from "../../ults/emailTemplete.js";
import { ApplicationsPagination } from "../../ults/pagination.js";

import { parse } from 'json2csv';
import iconv from 'iconv-lite'; 

export const getInstructorPrograms = async (req, res, next) => {
    try {
      const userId = req.params.userId;
  
      const userExists = await userModel.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const queryObject = { createdBy: userId };
      queryObject.status = "Active";

      const count = await programModel.countDocuments(queryObject);
  
      const programs = await programModel
        .find(queryObject)
        .populate("company")
        .populate("categoryId")
        .select(req.query.fields); // Select specific fields if provided in the query
  
      return res.status(200).json({ message: "success", count, programs });
  
    } catch (error) {
      next(error);
    }
};
  
export const exportApplicationsToCSV = async (req, res) => {
    try {

        const userId =req.user._id;
        const queryObject = { createdBy: userId };
        queryObject.status = "Active";

    
        const programs = await programModel
          .find(queryObject)
          .select("_id type");
    
            const foundProgram = programs.find(program => program.type === "local" || program.type === "international");
            const programType = foundProgram.type; 


          const programIds = programs.map(program => program._id);
          const applications = await applicationModel.find({ programId: { $in: programIds } });
          
        let dataset;

          if(programType === "international"){
            dataset= applications.map((app) => ({
                'Student Name (Arabic)': app.arabicName,
                'Student Name (English)': app.englishName,
                'Student ID': app.studentId,
                'Email': app.email,
                'Phone': app.phone,
                'Grade English 1': app.gradeEnglish1,
                'Grade English 2': app.gradeEnglish2,
                'GBA': app.gba,
                'Hours Passed': app.hoursPassed,
                'Year': app.year,
                'Field Trainings Passed': app.fieldTrainingsPassed,
                'Notes': app.notes,
                'Branch': app.branch,
                'Gender': app.gender,
                'Major': app.major,
                'Registered This Semester': app.isRegisteredThisSemester ? 'Yes' : 'No',
                'Has Disciplinary Actions': app.hasDisciplinaryActions ? 'Yes' : 'No',
                'Nationality': app.nationality,
                'Passport Info': app.passportInfo,
                'Is Passport Valid': app.isPassportValid ? 'Yes' : 'No',
                'Academic Degree': app.academicDegree,
                'Has Travel Restrictions': app.hasTravelRestrictions ? 'Yes' : 'No',
                'Has EU Visa': app.hasEUVisa ? 'Yes' : 'No',
                'Visa Details': app.visaDetails,
                'Status': app.status,
                'Enrollment Status':app.enrollmentStatus,
            }));
        }else{
            dataset= applications.map((app) => ({
                'Student Name (Arabic)': app.arabicName,
                'Student Name (English)': app.englishName,
                'Student ID': app.studentId,
                'Email': app.email,
                'Phone': app.phone,
                'Grade English 1': app.gradeEnglish1,
                'Grade English 2': app.gradeEnglish2,
                'GBA': app.gba,
                'Hours Passed': app.hoursPassed,
                'Year': app.year,
                'Field Trainings Passed': app.fieldTrainingsPassed,
                'Notes': app.notes,
                'Branch': app.branch,
                'Gender': app.gender,
                'Major': app.major,
                'Trainings Student Participated In':app.trainingsParticipatedIn,
                'Awards Received':app.awardsReceived,
                'Status': app.status,
                'Enrollment Status':app.enrollmentStatus,
            }));
        }

        const csv = parse(dataset);

        const bom = '\ufeff';
        const csvWithBom = bom + csv;

        const buffer = iconv.encode(csvWithBom, 'utf-8');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');

        res.end(buffer);

    } catch (error) {
        console.error("Error exporting applications:", error);
        res.status(500).json({ message: "Failed to export applications" });
    }
};

export const exportApplicationsByProgram = async (req, res) => {
    try{
    const { programId } = req.params;
  
    const program = await programModel.findById(programId).select("_id type"); 

    const applications = await applicationModel.find({ programId });
   
    let dataset;
    
    if(program.type === "international"){
        dataset= applications.map((app) => ({
            'Student Name (Arabic)': app.arabicName,
            'Student Name (English)': app.englishName,
            'Student ID': app.studentId,
            'Email': app.email,
            'Phone': app.phone,
            'Grade English 1': app.gradeEnglish1,
            'Grade English 2': app.gradeEnglish2,
            'GBA': app.gba,
            'Hours Passed': app.hoursPassed,
            'Year': app.year,
            'Field Trainings Passed': app.fieldTrainingsPassed,
            'Notes': app.notes,
            'Branch': app.branch,
            'Gender': app.gender,
            'Major': app.major,
            'Registered This Semester': app.isRegisteredThisSemester ? 'Yes' : 'No',
            'Has Disciplinary Actions': app.hasDisciplinaryActions ? 'Yes' : 'No',
            'Nationality': app.nationality,
            'Passport Info': app.passportInfo,
            'Is Passport Valid': app.isPassportValid ? 'Yes' : 'No',
            'Academic Degree': app.academicDegree,
            'Has Travel Restrictions': app.hasTravelRestrictions ? 'Yes' : 'No',
            'Has EU Visa': app.hasEUVisa ? 'Yes' : 'No',
            'Visa Details': app.visaDetails,
            'Status': app.status,
            'Enrollment Status':app.enrollmentStatus,
        }));
    }else{
        dataset= applications.map((app) => ({
            'Student Name (Arabic)': app.arabicName,
            'Student Name (English)': app.englishName,
            'Student ID': app.studentId,
            'Email': app.email,
            'Phone': app.phone,
            'Grade English 1': app.gradeEnglish1,
            'Grade English 2': app.gradeEnglish2,
            'GBA': app.gba,
            'Hours Passed': app.hoursPassed,
            'Year': app.year,
            'Field Trainings Passed': app.fieldTrainingsPassed,
            'Notes': app.notes,
            'Branch': app.branch,
            'Gender': app.gender,
            'Major': app.major,
            'Trainings Student Participated In':app.trainingsParticipatedIn,
            'Awards Received':app.awardsReceived,
            'Status': app.status,
            'Enrollment Status':app.enrollmentStatus,
        }));
    }
   
    const csv = parse(dataset);

    const bom = '\ufeff';
    const csvWithBom = bom + csv;

    const buffer = iconv.encode(csvWithBom, 'utf-8');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');

    res.end(buffer);
  
} catch (error) {
    console.error("Error exporting applications:", error);
    res.status(500).json({ message: "Failed to export applications" });
}
};

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
        hoursPassed, year, fieldTrainingsPassed, branch, notes, major, 
        isRegisteredThisSemester, hasDisciplinaryActions, nationality, passportInfo, isPassportValid, 
        academicDegree, hasTravelRestrictions, hasEUVisa, visaDetails,
        trainingsParticipatedIn, awardsReceived, socialLinks } = req.body;

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
        let applicationData ={
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
            major, // Store the selected or custom major
            appliedAt: new Date(),
        };

        let newApplication;

        if (programType === 'international') {
          applicationData.isRegisteredThisSemester = isRegisteredThisSemester;
          applicationData.hasDisciplinaryActions = hasDisciplinaryActions;
          applicationData.nationality = nationality;
          applicationData.passportInfo = passportInfo;
          applicationData.isPassportValid = isPassportValid;
          applicationData.academicDegree = academicDegree;
          applicationData.hasTravelRestrictions = hasTravelRestrictions;
          applicationData.hasEUVisa = hasEUVisa;
          applicationData.visaDetails = hasEUVisa ? visaDetails : undefined; // Only add visaDetails if hasEUVisa is true
          newApplication = new InternationalApplication(applicationData);
            
        } else if (programType === 'local'){
           applicationData.trainingsParticipatedIn = trainingsParticipatedIn;
           applicationData.awardsReceived = awardsReceived;
           applicationData.socialLinks = socialLinks;

            newApplication = new LocalApplication(applicationData);
        }else{

        newApplication = new applicationModel(applicationData);

        }


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

    queryObject.isDeleted = "false";


  
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
        const userId = req.user._id;

        // Step 1: Check for an application for the specific programId
        const applicationForProgram = await applicationModel.findOne({ programId, userId });

        if (applicationForProgram) {
            return res.status(200).json({ 
                application: applicationForProgram, 
                editable: true, // The user can edit this application 
            });
        }

        // Step 2: Retrieve the program type of the requested program
        const program = await programModel.findById(programId);
        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        // Step 3: Look for an application of the same program type
        const applicationByType = await applicationModel.findOne({ 
            programType: program.type, 
            userId 
        });

        if (applicationByType) {
            return res.status(200).json({ 
                application: applicationByType, 
                editable: false, // This application cannot be edited, only used to pre-fill 
            });
        }

        // Step 4: Fallback - Fetch the most recent application by the user
        const mostRecentApplication = await applicationModel.findOne({ userId }).sort({ updatedAt: -1 });

        if (mostRecentApplication) {
            return res.status(200).json({ 
                application: mostRecentApplication, 
                editable: false, // This application cannot be edited, only used to pre-fill 
            });
        }

        // Step 5: No applications found
        return res.status(200).json({ application: null, editable: false });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};


export const updateApplication = async (req, res) => {
    try {
        const { programId, id } = req.params;
        const updateData = req.body;
        const application = await applicationModel.findOne({ _id: id, programId });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        Object.assign(application, updateData);

        if (updateData.status === 'Accepted') {
            application.enrollmentStatus = 'Enrolled';
        }

        await application.save();

        return res.status(200).json({ message: "Application updated successfully", application });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {

    const { programId, id } = req.params;
    const {status, message}  = req.body; 
    

    const application = await applicationModel.findOneAndUpdate(
        { _id: id, programId }, { status }, { new: true })
    .populate('programId', 'title');

    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }
    
    if (status === 'Accepted') {
        application.enrollmentStatus = 'Enrolled';
    }else{
        application.enrollmentStatus = 'Off Track';
        
    }
    await application.save();

    if(application.status==='Accepted' || 'Rejected') {
    await sendEmail(
        application.email,
        `Your application for program has been
         ${status}`,
        statusChangeEmailTemplate,
        { userName: application.englishName.split(" ")[0],
         newStatus: status,
          programTitle: application.programId.title,
          message: message,
         }
    );}

    return res.status(200).json({ message: "success", application });
};


export const updateEnrollmentStatus = async (req, res) => {
    const { id } = req.params;
    const { enrollmentStatus, message } = req.body;

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
        { userName: application.englishName.split(" ")[0],
             newEnrollmentStatus: enrollmentStatus,
            programTitle: application.programId.title ,
            message: message, // Include the custom message or default text

        }
    );

    return res.status(200).json({ message: "success", application });
};

export const deleteByStatus = async (req, res) => {
    const { programId } = req.params;
    const { status } = req.body; // Assuming status is provided in the request body

    const applications = await applicationModel.updateMany(
        { programId, status, isDeleted: "false" }, // Only update active applications
        { $set: { isDeleted: "true" } } // Mark as deleted
    );

    if (applications.modifiedCount === 0) {
        return res.status(404).json({ message: "No applications found with the specified status" });
    }
    
    return res.status(200).json({ message: "Applications marked as deleted successfully" });
};

export const deleteApplication = async (req, res) => {
    const { programId, id } = req.params;
    
    const application = await applicationModel.findOneAndUpdate(
        { _id: id, programId, isDeleted: "false" }, // Ensure only active applications are updated
        { $set: { isDeleted: "true" } }, // Mark as deleted
        { new: true }
    );

    if (!application) {
        return res.status(404).json({ message: "Application not found or already deleted" });
    }

    return res.status(200).json({ message: "Application marked as deleted successfully" });
};



// export const deleteByStatus = async (req, res) => {
    
//     const { programId } = req.params;
//     const { status } = req.body; // Assuming status is provided in the request body

//     const applications = await applicationModel.deleteMany({ programId, status });
//     if (applications.deletedCount === 0) {
//         return res.status(404).json({ message: "No applications found with the specified status" });
//     }
//     return res.status(200).json({ message: "Applications deleted successfully" });
  
   
// };

// export const deleteApplication = async (req, res) => {
    
//         const { programId, id } = req.params;
//         const application = await applicationModel.findOneAndDelete({ _id: id, programId });
//         if (!application) {
//             return res.status(404).json({ message: "Application not found" });
//         }
//         return res.status(200).json({ message: "Application deleted successfully" });
   
// };
