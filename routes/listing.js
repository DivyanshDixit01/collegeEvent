const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Expresserrorr = require("../utils/Expresserrorr.js");
const { listingSchema  } = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new Expresserrorr(400,"err");
    }else{
        next();
    }

};

router.get("/",wrapasync(async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("../views/listings/index.ejs",{ alllistings });
 }));
 router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});
 router.get("/:id",wrapasync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!" ); 
        res.redirect("/listings");
    }
    res.render("../views/listings/show.ejs", { listing });
}));

router.post("/",validateListing,wrapasync(async(req,res,next)=>{
     const newListings = new Listing(req.body.listing);
    await newListings.save();
    req.flash("success","New Listings Created!" );
    res.redirect("/listings");
    
})
);

router.get("/:id/edit",wrapasync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listings you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }));
router.put("/:id",validateListing,wrapasync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }));

  router.delete("/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Delete!");
    res.redirect("/listings");
  }));


  module.exports = router;

