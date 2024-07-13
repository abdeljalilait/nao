import type { Job } from 'bullmq';
import type { VendorType } from 'src/types';
import * as dfd from 'danfojs-node';
import { resolve } from 'path';
import { MongoClient } from 'mongodb';
import { randomBytes } from 'crypto';
import { unlink } from 'fs/promises';
import type { Product } from '../interfaces';
import { downloadCSV, processRowData } from './helpers';
export const BATCH_SIZE = 1000; // Adjust based on your needs
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
    await downloadCSV(csvUrl, tempFilePath);

    let products: Product[] = [];
    // Read CSV file with Danfo.js
    await dfd.streamCSV(tempFilePath, async (df) => {
      /**
       * Processes the CSV data row by row and inserts the product data into the MongoDB database in batches.
       *
       * This code block is responsible for the following:
       * 1. Converts the current row of the CSV data to a JSON object.
       * 2. Processes the row data using the `processRowData` function.
       * 3. Adds the processed product data to the `products` array.
       * 4. When the `products` array reaches the `BATCH_SIZE` limit, it inserts the batch of products into the MongoDB database using a bulk write operation.
       * 5. Resets the `products` array to an empty array after the batch is inserted.
       */
      if (df) {
        const json = dfd.toJSON(df);
        const row = json[0];
        if (row) {
          products.push(processRowData(row));
          try {
            products.push(json[0]);
            if (products.length >= BATCH_SIZE) {
              // insertion logic here
              const collection = client
                .db('nao-db')
                .collection<Product>('products');
              const bulkOps = products.map((product) => ({
                updateOne: {
                  filter: { docId: product.docId },
                  update: { $set: product },
                  upsert: true,
                },
              }));
              await collection.bulkWrite(bulkOps);
              console.log(`Inserted ${products.length} rows.`);
              products = [];
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
