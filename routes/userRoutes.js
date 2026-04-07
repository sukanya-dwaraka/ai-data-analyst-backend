const express=require("express");
const router=express.Router();
const auth=require("../middlewares/auth");
const{signUp,signIn,isAdmin,askAi,uploadData}=require("../controller/userControllers");

router.post("/user/signup",signUp)
router.post("/users/signin",signIn)
router.get("/user/profile",auth,isAdmin)
router.post("/ask/ai",auth,askAi)
router.post("/upload",auth,uploadData)
module.exports=router;