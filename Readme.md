# Hive streaming code solution

## Client

### Consideration

1. Measurement Frequency: The REPORT_INTERVAL is set to a reasonable value (e.g., 60 seconds) to reduce the frequency of CPU usage measurements and reporting.

2. Efficient Tools: The pidusage library is used for efficient CPU and memory usage measurements.

3. Batch Data Processing: CPU usage data is collected in batches for all processes and sent together to the server.

4. Efficient Serialization: The payload is compressed using gzip before being sent to the server, reducing the data size.

5. Concurrency Control: Asynchronous operations are handled properly using async/await to avoid blocking the main thread.

6. Efficient Error Handling: An exponential backoff strategy is implemented for retrying failed reports to avoid excessive retries.

7. Minimize Logging: Logging is minimized to essential information to reduce CPU overhead from excessive logging.

This approach ensures that the client performs its monitoring tasks effectively without significantly impacting the performance of the host system.

### How to prevent data loss

To ensure that all measurements eventually reach the server and prevent data loss, we can implement a persistent queue to store the data locally until it has been successfully sent to the server. If the network connection is temporarily unavailable or if there are other issues preventing the data from being sent, the data will remain in the queue and will be retried later.



1. Persistent Queue: Use a file-based queue to store CPU usage data locally. **BetterQueue** with a MemoryStore ensures that the CPU usage data is stored locally and persists between application restarts. The queue will retry sending data until it succeeds or the maximum number of retries is reached.

2. Retry Mechanism: The queue retries failed tasks with an *exponential backoff strategy*, ensuring that network issues do not result in permanent data loss.

3. Batch Processing: Process the queue in batches to minimize the number of network requests. The client collects and sends CPU usage data in batches to reduce the number of network requests and improve efficiency.

By implementing a persistent queue with a retry mechanism, we can ensure that all CPU usage measurements eventually reach the server, even in the face of temporary network issues or server downtimes. This approach makes the client more resilient and reliable, preventing data loss and ensuring accurate monitoring.