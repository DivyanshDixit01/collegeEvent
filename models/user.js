const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-Local-Mongoose");

const userSchema = new Schema({
   name : String,
  email : String,
  password :String,
    });
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
