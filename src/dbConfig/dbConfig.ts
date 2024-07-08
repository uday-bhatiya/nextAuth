import { error } from "console";
import mongoose from "mongoose";
import { exit } from "process";

export async function connectDB() {
    try {

        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("MongoDB connected");
        })

        connection.on('error', (error) => {
            console.log("MongoDB connection error : ",error);
            process.exit()
        })
        
    } catch (error) {
        console.log("Something went wrong while connecting to DB :");
        console.log(error)
    }
}