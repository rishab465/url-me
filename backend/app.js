//Libraries importing 
import express from "express";
import dotenv from "dotenv";
import {nanoid} from "nanoid";
dotenv.config()
import connectDB from "./config/db.js"
import Url from "./models/model.js"
import router from "./routes/router.js";
import validUrl from "valid-url"
import cors from "cors"
const app = express();
app.use(cors({
     origin: "http://localhost:5173",
}))
app.use(express.json())

//Checking database connections
const syncServer= async() =>{
    await connectDB();
}

//Redirections
app.use("/api/url" , router);

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

//Running on port
app.listen(3000 , ()=>{
    console.log("Server running on port 3000")
})

syncServer();

