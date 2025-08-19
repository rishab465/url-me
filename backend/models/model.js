import mongoose from "mongoose";

const url = mongoose.Schema({
    long_url : {
        type:String , 
        required: true,
    },
    short_url : {
        type : String,
        required : true
    },

    url_code : {
        type:String,
        unique:true,
        required:true,

    },
    clicks:{
        type:Number,
        default:0,
    }
})


export default mongoose.model("url" , url);
