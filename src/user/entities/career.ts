import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { Job } from './job.entity';

@Entity()
export class Career extends Common {
  @ManyToOne(() => Job)
  @JoinColumn({ name: 'career_id' })
  job: Job;

  @Column()
  year: number;
}
