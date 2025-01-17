import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { CpuUsageService } from '../services/CpuUsageService';

@injectable()
export class CpuUsageController {
  private cpuUsageService: CpuUsageService;

  constructor(@inject(TYPES.CpuUsageService) cpuUsageService: CpuUsageService) {
    this.cpuUsageService = cpuUsageService;
  }

  public reportCpuUsage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clientId, cpuUsageData } = req.body;
      const usages = cpuUsageData.map((usage: any) => ({
        clientId,
        pid: usage.pid,
        cpu: usage.cpu,
        memory: usage.memory,
        timestamp: new Date(usage.timestamp),
      }));

      await this.cpuUsageService.saveCpuUsages(usages);
      res.status(200).send('CPU usage data saved.');
    } catch (error) {
      res.status(500).send('Error saving CPU usage data.');
    }
  };

  public getCpuUsages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clientId, pid, startTime, endTime } = req.query;
      const filter: any = {
        ...(clientId && { clientId: String(clientId) }),
        ...(pid && { pid: Number(pid) }),
        ...(startTime && { timestamp: { $gte: new Date(startTime as string) } }),
        ...(endTime && { timestamp: { $lte: new Date(endTime as string) } }),
      };

      const usageData = await this.cpuUsageService.getCpuUsages(filter);
      res.status(200).json(usageData);
    } catch (error) {
      res.status(500).send('Error fetching CPU usage data.');
    }
  };

  public getHighCpuUsageClients = async (req: Request, res: Response): Promise<void> => {
    try {
      const { threshold, startTime, endTime } = req.query;
      const thresholdNumber = parseFloat(threshold as string);
      const start = new Date(startTime as string);
      const end = new Date(endTime as string);
      const highCpuClients = await this.cpuUsageService.getHighCpuUsageClients(thresholdNumber, start, end);
      res.status(200).json(highCpuClients);
    } catch (error) {
      res.status(500).send('Error fetching high CPU usage clients.');
    }
  };

  public getClientsAboveCpuThreshold = async (req: Request, res: Response): Promise<void> => {
    try {
      const { threshold } = req.query;
      const thresholdNumber = parseFloat(threshold as string);
      const clients = await this.cpuUsageService.getClientsAboveCpuThreshold(thresholdNumber);
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).send('Error fetching clients above CPU threshold.');
    }
  };

}
