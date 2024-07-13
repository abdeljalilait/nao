import { Job } from 'bullmq';
import { VendorType } from 'src/types';
import * as dfd from 'danfojs-node';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { MongoClient } from 'mongodb';
import { randomBytes } from 'crypto';
import { unlink } from 'fs/promises';
export const BATCH_SIZE = 5000;
// MongoDB connection URI
const uri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:27017/nao-db`;
/**
 * Imports product data from a vendor API and stores it in a MongoDB database.
 *
 * This function is responsible for the following steps:
 * 1. Fetches the CSV file from the vendor API.
 * 2. Saves the CSV file to a temporary location on the file system.
 * 3. Reads the CSV file using Danfo.js and converts it to a JSON array.
 * 4. Connects to the MongoDB database and inserts the product data into a collection.
 *
 * @param job - A Bullmq job object containing the vendor type.
 * @returns A promise that resolves to `true` if the import was successful, or rejects with an error.
 */
const client = new MongoClient(uri, { authSource: 'admin' });
export default async function importWorker(job: Job<VendorType>) {
  const { name } = job.data;
  // MongoDB connection URI
  try {
    await client.connect();
    console.log('connected to database');
  } catch (error) {
    return Promise.reject('Could not connect to MongoDB');
  }
  const csvUrl = `${process.env.VENDOR_IMPORT_API}/${name}`;
  try {
    console.log(csvUrl);
    // Create a temporary file path
    const tempFilePath = resolve(
      'temp',
      `${randomBytes(16).toString('hex')}.csv`,
    );
    console.log(tempFilePath);

    // Download the CSV file
    const response = await axios({
      method: 'get',
      url: csvUrl,
      responseType: 'stream',
    });

    // Pipe the file content to the temporary file
    const writer = createWriteStream(tempFilePath);
    response.data.pipe(writer);

    // Wait for the download to finish
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    let batch = [];
    // Read CSV file with Danfo.js
    await dfd.streamCSV(tempFilePath, async (df) => {
      if (df) {
        // processing here
        /**
         * Processes a batch of product data from a CSV file and inserts it into a MongoDB database.
         * This code is responsible for the following steps:
         * 1. Converts the Danfo.js DataFrame to a JSON array.
         * 2. Adds the JSON data to a batch array.
         * 3. When the batch size reaches the configured BATCH_SIZE, it inserts the batch of data.
         * 4. After the batch is inserted, the batch array is reset to an empty array.
         */
        const json = dfd.toJSON(df);
        if (json[0]) {
          try {
            batch.push(json[0]);
            if (batch.length >= BATCH_SIZE) {
              // insertion logic here
              console.log(`Inserted ${batch.length} rows.`);
              batch = [];
            }
          } catch (error) {
            console.error('Error inserting batch:', error);
          }
        }
      }
    });
    console.log('done');
    // Close the connection to the MongoDB database
    await unlink(tempFilePath);
    // Convert DataFrame to JSON
    await client.close(true);
    return Promise.resolve(true);
  } catch (err) {
    await client.close(true);
    console.log(err);
    return Promise.reject(err);
  }
}
