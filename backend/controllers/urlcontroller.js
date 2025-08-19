import Url from "../models/model.js";
import {nanoid} from "nanoid";
import validUrl from "valid-url"


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
        
        let url = await Url.create({long_url:long_url , short_url : short_url , url_code : url_code})
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

export default {shortenUrl , redirectUrl}



