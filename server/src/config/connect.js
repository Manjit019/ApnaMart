import mongoose from "mongoose";

export const connectDB = async(uri)=>{
    try {
        await mongoose.connect(uri);
        console.log("Database Conntected Succesfully✅");
        
    } catch (error) {
        console.log("Database connection error..❌",error);
    }
}