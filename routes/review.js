const express = require("express");
const router = express.Router( {mergeparams : true});
const wrapasync = require("../utils/wrapasync.js");
const Expresserrorr = require("../utils/Expresserrorr.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new Expresserrorr(400,"err");
    }else{
        next();
    }

};




router.post("/",validateReview,wrapasync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
   
    listing.reviews.push(newReview);
   
       await newReview.save();
       await listing.save();
       req.flash("success","Review created!");
      res.redirect(`/listings/${listing._id}`);
     }));
   
     router.delete("/:reviewId",
       wrapasync(async(req,res)=>{
       let {id ,reviewId} = req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Review Deleted!");
       res.redirect(`/listings/${id}`);
     }));

     module.exports = router;
