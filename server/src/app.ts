import express from 'express';
import bodyParser from 'body-parser';
import cpuUsageRoutes from './routes/cpuUsageRoutes';
import listEndpoints from 'express-list-endpoints';

const app = express();

app.use(bodyParser.json());
app.use('/api/cpu', cpuUsageRoutes);

const endpoints = listEndpoints(app);
endpoints.forEach((endpoint) => {
  endpoint.methods.forEach((method) => {
    console.log(`Endpoint: ${method} ${endpoint.path}`);
  });
});

export default app;
