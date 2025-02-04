import companyModel from '../../../db/model/company.modal.js';
import express from 'express';
import slugify from 'slugify';
import cloudinary from "../../ults/cloudinary.js";
import { pagination } from '../../ults/pagination.js';
import programModel from '../../../db/model/program.model.js';
import userModel from '../../../db/model/user.model.js';


export const postCopmany = async (req, res) => {
    try {

        req.body.companyName = req.body.companyName.toLowerCase();

        if(await companyModel.findOne({companyName:req.body.companyName})){
            return res.status(409).json({message:"company already exists"});
        }

         // Check if the email in socialLinks is unique
    if (req.body.socialLinks && req.body.socialLinks.email) {
      const existingCompany = await companyModel.findOne({
        "socialLinks.email": req.body.socialLinks.email,
      });

      if (existingCompany) {
        return res
          .status(409)
          .json({ message: "Email is already associated with another company" });
      }
    }

        req.body.slug = slugify(req.body.companyName);

        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.APPNAME}/companies`
        })

        req.body.image = {secure_url,public_id};

        req.body.createdBy = req.user._id;
        req.body.updatedBy = req.user._id;

        

        if (req.body.socialLinks) {
            req.body.socialLinks = {
                facebook: req.body.socialLinks.facebook !== undefined ? req.body.socialLinks.facebook : '',
                linkedIn: req.body.socialLinks.linkedIn !== undefined ? req.body.socialLinks.linkedIn : '',
                email: req.body.socialLinks.email !== undefined ? req.body.socialLinks.email : '',
                phoneNumber: req.body.socialLinks.phoneNumber !== undefined ? req.body.socialLinks.phoneNumber : ''
            };
        }
        

        const company = await companyModel.create(req.body)
        
        return res.status(200).json({message:"success",company});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCompanies = async (req, res, next) => {
    try {
      const { skip, limit } = pagination(req.query.page, req.query.limit);
  
      let queryObject = { ...req.query };
      const excludeQuery = ["page", "limit", "sort", "search", "fields"];
      excludeQuery.forEach((ele) => {
        delete queryObject[ele];
      });
  
      queryObject = JSON.stringify(queryObject).replace(
        /\b(gt|gte|lt|lte|in|nin|eq)\b/g,
        (match) => `$${match}`
      );
      queryObject = JSON.parse(queryObject);
  
      if (req.query.search) {
        queryObject.$or = [
          { companyName: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ];
      }
  
      if (req.query.location) {
        queryObject.location = { $regex: req.query.location, $options: "i" };
      }
  
      if (req.query.industry) {
        queryObject.industry = { $regex: req.query.industry, $options: "i" };
      }
  
      const count = await companyModel.countDocuments(queryObject);
  
      // Fetch companies
      let companies = await companyModel
        .find(queryObject)
        .skip(skip)
        .limit(limit)
        .sort(req.query.sort)
        .select(req.query.fields);
  
      // Count programs for each company
      const companiesWithProgramCounts = await Promise.all(
        companies.map(async (company) => {
          const programCount = await programModel.countDocuments({
            company: company._id, status: "Active"
          });
          return { ...company.toObject(), programCount };
        })
      );
  
      return res.status(200).json({
        message: "success",
        count,
        companies: companiesWithProgramCounts,
      });
    } catch (error) {
      next(error);
    }
  };

export const getCompanyById = async (req, res) => {
    try {
        const company = await companyModel.findById(req.params.id)
            .populate({
                path: 'createdBy',
                select: 'userName image'
            })

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Fetch associated programs and count

        // Fetch associated programs for this company
        const programs = await programModel.find({ company: company._id, status: "Active" }).populate('categoryId');

        res.status(200).json({ company, programs, programCount: programs.length });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
export const getInstructorCompanies = async (req, res,next) => {
  try {
    const userId = req.params.userId; 

    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const queryObject = { createdBy: userId };

    const count = await companyModel.countDocuments(queryObject);

    const companies = await companyModel
      .find(queryObject)
      .select(req.query.fields); 

    return res.status(200).json({ message: "success", count, companies });
  } catch (error) {
    next(error); 

}
}

export const updateCompany = async (req, res) => {

    try{

    const { companyName, locations, socialLinks,industry,description,companySize,foundedIn } = req.body;

    const company = await companyModel.findById(req.params.id);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,{ folder: `${process.env.APPNAME}/companies/`}
        );
        if (company.image && company.image.public_id) {
            await cloudinary.uploader.destroy(company.image.public_id);
        }
        company.image = { secure_url, public_id };
    }


    if(industry) {
      company.industry = industry;
    }

    if (companyName && companyName !== company.companyName) {
        if (await companyModel.findOne({ companyName })) {
            return res.status(404).json({ message: "Company name already in use" });
        }else{
          company.companyName=companyName;
    }
    }
    company.slug = companyName ? slugify(companyName) : company.slug;
    company.updatedBy = req.user._id;
    

    if (socialLinks) {
        company.socialLinks = {
            facebook:
                socialLinks.facebook !== undefined
                    ? socialLinks.facebook
                    : company.socialLinks.facebook,
            linkedIn:
                socialLinks.linkedIn !== undefined
                    ? socialLinks.linkedIn
                    : company.socialLinks.linkedIn,
            email:
                socialLinks.email !== undefined
                    ? socialLinks.email
                    : company.socialLinks.email,
            phoneNumber:
            socialLinks.phoneNumber !== undefined
                ? socialLinks.phoneNumber
                : company.socialLinks.phoneNumber,
        };
    }
    // Update locations if provided and is an array
    if (locations && Array.isArray(locations)) {
        company.locations = locations;
      }

      company.companySize = companySize !== undefined ? companySize : company.companySize;
      company.foundedIn = foundedIn !== undefined ? foundedIn : company.foundedIn;
      company.description = description !== undefined ? description : company.description;



    await company.save();

    res.status(200).json({ message: 'success', company });
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error });
  }
    

}

export const deleteCompany = async (req, res) => {
  try {
    // Find the company by ID
    const company = await companyModel.findById(req.params.id);
    if (!company) {
        return res.status(404).json({ message: "company not found" });
    }

    const programs = await programModel.find({ company: company._id, status: "Active" });
    if (programs.length > 0) {
      company.status = "NotActive";
      await company.save();

return res.status(200).json({
        message: "success",
        
      });
    }

    if (company.image && company.image.public_id) {
      await cloudinary.uploader.destroy(company.image.public_id);
    }

    await companyModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({message:"success",company});
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export const destroy = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const programs = await programModel.find({ categoryId: category._id, status: "Active" });
    if (programs.length > 0) {
      category.status = "NotActive"; // Adjust the field name and value as per your schema
      await category.save();

return res.status(200).json({
        message: "success",
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

