import slugify from "slugify";
import categoryModel from "../../../db/model/category.model.js";
import cloudinary from "../../ults/cloudinary.js";
import { pagination } from "../../ults/pagination.js";
import programModel from "../../../db/model/program.model.js";
import companyModel from "../../../db/model/company.modal.js";
import applicationModel from "../../../db/model/application.model.js";


export const create = async(req,res) => {
    try {
    req.body.name = req.body.name.toLowerCase();

    if(await categoryModel.findOne({name:req.body.name})){
        return res.status(409).json({message:"category already exists"});
    }
     req.body.slug = slugify(req.body.name);
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APPNAME}/categories`
    })
    req.body.image = {secure_url,public_id};
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const category = await categoryModel.create(req.body)
    return res.status(200).json({message:"success",category});

} catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error" });
}
}

export const getAll = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).populate([
            {
                path: "createdBy",
                select: "userName"
            },
            {
                path: "updatedBy",
                select: "userName"
            }
        ]);
                // Count the number of programs for each category
        const categoriesWithProgramCount = await Promise.all(
            categories.map(async (category) => {
                const programCount = await programModel.countDocuments({
                    categoryId: category._id // Assuming program has a categoryId field
                });

                return {
                    ...category.toObject(),
                    programCount
                };
            })
        );
        
      return res.status(200).json({ message: "success", categories: categoriesWithProgramCount });
    } catch (error) {
        return res.status(500).json({ message: "error", error });
    }
};


export const getActive = async(req,res) =>{
    const categories = await categoryModel.find({status:'Active'}).select("name");
    return res.status(200).json({message:"success",categories});
}

export const getName=async(req,res,next)=>{
    return res.status(200).json(req.params.name)
 }

 export const getDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { skip, limit } = pagination(req.query.page, req.query.limit);
      
      let programQuery = {};
  
      // Set up the search filter for programs
      if (req.query.search) {
        programQuery.$or = [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } }
        ];
      }
  
      // Add any additional filters if needed (e.g., company or location)
      if (req.query.company) {
        const matchingCompany = await companyModel.findOne({
          companyName: { $regex: req.query.company, $options: "i" },
        });
      
        if (matchingCompany) {
            programQuery.company = matchingCompany._id;
        } else {
            programQuery.company = null;
        }
      }
  
      if (req.query.location) {
        programQuery.location = { $regex: req.query.location, $options: "i" };
      }

         // Handle modes filter
    if (req.query.modes) {
        programQuery.mode = { $in: req.query.modes.split(",") };
      }
  
      // Handle status filter based on endDate
      if (req.query.status) {
        const today = new Date();
        const statusArray = req.query.status.split(",");
        
        const statusFilters = statusArray.map((status) => {
          if (status === "past") return { endDate: { $lt: today } };
          if (status === "active") return { endDate: { $gte: today } };
          return null;
        }).filter(Boolean);
  
        // Combine with existing programQuery using $and
        if (statusFilters.length > 0) {
          programQuery.$and = [...(programQuery.$and || []), { $or: statusFilters }];
        }
      }
  
      // Find the category and apply program filtering
      const category = await categoryModel.findById(id).populate({
        path: 'programs',
        match: programQuery,
        options: {
          skip: skip,
          limit: limit,
          sort: req.query.sort || 'title',
        },
        select: 'title description startDate endDate location mode companyName'
      });
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Fetch application counts and attach to programs
    const programsWithApplicationCounts = await Promise.all(
        category.programs.map(async (program) => {
          const applicationCount = await applicationModel.countDocuments({
            programId: program._id,
          });
          return {
            ...program.toObject(),
            applicationCount,
          };
        })
      );
  
      // Fetch associated programs and count
      const programCount = await programModel.countDocuments({ categoryId: category._id });
  
      return res.status(200).json({
        message: "success", 
        category: {
            ...category.toObject(), 
            programs: programsWithApplicationCounts, 
          },
        programCount 
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  
  
  


export const update = async(req,res) =>{

    try {
    const category = await categoryModel.findById(req.params.id);

    if(!category){
        return res.status(404).json({message:"category not found"});  
    }

    if(category.name){
    category.name = req.body.name.toLowerCase();
    if(await categoryModel.findOne({name:req.body.name, _id:{$ne:req.params.id}})){
        return res.status(404).json({message:"name already exists"});  
    }

    category.slug = slugify(req.body.name);
}
    if(req.file){
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.APPNAME}/categories`
        })
        cloudinary.uploader.destroy(category.image.public_id)
        category.image = {secure_url,public_id};
    }

    category.status = req.body.status;
    category.updatedBy = req.user._id;

    await category.save();
    return res.json({message:"success", category});
} catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
}
}

export const destroy = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const programs = await programModel.find({ categoryId: category._id });
    if (programs.length > 0) {
      category.status = "NotActive"; // Adjust the field name and value as per your schema
      await category.save();

return res.status(200).json({
        message: "success",
        category,
      });
    }

    if (category.image && category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await categoryModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "success", category });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

    

