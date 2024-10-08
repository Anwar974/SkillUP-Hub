import slugify from "slugify";
import categoryModel from "../../../db/model/category.model.js";
import cloudinary from "../../ults/cloudinary.js";


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
    return res.json({message:category});

} catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error" });
}
}

export const getAll = async(req,res) =>{
    const categories = await categoryModel.find({}).populate([{
        path:"createdBy",
        select:'userName'
    },
    {
    path:"updatedBy",
    select:'userName'
    }
]);
    return res.status(200).json({message:"success",categories});
}

export const getActive = async(req,res) =>{
    const categories = await categoryModel.find({status:'Active'}).select("name");
    return res.status(200).json({message:"success",categories});
}

export const getName=async(req,res,next)=>{
    return res.status(200).json(req.params.name)
 }

export const getDetails = async(req,res) =>{
    const category = await categoryModel.findById(req.params.id);
    return res.status(200).json({message:"success",category});
}

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

export const destroy = async(req,res) =>{
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    
    if(!category){
        return res.status(404).json({message:"category not found"});  
    }
    await cloudinary.uploader.destroy(category.image.public_id)
    return res.status(200).json({message:"success",category});
}

    

