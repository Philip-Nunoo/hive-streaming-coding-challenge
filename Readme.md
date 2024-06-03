
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
- [Conclusion](#conclusion)

## Features

- Collect CPU usage data from multiple clients.
- Report data to a central server.
- Store data in MongoDB.
- Query CPU usage data.
- Identify clients with high CPU usage.

## Architecture

The project is divided into two main parts: the server and the client.

### Server

The server is built using Node.js, Express, and MongoDB. It includes:

- **Controllers**: Handle incoming HTTP requests.
- **Services**: Business logic and interaction with the database.
- **Models**: Mongoose schemas and models for MongoDB.
- **Routes**: Define the API endpoints.
- **Middleware**: Custom middleware for handling gzip compression and logging routes.

### Client

The client is built using Node.js and collects CPU usage data to send to the server. It includes:

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
