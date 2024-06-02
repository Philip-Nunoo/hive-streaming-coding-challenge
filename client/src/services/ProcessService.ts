import { exec } from 'child_process';
import { promisify } from 'util';
import pidusage from 'pidusage';

const execAsync = promisify(exec);

interface CpuUsage {
  pid: number;
  cpu: number;
  memory: number;
  timestamp: number;
}

export class ProcessService {
  static async getProcesses(): Promise<number[]> {
    const { stdout } = await execAsync('ps -eo pid');
    return stdout.split('\n').slice(1).filter(Boolean).map(pid => parseInt(pid));
  }

  static async getCpuUsagePerProcess(): Promise<CpuUsage[]> {
    const pids = await this.getProcesses();
    const stats = await Promise.all(pids.map(async (pid) => {
      try {
        const stat = await pidusage(pid);
        return { pid, cpu: stat.cpu, memory: stat.memory, timestamp: Date.now() };
      } catch {
        return null;
      }
    }));
    return stats.filter(Boolean) as CpuUsage[];
  }
}
