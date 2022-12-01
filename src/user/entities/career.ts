import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Job } from './job.entity';

export class Career {
  @OneToOne(() => Job)
  @JoinColumn()
  job;
  @Column()
  year: number;
}
