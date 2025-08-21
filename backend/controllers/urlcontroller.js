import Url from "../models/model.js";
import {nanoid} from "nanoid";
import validUrl from "valid-url"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { check , ExpressValidator } from "express-validator";
import User from "../models/modelUsers.js"


const shortenUrl = async (req , res) =>{
    try{
        const {custom_id , long_url} = req.body;

        if(!validUrl.isUri(long_url)){
            return res.status(400).json({sucess:false , error: "Invalid Url"})
        }
        let url_code;
        if(custom_id){
            const taken = await Url.findOne({url_code : custom_id})
            if(taken){
                return res.status(400).json({error:"Custom Id already in use"})
            }
            url_code = custom_id;
        }else{
            url_code = nanoid(8);
        }
           

        let existing = await Url.findOne({url_code:url_code})
        if(existing){
            return res.status(400).json({sucess:false , error:"Custom id already in use"})
        }
        let short_url = `${process.env.BASE_URL}/api/url/${url_code}`
        
        let url = await Url.create({long_url:long_url , short_url : short_url , url_code : url_code , userId:req.user.id})
        return  res.status(201).json({sucess : true , message: "Link has been shortened sucessfully" , short_url:url.short_url})
        
    }catch(error){
        return res.status(500).json({sucess:false , error:"Some error occured" })
    }
}

const redirectUrl = async (req , res) =>{
    try{
    let url = await Url.findOne({url_code : req.params.code})
    if(url) {
    url.clicks++;
    await url.save()
    return res.redirect(url.long_url)
    }
}catch(error){
    console.error(err);
    res.send("Server Error")
}

}

const createUser = async (req,res)=>{

    try{
        const {username , gmail , password} = req.body;
        let user = await User.findOne({gmail})
        if(user) return res.status(400).json({mesaage:"Email already in use"})
        

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt)

        user = await User.create({username , gmail , password : hashedPassword});

        const token = jwt.sign({gmail} , "shhhhhh");
        res.cookie("token" , token , {
            httpOnly:true
        })
        res.json(user)

    }catch(error){
        console.err(err.message)
        res.status(500).send("Server Error")
    }

}

const loginUser = async (req,res) => {
    try{
        const {gmail , password} = req.body;
        const user = await User.findOne({gmail})
        if(!user) return res.status(400).json({msg:"Email not found"});

        const isMatch =await bcrypt.compare(password , user.password)
        if(!isMatch) return res.status(400).json({msg:"Invalid Email or Password"})

        const token = jwt.sign({gmail} , "shhhhhhh" , {expiresIn : "1h"});

        res.cookie("cookie" , token , {
            httpOnly : true
        })
        res.json({msg:"Login Sucessfull"})
    } catch(error){

        console.error("Error occured")
        res.json({msg:"Error"})

    }
}

const getUrls = async (req , res) =>{
    try{
        if(!req.user){
            return res.status(400).json({msg:"Unauthorized"});
        }
        const url = await Url.findOne({userId : req.user.id});
        res.json(url);
    }catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
}

export default {shortenUrl , redirectUrl , createUser , loginUser , getUrls}



