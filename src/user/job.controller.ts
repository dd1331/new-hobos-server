import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Job } from './entities/job.entity';

@Controller('job')
export class JobController {
  constructor(private readonly dataSource: DataSource) {}
  @Get()
  getJobs() {
    return this.dataSource.getRepository(Job).find();
  }
}
