import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            const mongoUri = process.env.MONGO_URI;
            if (!mongoUri) {
                throw new Error('MONGO_URI is not defined');
            }
            await mongoose.connect(mongoUri);
            console.log('MongoDB connected successfully');
        } else {
            console.log('MongoDB already connected');
        }
    }
    catch (error) {
        console.error('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        } else {
            console.log('MongoDB already disconnected');
        }
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB: ', error);
        process.exit(1);
    }
}
