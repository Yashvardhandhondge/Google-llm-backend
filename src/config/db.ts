import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    minPoolSize: 1,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    maxIdleTimeMS: 10000,
};
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, config);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
