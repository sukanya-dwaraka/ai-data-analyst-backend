const app=require('./app')
const connectDB=require("./config/db");

connectDB();

app.listen(3200,()=>{
   console.log("Server running on 3200")
});