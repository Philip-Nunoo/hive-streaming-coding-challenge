import BetterQueue from 'better-queue';
import MemoryStore from 'better-queue-memory';
import axios from 'axios';
import { SERVER_URL } from '../config';
import zlib from 'zlib';

interface QueueTask {
  payload: any;
}

export class QueueService {
  private queue: BetterQueue<QueueTask>;

  constructor() {
    this.queue = new BetterQueue(this.processTask.bind(this), {
      store: new MemoryStore(),
      retryDelay: 60000, // Retry after 1 minute
      maxRetries: 5      // Max retries before discarding the task
    });
  }

  private async processTask(task: QueueTask, cb: (err: any, result?: any) => void) {
    try {
      const compressedPayload = zlib.gzipSync(JSON.stringify(task.payload));
      await axios.post(SERVER_URL, compressedPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip'
        }
      });
      console.log('CPU usage reported:', task.payload);
      cb(null, 'success');
    } catch (error) {
      console.error('Error reporting CPU usage, will retry:', error);
      cb(error);
    }
  }

  public addTask(payload: any) {
    this.queue.push({ payload });
  }
}
