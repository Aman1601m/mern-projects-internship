const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/hrms")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((error)=>{
    console.log(error);
});
app.get("/",(req,res)=>{
    res.send("HRMS Backend Running");
});
const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});