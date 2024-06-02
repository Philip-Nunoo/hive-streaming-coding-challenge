import 'reflect-metadata';
import { Container } from 'inversify';
import { CpuUsageService } from './services/CpuUsageService';
import { CpuUsageController } from './controllers/CpuUsageController';
import { TYPES } from './types';

const container = new Container();
container.bind<CpuUsageService>(TYPES.CpuUsageService).to(CpuUsageService);
container.bind<CpuUsageController>(TYPES.CpuUsageController).to(CpuUsageController);

export { container };
