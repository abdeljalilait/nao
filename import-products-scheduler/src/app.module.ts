import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TasksSchedulerModule } from './tasks-scheduler/tasks-scheduler.module';

/**
 * The main application module that configures and bootstraps the NestJS application.
 * It imports and configures the necessary modules, including:
 * - ConfigModule for loading environment variables
 * - ScheduleModule for scheduling tasks
 * - BullModule for setting up a Redis-based job queue
 * - TasksSchedulerModule for handling scheduled tasks
 * It also defines the controllers and providers for the application.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TasksSchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
