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
