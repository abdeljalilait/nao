
# File Download API Documentation

## Overview

The File Download API is a NestJS application designed to handle the download of CSV files stored in specific folders based on a URL parameter. This allows users to request and download files dynamically from the server.

## Features

- **Dynamic File Download**: Depending on the vendor version specified in the URL, the API serves CSV files from corresponding directories (`v1` and `v2`).
- **Error Handling**: Provides clear error messages for invalid requests and server issues.

## How It Works

1. **Endpoint**: The API has a single endpoint `/download/:vendor`, where `:vendor` is a path parameter representing the vendor version.
2. **Vendors**: The valid vendor are `v1` and `v2`. Each vendor corresponds to a directory containing a CSV file named `images40.csv`.
3. **File Download**: When a request is made to the endpoint with a valid vendor, the API serves the CSV file from the corresponding directory. The file is renamed to `data_<vendor>.csv` before being sent to the client.
4. **Error Responses**: If an invalid vendor version is provided, the API responds with a `400 Bad Request` error. If there's an issue downloading the file, a `500 Internal Server Error` is returned.

## Example Request

To download the CSV file for vendor version `v1`:

```
GET http://localhost:3000/download/v1
```

To download the CSV file for vendor version `v2`:

```
GET http://localhost:3000/download/v2
```

## Example Response

- **Success**: The CSV file is downloaded as `data_v1.csv` or `data_v2.csv` depending on the vendor.
- **Error**: Appropriate error messages are returned for invalid vendor or download issues.

## Controller Code

The main logic for handling file downloads is implemented in the `DownloadController`:

```typescript
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { resolve } from 'path';

/**
 * Handles the download of a CSV file for a specific vendor version.
 *
 * @param vendor The vendor version for which to download the CSV file.
 * @param res The Express response object.
 * @returns The downloaded CSV file or an error message if the file cannot be downloaded.
 */
@Controller('download')
export class DownloadController {
  @Get(':vendor')
  downloadFile(@Param('vendor') vendor: string, @Res() res: Response) {
    const validVendors = ['v1', 'v2'];
    if (!validVendors.includes(vendor)) {
      return res.status(400).send('Invalid version parameter');
    }

    const filePath = resolve('vendors', vendor, 'images40.csv');
    res.download(filePath, `data_${vendor}.csv`, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Could not download the file.');
      }
    });
  }
}
```

## Project Structure

The project directory structure should look like this:

```
vendor-mock-api
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   └── download
│       ├── download.controller.ts
│       └── download.module.ts
├── vendors
│   ├── v1
│   │   └── images40.csv
│   ├── v2
│   │   └── images40.csv
├── package.json
├── tsconfig.json
└── README.md
```
