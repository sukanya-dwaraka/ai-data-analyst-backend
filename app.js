const express=require("express")
const app=express();
require("dotenv").config();

app.use(express.json());

const userRoutes=require("./routes/userRoutes");
app.use('/',userRoutes);

module.exports=app;
