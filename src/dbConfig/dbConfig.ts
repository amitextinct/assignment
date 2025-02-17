import mongoose from "mongoose";

export default async function connect() {
    try {
        if (mongoose.connections[0].readyState) {
            // If already connected, return
            return;
        }

        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            console.log("Error connecting to MongoDB:", err);
            process.exit();
        });

    } catch (error) {
        console.log("Error in MongoDB connection:", error);
        process.exit();
    }
}