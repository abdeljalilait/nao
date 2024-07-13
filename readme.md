
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

## Conclusion

This service provides a scalable and efficient way to process vendor data, leveraging modern libraries and techniques for parallel processing and AI-driven enhancements. The use of BullMQ, danfojs, and langchain ensures that the system can handle large datasets and continuously improve product information quality.

