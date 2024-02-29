require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/quix_project");

const express = require("express");
const app = express();
var easyinvoice = require('easyinvoice');



app.use(express.static('public'))

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//for admin routes
const adminRoute = require('./routes/adminRoutes');
app.use('/',adminRoute);



app.listen(3000,()=>{
    console.log("server is running .....");
})

