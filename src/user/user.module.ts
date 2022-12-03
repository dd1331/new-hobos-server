import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Career } from './entities/career';
import { Job } from './entities/job.entity';
import { User } from './entities/user.entity';
import { JobController } from './job.controller';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job, Career]), AuthModule],
  controllers: [UserController, JobController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
