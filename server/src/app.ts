import express from 'express';
import bodyParser from 'body-parser';
import cpuUsageRoutes from './routes/cpuUsageRoutes';

const app = express();

app.use(bodyParser.json());
app.use('/api/cpu', cpuUsageRoutes);

export default app;
