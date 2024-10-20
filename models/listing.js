const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title :{ 
        type:String,
        require: true,
    },
    description:String,
    image:String,
    entryfee:Number,
    contact:String,
    location:String,
    reviews:[
        {
          type: Schema.Types.ObjectId, 
          ref:"Review",
        },
    ],

});

listingSchema.post("FindOneAndDelete",async(listing)=>{
    if(listing) {
        await Review.deleteMany({ _id : { $in:listing.reviews}});  
    }
});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;