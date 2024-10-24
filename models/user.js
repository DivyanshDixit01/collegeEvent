const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-Mongoose");

const userSchema = new Schema({
   username :{
    type: String,
    required:true 
   },
  email : String,
  password :String,
    });
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
