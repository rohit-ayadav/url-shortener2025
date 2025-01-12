import mongoose from "mongoose";

let connected = false;
const connectDB = async () => {
    if (connected) return;
    connected = true;
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDb is connected successfully");
    } catch (error: any) {
        console.log("MongoDb is not connected successfully");
        console.log(error.message);
    }
};
export default connectDB;

