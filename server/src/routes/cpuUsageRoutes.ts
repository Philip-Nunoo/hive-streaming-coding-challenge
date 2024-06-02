import { Router } from 'express';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { CpuUsageController } from '../controllers/CpuUsageController';

const router = Router();
const cpuUsageController = container.get<CpuUsageController>(TYPES.CpuUsageController);

router.post('/report', cpuUsageController.reportCpuUsage);
router.get('/usage', cpuUsageController.getCpuUsages);

export default router;
