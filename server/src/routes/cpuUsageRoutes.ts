import { Router } from 'express';
import { reportCpuUsage, getCpuUsages } from '../controllers/CpuUsageController';

const router = Router();

router.post('/report', reportCpuUsage);
router.get('/usage', getCpuUsages);

export default router;
