import mongoose from 'mongoose';
import env from 'dotenv';

env.config();

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI as string,{
            minPoolSize:3
            
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.log("Database connection failed");
        console.error("sdfsdfsdfsfdssssssssssssss",error); 
    }
}


export default connectDB;