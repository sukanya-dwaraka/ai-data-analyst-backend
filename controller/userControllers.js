const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const User=require("../models/userModels")
const axios=require("axios")
const Data=require("../models/dataModel")

const mongoose = require("mongoose");
require("dotenv").config();

const isAdmin=(req,res,next)=>{
    if(req.user.role !=="admin"){
      return res.status(403).send("only admin allowed");
    }
}
exports.getUser=async(req,res)=>{
    const user=await User.find();
    res.status(200).send({message:"user details",user})
};

exports.signUp=async(req,res)=>{
    const {name,email,password}=req.body;

    const hashedPassword=await bcrypt.hash(password,10)

    const user=new User({
        name,
        email,
        password:hashedPassword
    });
    await user.save();
    res.status(200).send(user)
};
exports.signIn=async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        res.status(401).send({message:"user not found"})
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
       res.status(500).send("wrong password");
    }

    const token=jwt.sign({id:user.id,role:user.role},"secretkey")

    res.json({token})

};

exports.isAdmin=async(req,res)=>{
    res.send("User deleted")
}
exports.askAi= async (req,res)=>{
    const {prompt}=req.body;
    try{
        const dataset=await Data.findOne({userId:req.user.id});

        if(!dataset){
            return res.send("No data found, Upload first.");
        }
        const questionLower=prompt.toLowerCase();
        if(questionLower.includes("average")){
            const salaries=dataset.data.map(item=>item.salary);

            const avg=salaries.reduce((a,b)=> a+b,0)/salaries.length;

            return res.json({reply:`Average salary is ${avg}`});
        }
        if(questionLower.includes("highest")){
            const max=Math.max(...dataset.data.map(item=>item.salary));

            return res.json({reply:`Highest salary is ${max}`});
        }
        const response=await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model:"meta-llama/llama-3-8b-instruct",
                messages:[
                    {
                        role:"system",
                        content:"You are a data analyst. You MUST answer ONLY using the given data. Do NOT use general knowledge."
                    },
                    {role:"üser",content:`
                        Here is the dataset:
                        ${JSON.stringify(dataset.data)}
                        Question:${prompt}
                         Instructions:
                         - Use ONLY the given data
                         - If answer not in data, say "Not enough data"
                         - Give short and exact answer
                        `
                    }
                ]
            },
            {
                headers:{
                    Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            
                }
            
        );
        const reply=response.data.choices[0].message.content;

        res.json({reply})
    }catch(err){
        console.log("FULL ERROR:", err.response?.data || err.message);
       res.status(500).send("AI error");
    }
}
exports.uploadData=async (req,res)=>{
    const{data}=req.body;

    const savedData=await Data.create({
        userId:req.user.id,
        data:data
    });

   res.status(200).json(savedData);
}