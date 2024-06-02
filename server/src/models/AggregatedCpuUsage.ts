export interface AggregatedCpuUsage {
    clientId: string;
    averageCpu: number;
    maxCpu: number;
    minCpu: number;
    count: number;
  }
  
  export interface ClientsAboveThreshold {
    clientId: string;
    count: number;
  }
  