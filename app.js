const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const Expresserrorr = require("./utils/Expresserrorr.js");
const reviewRouter= require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");





main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/college")
}
app.set("'view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extentent:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 14 * 32 * 60 * 60 * 1000, 
        maxAge :  14 * 32 * 60 * 60 * 1000,
        httpOnly : true, 
    },
};

app.get("/",(req,res)=>{
    res.send("hi");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
    
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

 

  

app.all("*",(req,res,next) => {
    next(new Expresserrorr(404,"page not found"))
});

  app.use((err,req,res,next) => {
  let {statusCode=500,message="something not found" } = err;
res.status(statusCode).render("error.ejs",{ message});
  //res.status(statusCode).send(message);
  });

 


app.listen(8083,()=>{
    console.log("server");
})
   
