const  mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
const { object } = require("joi");
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

const initDB = async()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>({...obj , owner:"671687010580ec33a6c0430a",}))
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();