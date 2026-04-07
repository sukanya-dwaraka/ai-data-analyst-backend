const mongoose=require("mongoose");

const dataSchema=new mongoose.Schema({
   userId:String,
   data:Array,
   createdAt:{
    type:Date,
    default:Date.now
   }
});
 const Data=mongoose.model("Data",dataSchema);
 module.exports=Data;