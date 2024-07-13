import { Module } from '@nestjs/common';
import { TasksSchedulerService } from './tasks-scheduler.service';
import { BullModule } from '@nestjs/bullmq';
import { resolve } from 'path';
import { VENDORS_QUEUE } from '../constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: VENDORS_QUEUE,
      processors: [
        {
          path: resolve('dist/workers/import-worker.js'),
          concurrency: 2,
        },
      ],
    }),
  ],
  providers: [TasksSchedulerService],
})
export class TasksSchedulerModule {}
