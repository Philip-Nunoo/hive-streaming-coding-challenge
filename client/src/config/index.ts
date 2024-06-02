import dotenv from 'dotenv';

dotenv.config();

export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000/api/cpu/report';
export const CLIENT_ID_FILE = process.env.CLIENT_ID_FILE || 'client_id.txt';
export const REPORT_INTERVAL = process.env.REPORT_INTERVAL ? parseInt(process.env.REPORT_INTERVAL) : 60000;
export const QUEUE_FILE = process.env.QUEUE_FILE || 'queue.json';
