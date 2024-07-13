import * as nanoid from 'nanoid';
import type { Product } from '../interfaces';
import axios from 'axios';
import { createWriteStream } from 'fs';

export function processRowData(row: any): Product {
  const now = new Date().toISOString();
  const productData = {
    name: row['ProductName'],
    type: 'Medical', // Example fixed type
    shortDescription: row['ItemDescription'],
    description: row['ProductDescription'],
    vendorId: row['ManufacturerID'],
    manufacturerId: row['ManufacturerID'],
    storefrontPriceVisibility: 'Public', // Example fixed value
    variants: [],
    options: [],
    availability: row['Availability'],
    isFragile: false, // Example fixed value
    published: '2024-07-13', // Example fixed value
    isTaxable: true, // Example fixed value
    images: [],
    categoryId: row['CategoryID'],
  };

  const variant = {
    id: row['ProductID'],
    available: parseInt(row['QuantityOnHand'], 10) > 0,
    attributes: {
      packaging: row['PKG'],
      description: row['ProductDescription'],
    },
    cost: parseFloat(row['UnitPrice']),
    currency: 'USD', // Example fixed value
    description: row['ItemDescription'],
    dimensionUom: null,
    height: null,
    width: null,
    manufacturerItemCode: row['ManufacturerItemCode'],
    manufacturerItemId: row['ItemID'],
    packaging: row['PKG'],
    price: parseFloat(row['UnitPrice']),
    volume: null,
    volumeUom: null,
    weight: null,
    weightUom: null,
    optionName: '',
    optionsPath: '',
    optionItemsPath: '',
    sku: row['NDCItemCode'],
    active: true,
    images: [],
    itemCode: row['NDCItemCode'],
  };

  if (row['ImageFileName']) {
    const image = {
      fileName: row['ImageFileName'],
      cdnLink: row['ItemImageURL'],
      i: 0, // Example index
      alt: row['ItemDescription'],
    };
    productData.images.push(image);
    variant.images.push(image);
  }

  productData.variants.push(variant);

  const product = {
    docId: nanoid.nanoid(), // Generate a unique docId using nanoid
    fullData: null,
    data: productData,
    dataPublic: null,
    immutable: false,
    deploymentId: '1',
    docType: 'Product',
    namespace: 'medical',
    companyId: '12345',
    status: 'active',
    info: {
      createdBy: 'system',
      createdAt: now, // Use current date and time
      updatedBy: 'system',
      updatedAt: now, // Use current date and time
      deletedBy: null,
      deletedAt: null,
      dataSource: 'CSV Import',
      companyStatus: 'active',
      transactionId: 'tx12345',
      skipEvent: false,
      userRequestId: 'req12345',
    },
  };
  return product;
}

/**
 * Downloads a CSV file from the specified URL and saves it to the provided temporary file path.
 *
 * @param url - The URL of the CSV file to download.
 * @param tempFilePath - The local file path to save the downloaded CSV file.
 * @returns A Promise that resolves when the file download is complete.
 */
export async function downloadCSV(
  url: string,
  tempFilePath: string,
): Promise<void> {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream',
  });

  const writer = createWriteStream(tempFilePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
