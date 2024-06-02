import 'reflect-metadata';
import { Container } from 'inversify';
import { CpuUsageService } from './services/CpuUsageService';
import { TYPES } from './types';

const container = new Container();
container.bind<CpuUsageService>(TYPES.CpuUsageService).to(CpuUsageService);

export { container };
