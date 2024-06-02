import { injectable } from 'inversify';
import { ICpuUsage, CpuUsage } from '../models/CpuUsage';
import { AggregatedCpuUsage, ClientsAboveThreshold } from '../models/AggregatedCpuUsage';

@injectable()
export class CpuUsageService {
    public async saveCpuUsages(usages: ICpuUsage[]): Promise<void> {
        await CpuUsage.insertMany(usages);
    }

    public async getCpuUsages(filter: any): Promise<ICpuUsage[]> {
        return CpuUsage.find(filter).sort({ timestamp: -1 });
    }

    public async getHighCpuUsageClients(threshold: number, startTime: Date, endTime: Date): Promise<AggregatedCpuUsage[]> {
        return CpuUsage.aggregate([
            {
                $match: {
                    timestamp: { $gte: startTime, $lte: endTime },
                    cpu: { $gte: threshold }
                }
            },
            {
                $group: {
                    _id: '$clientId',
                    averageCpu: { $avg: '$cpu' },
                    maxCpu: { $max: '$cpu' },
                    minCpu: { $min: '$cpu' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { averageCpu: -1 }
            }
        ]).exec().then((result) => result.map((r) => ({
            clientId: r._id,
            averageCpu: r.averageCpu,
            maxCpu: r.maxCpu,
            minCpu: r.minCpu,
            count: r.count
        })));
    }

    public async getClientsAboveCpuThreshold(threshold: number): Promise<ClientsAboveThreshold[]> {
        return CpuUsage.aggregate([
            {
                $match: {
                    cpu: { $gte: threshold }
                }
            },
            {
                $group: {
                    _id: '$clientId',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]).exec().then((result) => result.map((r) => ({
            clientId: r._id,
            count: r.count
        })));
    }
}
