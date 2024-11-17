import companyModel from '../../../db/model/company.modal.js';
import express from 'express';
import slugify from 'slugify';
import cloudinary from "../../ults/cloudinary.js";
import { pagination } from '../../ults/pagination.js';


export const postCopmany = async (req, res) => {
    try {

        req.body.companyName = req.body.companyName.toLowerCase();

        if(await companyModel.findOne({companyName:req.body.companyName})){
            return res.status(409).json({message:"company already exists"});
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

export const getCpmpanies = async (req, res) => {
    
    try{

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

        const count = await companyModel.countDocuments(queryObject); // To get the count of filtered documents

        const mongoseQuery = companyModel.find(queryObject).skip(skip).limit(limit);
  
      
      mongoseQuery.select(req.query.fields);
      let companies = await mongoseQuery.sort(req.query.sort);
  
      companies = companies.map((company) => {
        return {
          ...company.toObject(),
        };
      });

      return res.status(200).json({ message: "success", count, companies });

    } catch (error) {
        next(error);
    }

}

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

        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const updateCompany = async (req, res) => {

    try{

    const { companyName, locations, socialLinks, ...otherFields  } = req.body;

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


    if (companyName && companyName !== company.companyName) {
        if (await companyModel.findOne({ companyName })) {
            return res.status(404).json({ message: "Username already in use" });
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

    for (let key in otherFields) {
      if (otherFields[key] !== undefined) {
        company[key] = otherFields[key];
      }
    }
    
    await company.save();

    res.status(200).json({ message: 'success', company });
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error });
  }
    

}

// export const deleteCompany = async (req, res) => {

//     // Find the company by ID
//     const company = await companyModel.findByIdAndDelete(req.params.id);
//     if (!company) {
//         return res.status(404).json({ message: "company not found" });
//     }
//     await cloudinary.uploader.destroy(company.image.public_id)
//     return res.status(200).json({message:"success",company});
// }

