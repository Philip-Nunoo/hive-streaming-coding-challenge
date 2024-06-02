import { injectable } from 'inversify';
import { ICpuUsage, CpuUsage } from '../models/CpuUsage';

@injectable()
export class CpuUsageService {
    public async saveCpuUsages(usages: ICpuUsage[]): Promise<void> {
        await CpuUsage.insertMany(usages);
    }

    public async getCpuUsages(filter: any): Promise<ICpuUsage[]> {
        return CpuUsage.find(filter).sort({ timestamp: -1 });
    }
}
