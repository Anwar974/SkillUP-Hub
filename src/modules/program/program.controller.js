import userModel from "../../../db/model/user.model.js";
import categoryModel from '../../../db/model/category.model.js';
import programModel from "../../../db/model/program.model.js";
import slugify from "slugify";
import { pagination } from "../../ults/pagination.js";
import companyModel from "../../../db/model/company.modal.js";
import applicationModel from "../../../db/model/application.model.js";
import reviewModel from "../../../db/model/review.model.js";
import mongoose from 'mongoose';


export const postProgram = async (req, res) => {

    try{
      // majors
        const { title, description, company, location, mode, type, startDate,
           endDate,hasApplicationForm,majors, categoryId } = req.body;
        const userId = req.user._id; 

        const userExists = await userModel.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const checkCategory = await categoryModel.findById(categoryId);
        if (!checkCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const checkCompany = await companyModel.findById(company);
        if (!checkCompany) {
            return res.status(404).json({ message: "Company not found" });
        }    

        const existingProgram = await programModel.findOne({
            title,
            startDate,
            endDate,
            company,
        });

        if (existingProgram) {
            return res.status(400).json({ message: `${title} program with start date: ${startDate} already exists for ${company} company` });
        }

        const slug = slugify(title);

        const program = new programModel({
            title,
            slug,
            description,
            company,
            location : location || undefined,
            mode,
            type: mode === 'online' ? undefined : type,
            startDate,
            endDate,
            hasApplicationForm: hasApplicationForm ?? false,
            userId,
            categoryId,
            createdBy: userId,
            updatedBy: userId
        });

        // Add majors if hasApplicationForm is true and type is 'international'
        if (hasApplicationForm && type === 'international' && Array.isArray(majors)) {
          program.majors = majors.map(major => major.trim());
        }
        await program.save();

        await program.populate('company');

        res.status(201).json({ message: "Program created successfully", program });
} catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
}

};

export const getPrograms = async (req, res, next) => {
  try {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    let queryObject = { ...req.query };
    const excludeQuery = ["page", "limit", "sort", "search", "fields"];

    excludeQuery.forEach((ele) => {
      delete queryObject[ele];
    });

    queryObject = JSON.stringify(queryObject);
    queryObject = queryObject.replace(
      /\b(gt|gte|lt|lte|in|nin|eq)\b/g,
      (match) => `$${match}`
    );
    queryObject = JSON.parse(queryObject);


    queryObject.status = "Active"; // Ensures only active programs are fetched

    if (req.query.search) {
      queryObject.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.company) {
      const matchingCompany = await companyModel.findOne({
        companyName: { $regex: req.query.company, $options: "i" },
      });
    
      if (matchingCompany) {
        queryObject.company = matchingCompany._id;
      } else {
        queryObject.company = null;
      }
    }

    // Handling modes filter
    if (req.query.modes) {
      queryObject.mode = { $in: req.query.modes.split(",") };
    }
    // Handling types filter
    if (req.query.types) {
      queryObject.type = { $in: req.query.types.split(",") };
    }
    
    // Status filter: past, active, or all
if (req.query.status) {
  const today = new Date();
  const statusArray = req.query.status.split(","); // Convert comma-separated string to an array


  statusArray.forEach(status => {
    if (status === "past") {
      queryObject.endDate = { $lt: today }; // Programs with endDate < today
    } else if (status === "active") {
      queryObject.endDate = { $gte: today }; // Programs with endDate >= today
    }
  });

  // Remove the status field from queryObject as it's not needed in this case
  delete queryObject.status;

}


    const count = await programModel.countDocuments(queryObject);  // To get the count of filtered documents

    const mongooseQuery = programModel
      .find(queryObject)
      .skip(skip)
      .limit(limit)
      .populate("company") // Populate company data
      .populate("categoryId") // Populate category data
      .select(req.query.fields)
      .sort(req.query.sort);

    let programs = await mongooseQuery;

    
    const totalPrograms = await programModel.countDocuments();
    const totalPages = Math.ceil(totalPrograms / limit);

     // Fetch application counts and attach to programs
     const programsWithApplicationCounts = await Promise.all(
      programs.map(async (program) => {
        const applicationCount = await applicationModel.countDocuments({
          programId: program._id,
        });
        return {
          ...program.toObject(),
          companyImage: program.company ? program.company.image : null,
          applicationCount,
        };
      })
    );

    return res
      .status(200)
      .json({ message: "success", count, programs: programsWithApplicationCounts,
        totalPrograms,
        totalPages,
        currentPage: parseInt(req.query.page) || 1, });

  } catch (error) {
    next(error);
  }
};

//make sure this works very important

export const getInstructorPrograms = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Query to find programs created by the user
    const queryObject = { createdBy: userId };
    queryObject.status = "Active"; 


    // Count the number of programs created by the user
    const count = await programModel.countDocuments(queryObject);

    // Fetch programs with the specified query
    const programs = await programModel
      .find(queryObject)
      .populate("company")
      .populate("categoryId")
      .select(req.query.fields); // Select specific fields if provided in the query

    return res.status(200).json({ message: "success", count, programs });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

export const getProgramById = async (req, res) => {
    try {


        const program = await programModel.findById(req.params.id)
            .populate({
                path: 'review',
                populate: {
                    path: 'userId', 
                    select: 'userName image' 
                }
            }).populate({
              path: 'company',
            })
          .populate({
            path: 'createdBy',
            select: 'userName image'
        });
                        
        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        // Fetch associated programs and count
        const applicationsCount = await applicationModel.countDocuments({ programId: program._id });
        const reviewsCount = await reviewModel.countDocuments({ programId: program._id });
        res.status(200).json({ program, applicationsCount, reviewsCount });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateProgram = async (req, res) => {
    try {
// majors,
const { title, description, company, location, mode, type, startDate,
  endDate,hasApplicationForm,majors, categoryId } = req.body;

const program = await programModel.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        if (company && company !== program.company.toString()) {
          const companyData = await companyModel.findOne({ _id: company });
          if (companyData) {
              program.company = companyData._id; // Update to the new company name
          } else {
              return res.status(404).json({ message: "Company not found" });
          }
      }
        if (title) program.title = title;
        if (description) program.description = description;
        if (location) program.location = location;
        // if (majors) program.majors = majors;

        if (hasApplicationForm !== undefined) {
          if (hasApplicationForm && type === 'international' && Array.isArray(majors)) {
            program.majors = majors.map(major => major.trim());
          } else{
              program.majors = [];
          }
      }

        if (mode) program.mode = mode;
        if (startDate) program.startDate = new Date(startDate);
        if (endDate) program.endDate = new Date(endDate);
        if (hasApplicationForm !== undefined) program.hasApplicationForm = hasApplicationForm;
        if (categoryId) program.categoryId = categoryId;

        program.slug = title ? slugify(title) : program.slug;
        program.updatedBy = req.user._id;

        await program.save();

        res.status(200).json({ message: "Program updated successfully", program });
    } catch (err) {
        console.error('Error:', err); // Debugging line
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


export const toggleBookmark = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const program = await programModel.findById(id).populate('company', 'image');;
      if (!program) {

        return res.status(404).json({ message: "Program not no not found" });
      }
  
      // Check if the user has already bookmarked this program
      const user = await userModel.findById(userId);
      const isBookmarked = user.bookmarkedPrograms.includes(id);
  
      if (isBookmarked) {
        // If bookmarked, remove the bookmark
        user.bookmarkedPrograms.pull(id);
      } else {
        // Otherwise, add it to bookmarks
        user.bookmarkedPrograms.push(id);
      }
  
      await user.save();
      res.status(200).json({ message: isBookmarked ? 'Bookmark removed' : 'Program bookmarked' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //deactivate the program dont delete it 

export const deleteProgram = async (req, res) => {
    const { id } = req.params;
    const program = await programModel.findById(id).populate('company', 'image');;
    if (!program) {
        return res.status(404).json({ message: "Program not found" });
    }
    program.status = 'NotActive'
    await program.save();
    res.status(200).json({ message: "success" });
};


