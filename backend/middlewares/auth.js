import User from "../models/modelUsers"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"


const auth = async (req , res , next) =>{
    try{
        const token = req.cookies.cookie;
        if(!token) return res.status(400).json({msg:"Request Denied"})

        const decoded = jwt.verify(token , "shhhhhhh")
        req.user = decoded;
        next();
    }
    catch(error){

        console.error("Error occured")
        res.json({msg:"Error"})

    }
}

export default auth;