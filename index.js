require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://muhammedijas793:MpdccfkUTEgcmuIl@quix.ku2tm.mongodb.net/?retryWrites=true&w=majority&appName=quix");



const express = require("express");
const app = express();
var easyinvoice = require('easyinvoice');

const port  = process.env.PORT || 3000

app.use(express.static('public'))

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//for admin routes
const adminRoute = require('./routes/adminRoutes');
app.use('/',adminRoute);



app.listen(port,()=>{
    console.log("server is running .....");
})

