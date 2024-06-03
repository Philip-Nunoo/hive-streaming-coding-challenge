
# CPU Monitoring Service

This project is a CPU Monitoring Service designed to collect and report CPU usage from clients, store the data in a MongoDB database, and provide endpoints to query and analyze the data.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Running the Server](#running-the-server)
- [Running the Client](#running-the-client)
- [Recommendations for Preventing Data Loss](#recommendations-for-preventing-data-loss)
- [Detailed Description](#detailed-description)
- [Scalability of Design](#scalability-of-design)
- [Conclusion](#conclusion)

## Features

- Collect CPU usage data from multiple clients.
- Report data to a central server.
- Store data in MongoDB.
- Query CPU usage data.
- Identify clients with high CPU usage.

## Architecture

The project is divided into two main parts: the server and the client.

[View on Eraser![](https://app.eraser.io/workspace/JWOITVvUKtCcPXtMuTEM/preview?elements=b-Vk04_bm1TdhAekRQWTzA&type=embed)](https://app.eraser.io/workspace/JWOITVvUKtCcPXtMuTEM?elements=b-Vk04_bm1TdhAekRQWTzA)

### Server

The server is built using Node.js, Express, and MongoDB. It includes:

- **Controllers**: Handle incoming HTTP requests.
- **Services**: Business logic and interaction with the database.
- **Models**: Mongoose schemas and models for MongoDB.
- **Routes**: Define the API endpoints.
- **Middleware**: Custom middleware for handling gzip compression and logging routes.

### Client

The client is built using Node.js and collects CPU usage data to send to the server. It includes:

[View on Eraser![](https://app.eraser.io/workspace/JWOITVvUKtCcPXtMuTEM/preview?elements=oD9CsyowMCHznXciGwIetA&type=embed)](https://app.eraser.io/workspace/JWOITVvUKtCcPXtMuTEM?elements=oD9CsyowMCHznXciGwIetA)

- **Services**: For fetching CPU usage data, managing client ID, and queueing data for transmission.
- **Configuration**: Environment configuration.
- **Queue**: To ensure data is sent reliably, even if the server is temporarily unavailable.

## Setup

### Prerequisites

- Node.js and npm installed.
- MongoDB instance running.

### Installing Dependencies

Navigate to the project root and install the dependencies for both server and client:

```sh
# Server
cd server
pnpm install

# Client
cd client
pnpm install
```

## Configuration

### Server Configuration

Create a `.env` file in the `server` directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/cpu-monitoring
SERVER_PORT=3000
```

### Client Configuration

Create a `.env` file in the `client` directory with the following content:

```
SERVER_URL=http://localhost:3000/api/cpu/report
CLIENT_ID_FILE=client_id.txt
REPORT_INTERVAL=60000  # 60 seconds
```

## Endpoints

### Server Endpoints

#### POST /api/cpu/report

Report CPU usage data from a client.

**Request Body:**

```json
{
  "clientId": "string",
  "cpuUsageData": [
    {
      "pid": "number",
      "cpu": "number",
      "memory": "number",
      "timestamp": "Date"
    }
  ]
}
```

#### GET /api/cpu/usage

Retrieve CPU usage data based on query parameters.

**Query Parameters:**

- `clientId`: Filter by client ID.
- `pid`: Filter by process ID.
- `startTime`: Start time for filtering.
- `endTime`: End time for filtering.

#### GET /api/cpu/high-cpu-clients

Retrieve clients with high CPU usage over a specified threshold within a time range.

**Query Parameters:**

- `threshold`: CPU usage threshold.
- `startTime`: Start time for filtering.
- `endTime`: End time for filtering.

#### GET /api/cpu/clients-above-threshold

Retrieve clients that have CPU usage above a specified threshold.

**Query Parameters:**

- `threshold`: CPU usage threshold.

## Running the Server

Navigate to the `server` directory and run:

```sh
pnpm prod
```

This will start the server on the port specified in the `.env` file.

## Running the Client

Navigate to the `client` directory and run:

```sh
npm start
```

This will start the client, which will begin collecting and reporting CPU usage data to the server at regular intervals specified in the `.env` file.

## Recommendations for Preventing Data Loss

To ensure that no data is lost during the collection and transmission process, follow these recommendations:

1. **Use a Persistent Queue**:
   - Implement a persistent queue on the client side to store CPU usage data. This ensures that data is not lost if the client application crashes or is restarted.
   - The queue should attempt to resend data at regular intervals until it is successfully transmitted to the server.

2. **Reliable Transmission**:
   - Using reliable HTTP methods (such as `POST`) with appropriate error handling and retry logic.
   - Implement exponential backoff for retrying failed requests to avoid overwhelming the server with retries.

3. **Data Compression**:
   - Compressing the data using gzip before sending it to the server. This reduces the amount of data transmitted and can improve transmission reliability.

4. **Server-Side Acknowledgements**:
   - Ensure that the server responds with appropriate status codes and messages to confirm the receipt and processing of data.

5. **Monitor and Log Errors**:
   - Implementing comprehensive logging on both the client and server sides to monitor and diagnose any issues with data transmission.
   - Use these logs to identify and address any points of failure in the data collection and transmission process.

By following these recommendations, you can minimize the risk of data loss and ensure that CPU usage data is reliably collected and transmitted from clients to the server.

## Detailed Description

### Server

#### Configuration

- `src/config/index.ts`: Loads environment variables.

#### Models

- `src/models/CpuUsage.ts`: Defines the Mongoose schema and model for CPU usage data.

#### Services

- `src/services/CpuUsageService.ts`: Contains business logic for saving and querying CPU usage data.

#### Controllers

- `src/controllers/CpuUsageController.ts`: Handles HTTP requests and responses.

#### Routes

- `src/routes/cpuUsageRoutes.ts`: Defines API endpoints.

#### Middleware

- `src/middleware/logRoutes.ts`: Middleware for logging all registered routes.

#### App Setup

- `src/app.ts`: Configures Express app, middleware, and routes.

#### Server Initialization

- `src/server.ts`: Connects to MongoDB and starts the server.

### Client

#### Configuration

- `src/config/index.ts`: Loads environment variables.

#### Services

- `src/services/ClientIdService.ts`: Manages client ID generation and retrieval.
- `src/services/ProcessService.ts`: Fetches CPU usage data.
- `src/services/QueueService.ts`: Manages data queueing and transmission.

#### Main Application

- `src/index.ts`: Initializes services and sets up periodic reporting of CPU usage data.

## Scalability of design

[View on Eraser![](https://app.eraser.io/workspace/JWOITVvUKtCcPXtMuTEM/preview?elements=BCUmLGdynxkdN_FKg2y6TA&type=embed)](https://app.eraser.io/workspace/JWOITVvUKtCcPXtMuTEM?elements=BCUmLGdynxkdN_FKg2y6TA)

1. Architecture
   * Microservices-Friendly: The architecture separates client and server logic, making it easy to scale each component independently. This is suitable for a microservices approach where different services can be deployed and scaled based on demand.
   
   * Separation of Concerns: Clear separation between data collection (client), data processing, and storage (server). This makes it easier to manage and scale each part of the system independently.

2. Client Scalability
   * Lightweight Client: The client code is lightweight and performs CPU usage monitoring with minimal overhead. This ensures that it can be deployed on a large number of devices without significant performance impact.
   * Persistent Queue: Using a persistent queue on the client side ensures that data is reliably transmitted to the server, even if the client is temporarily offline. This approach helps in handling network interruptions and reduces data loss.

3. Server Scalability
   * Node.js and Express: Node.js is known for its non-blocking, event-driven architecture, which is suitable for handling a large number of concurrent connections. Express is lightweight and does not add significant overhead.

   * MongoDB: MongoDB is designed to scale out by distributing data across multiple servers (sharding). It supports high throughput and can handle large volumes of data, making it a good choice for storing CPU usage data.

   * Horizontal Scaling: The server can be scaled horizontally by deploying multiple instances behind a load balancer. This approach allows the system to handle more requests by adding more servers.

   * Aggregation and Querying: The use of MongoDB's aggregation framework allows for efficient querying and analysis of CPU usage data. Indexes can be created on relevant fields to improve query performance.

4. Communication Protocol
   * HTTP/HTTPS: HTTP/HTTPS is a scalable and widely-used communication protocol. Using HTTPS ensures secure data transmission. The stateless nature of HTTP requests makes it easy to scale the server by adding more instances.

   * Retry Mechanism: The retry mechanism with exponential backoff on the client side ensures reliable data transmission to the server, even in the face of transient network issues.

5. Data Compression
   * Gzip Compression: Compressing data using gzip before transmission reduces the amount of data sent over the network, improving bandwidth usage and reducing latency.

6. Monitoring and Logging
   * Comprehensive Logging: Implementing comprehensive logging on both the client and server sides helps in monitoring the system's health and diagnosing issues. Logs can be aggregated and analyzed to identify bottlenecks and optimize performance.

   * Monitoring Tools: Tools like Prometheus, Grafana, or commercial solutions can be used to monitor the performance and scalability of the server.

7. Potential Bottlenecks and Considerations
   * Database Scaling: As the volume of data grows, MongoDB might become a bottleneck. Considerations include sharding, replica sets, and optimizing indexes to ensure the database scales properly.

   * Network Latency: As the system scales geographically, network latency between clients and the server can become an issue. Using Content Delivery Networks (CDNs) or deploying servers in multiple regions can help mitigate this.

   * Rate Limiting: Implementing rate limiting on the server can prevent abuse and ensure fair usage among clients, which is crucial as the number of clients grows.

## Consideration

1. Measurement Frequency: The REPORT_INTERVAL is set to a reasonable value (e.g., 60 seconds) to reduce the frequency of CPU usage measurements and reporting.

2. Efficient Tools: The pidusage library is used for efficient CPU and memory usage measurements.

3. Batch Data Processing: CPU usage data is collected in batches for all processes and sent together to the server.

4. Efficient Serialization: The payload is compressed using gzip before being sent to the server, reducing the data size.

5. Concurrency Control: Asynchronous operations are handled properly using async/await to avoid blocking the main thread.

6. Efficient Error Handling: An exponential backoff strategy is implemented for retrying failed reports to avoid excessive retries.

7. Minimize Logging: Logging is minimized to essential information to reduce CPU overhead from excessive logging.

This approach ensures that the client performs its monitoring tasks effectively without significantly impacting the performance of the host system.

## Conclusion

This project provides a robust solution for monitoring CPU usage across multiple clients and aggregating the data on a central server for analysis. The modular architecture ensures maintainability and scalability, allowing for easy extensions and modifications.
