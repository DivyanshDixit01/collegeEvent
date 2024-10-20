const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
  

router.get("/signup",(req,res) =>{
    res.render("/user/signup");
})

router.post("/signup" , wrapasync(async(req,res) => {
    try{
       const username = req.body.username;
       const gmail = req.body.gmail;
       const password = req.body.password;

        const newUser = new User ({email,username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.flash("success","User was registerd ");
        res.redirect("/listings");
    }
    catch(e){
       req.flash("error" , e.message);
       res.redirect("/user/signup");

    }
    
}));

router.get("/login",(req,res) =>{
    res.render("user/login.ejs")
});

router.post("/login",passport.authenticate("local",{ failureRedirect:'/login',failureFlash: true}),
async(req,res) =>{
res.flash("welcome");
res.redirect("/listings");
});


module.exports = router;