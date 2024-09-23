import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Mongodb successfully");
    } catch (err) {
        console.error(err);
    }
}

export default connectDB;