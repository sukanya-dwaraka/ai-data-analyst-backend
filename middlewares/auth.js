const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const header=req.header("Authorization");

    if(!header){
        return res.status(400).send("Access denied")
    }
    const token=header.split(" ")[1];
    
    if(!token){
    return res.status(401).send("No token");
    }
    try{
        const verified=jwt.verify(token,"secretkey");
        req.user=verified;
        next();
    }catch{
        res.status(400).send("Invalid token")
    }
};

module.exports=auth;