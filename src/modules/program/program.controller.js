import userModel from "../../../db/model/user.model.js";
import categoryModel from '../../../db/model/category.model.js';
import programModel from "../../../db/model/program.model.js";
import slugify from "slugify";
import { pagination } from "../../ults/pagination.js";
import companyModel from "../../../db/model/company.modal.js";
import applicationModel from "../../../db/model/application.model.js";
import reviewModel from "../../../db/model/review.model.js";


export const postProgram = async (req, res) => {

    try{
        const { title, description, company, location, mode, startDate, endDate,hasApplicationForm, categoryId } = req.body;
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

        // Check for duplicate programs with the same title, startDate, endDate, and userId
        const existingProgram = await programModel.findOne({
            title,
            startDate,
            endDate,
            company
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
            location,
            mode,
            startDate,
            endDate,
            hasApplicationForm: hasApplicationForm ?? false,
            userId,
            categoryId,
            createdBy: userId,
            updatedBy: userId
        });

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

    if (req.query.search) {
      queryObject.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }
    
    // Handling modes filter
    if (req.query.modes) {
      queryObject.mode = { $in: req.query.modes.split(",") };
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
      .json({ message: "success", count, programs: programsWithApplicationCounts });

  } catch (error) {
    next(error);
  }
};



;
  

  export const getProgramById = async (req, res) => {
    try {


        const program = await programModel.findById(req.params.id)
            .populate({
                path: 'review',
                populate: {
                    path: 'userId', 
                    select: 'userName' 
                }
            })
            .populate({
              path: 'company',  // Populate the company field
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

        const { title, description, company, location, mode, startDate, endDate, hasApplicationForm, categoryId } = req.body;
        const program = await programModel.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        if (company && company !== program.company) {
          const companyData = await companyModel.findOne({ companyName: company });
          if (companyData) {
              // Update program with the correct company data
              program.company = companyData.companyName; // Update to the new company name
              program.companyImage = companyData.image; // Assuming company image is stored in the company model as 'image'
          } else {
              return res.status(404).json({ message: "Company not found" });
          }
      }

        // Update fields only if they are provided
        if (title) program.title = title;
        if (description) program.description = description;
        if (location) program.location = location;
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

  
export const deleteProgram = async (req, res) => {
    const { id } = req.params;
    const program = await programModel.findById(id).populate('company', 'image');;
    if (!program) {
        return res.status(404).json({ message: "Program not found" });
    }
    await programModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Program deleted successfully" });
};


