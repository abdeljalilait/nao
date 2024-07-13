
# Vendor Data Processing Service

## Introduction

This project is designed to handle the processing of vendor data through a mock API, utilizing BullMQ for queuing, worker processes for parallel execution, and various libraries for efficient data handling and transformation. The main goal is to download CSV files from multiple vendors, process the data, and update our database with the latest product information, including AI-generated descriptions for products lacking descriptions.

## Table of Contents

1. [Setup](#setup)
2. [Architecture](#architecture)
3. [Dependencies](#dependencies)
4. [Usage](#usage)
5. [Data Processing Workflow](#data-processing-workflow)
6. [Database Update Process](#database-update-process)
7. [Conclusion](#conclusion)

## Setup

### Prerequisites

- Node.js
- MongoDB
- Redis (for BullMQ)
- Docker (optional, for containerized setup)


## Architecture

The system consists of the following components:

1. **Mock Vendor API**: Simulates the vendor endpoints from which CSV files are downloaded.
2. **Main Service**: Manages the queuing of vendors and distribution of jobs to worker processes.
3. **Workers**: Processes each vendor's data independently, utilizing CPU cores for parallel execution.
4. **Database**: MongoDB is used to store the processed product data.

## Dependencies

- **BullMQ**: For managing job queues and worker processes.
- **danfojs**: For reading and processing CSV files (similar to pandas).
- **langchain**: For generating product descriptions using AI.
- **mongodb**: For storing and querying product data.

## Usage

## Data Processing Workflow

1. **Queuing Vendors**:
   - Vendors are added to a BullMQ queue.
   - Jobs are picked up by sandboxed worker processes, allowing parallel processing.

2. **Downloading CSV Files**:
   - Each worker downloads the CSV file from the vendor's API and stores it in a temporary folder.

3. **Processing CSV Files**:
   - Using danfojs, the CSV file is read and processed to handle large files efficiently with the streamCsv method.
   - Data is transformed into JSON format.

4. **Data Transformation**:
   - Perform necessary data processing to match the required JSON format.
   - Batch the data for database operations.

## Database Update Process

1. **Inserting/Updating Products**:
   - The processed data is inserted or updated in the MongoDB database.

2. **Generating Descriptions**:
   - MongoDB cursors are used to loop through products lacking descriptions.
   - langchain AI generates descriptions based on available product information.
   - The database is updated with the new descriptions.

## Enhancements

### Data Processing Pipeline Streaming

To enhance the data processing capabilities and ensure the database stays up-to-date with real-time data, we can incorporate a data processing pipeline using Kafka and Benthos.

1. **Kafka Integration**:
   - Kafka can be used to stream data from various sources to our processing service.
   - Each vendor's data stream can be published to a Kafka topic.
   - Consumers can subscribe to these topics to process data in real-time.

2. **Benthos for Stream Processing**:
   - Benthos can be employed to handle the ingestion, transformation, and processing of data streams.
   - Benthos pipelines can be configured to read from Kafka topics, process the data, and output to MongoDB or another storage system.
   - This setup ensures efficient and scalable real-time data processing.

3. **Benefits**:
   - **Scalability**: Kafka and Benthos enable horizontal scaling of data processing pipelines.
   - **Real-Time Updates**: The database is updated with the latest data as soon as it becomes available.
   - **Fault Tolerance**: Kafka's distributed nature ensures data availability and fault tolerance.

By integrating Kafka and Benthos into our data processing pipeline, we can achieve a robust, scalable, and real-time data processing system that keeps our database consistently updated with the latest information from various vendors.

For more information about Benthos and its capabilities, visit the [Benthos documentation](https://v4.benthos.dev/docs/about).

## Conclusion

This service provides a scalable and efficient way to process vendor data, leveraging modern libraries and techniques for parallel processing and AI-driven enhancements. The use of BullMQ, danfojs, and langchain ensures that the system can handle large datasets and continuously improve product information quality.

