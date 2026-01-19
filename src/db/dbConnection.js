import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { app } from "../app.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB Connected SUCCESSFULLY !! DB HOST: ${connectionInstance.connection.host}`);
        
        app.on("Error", (error) => {
            console.error('Unable to communicate with MongoDB', error);
            throw error;
        })
    } catch (error) {
        console.error('MONGODB Connection FAILED: ', Error);
        process.exit(1);
    }
};

export default connectDB;