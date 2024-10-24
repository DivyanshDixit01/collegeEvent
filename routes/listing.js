const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.get(("/"),wrapasync(async(req,res)=>{
  const alllistings= await Listing.find({});
  res.render("../views/listings/index.ejs",{ alllistings });

}));



router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});
 router.get("/:id",wrapasync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author",
      },
      })
      .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!" ); 
        res.redirect("/listings");
    }
    console.log(listing)
    res.render("../views/listings/show.ejs", { listing });
}));

router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapasync(async(req,res,next)=>{
    let url = req.file.path;
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
  newListing.image = {url};
    await newListing.save();
    req.flash("success","New Listings Created!" );
    res.redirect("/listings");
    
})
);

router.get("/:id/edit",isLoggedIn,
    isOwner,
    wrapasync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listings you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }));
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,wrapasync( async (req, res) => {
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file !=="undefined"){
    let url = req.file.path;
    listing.image = { url };
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }));

  router.delete("/:id",isLoggedIn,
    isOwner,
    wrapasync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Delete!");
    res.redirect("/listings");
  }));


  module.exports = router;

