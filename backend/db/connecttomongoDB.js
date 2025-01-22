import mongoose from "mongoose";

const connecttomongodb =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to mongodb")
    } catch (error) {
        console.log("error to connect mongodb",error.message)
    }
}

export default connecttomongodb;