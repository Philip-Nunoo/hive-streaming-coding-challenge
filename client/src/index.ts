import { ClientIdService } from './services/ClientIdService';
import { ProcessService } from './services/ProcessService';
import { QueueService } from './services/QueueService';
import { REPORT_INTERVAL } from './config';

const queueService = new QueueService();

const reportCpuUsage = async () => {
  try {
    const clientId = ClientIdService.getClientId();
    const cpuUsageData = await ProcessService.getCpuUsagePerProcess();
    const payload = {
      clientId,
      cpuUsageData,
    };
    queueService.addTask(payload);
  } catch (error) {
    console.error('Error collecting CPU usage:', error);
  }
};

setInterval(reportCpuUsage, REPORT_INTERVAL); // Report at specified interval
