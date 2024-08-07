
import applicationModel from "../../../db/model/application.model.js";
import reviewModel from "../../../db/model/review.model.js";


export const postReview = async (req, res) => {
    try {
        const { programId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const application = await applicationModel.findOne({ userId, programId });

        console.log(application
        );

        if (!application) {
            
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.enrollmentStatus !== 'Passed') {
            return res.status(403).json({ message: "You can only post a review if your enrollment status is 'Passed'" });
        }

        // Check if the user has already posted a review for this program
        const existingReview = await reviewModel.findOne({ userId, programId });

        if (existingReview) {
            return res.status(400).json({ message: "You have already posted a review for this program" });
        }
        
        const newReview = new reviewModel({
            userId,
            programId,
            rating,
            comment,
            createdAt: new Date(),
        });

        await newReview.save();


        return res.status(201).json({ message: "Review posted successfully", review: newReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// export const create = async(req,res) => {

//     const {productId}=req.params
//     const {comment,rating}=req.body


//     // const application = await orderModel.findOne({
//     //     userId:req.user._id,
//     //     status:'deliverd',
//     //     "products.productId":productId
//     // })

//     if(!order){
//         return res.status(400).json({message:"cant review this order"})
//     }

//     const checkReview=await reviewModel.findOne({
//         userId:req.user._id,
//         productId:productId
//     })

//     if(checkReview){
//         return res.status(409).json({message:"you already review "})

//     }

//     if(req.file){
//         const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,
//             {folder:`${process.env.APPNAME}`}
//         )
//         req.body.image={secure_url,public_id}
//     }

//     const review=await reviewModel.create({
//         comment,rating,
//         productId,userId:req.user._id,
//         image:req.body.image
//      })
   

// return res.status(201).json({message:"success",review})
  
// }