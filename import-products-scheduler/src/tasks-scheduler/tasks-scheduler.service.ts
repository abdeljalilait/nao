import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { VendorType } from '../types';
import { VENDORS_QUEUE } from '../constants';

/**
 * Schedules the import of vendors by adding vendor tasks to the VENDORS_QUEUE queue every 10 seconds.
 * The vendor tasks are created for the 'v1' and 'v2' vendors.
 */
const vendorsArray = ['vendor1', 'vendor2'];
@Injectable()
export class TasksSchedulerService {
  constructor(
    @InjectQueue(VENDORS_QUEUE) private vendorsQueue: Queue<VendorType>,
  ) {}
  @Cron(CronExpression.EVERY_MINUTE)
  async handleImportVendorsScheduler() {
    await this.vendorsQueue.addBulk(
      vendorsArray.map((vendor) => ({
        name: vendor,
        data: { name: vendor },
      })),
    );
  }
}
