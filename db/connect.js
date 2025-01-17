const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from a .env file

// Correct the MongoDB URI, ensuring proper encoding and format
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);  // No need for useNewUrlParser and useUnifiedTopology
        console.log('Yay!! MongoDB connected successfully');
    } catch (error) {
        console.error('Oh no!! MongoDB connection failed:', error);
        process.exit(1);  // Exit the process with failure
    }
}

module.exports = connectDB;
