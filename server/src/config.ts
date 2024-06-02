import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cpu-monitoring';
export const SERVER_PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
