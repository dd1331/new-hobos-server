import { Column, Entity } from 'typeorm';
import { Common } from '../../common/common.entity';

@Entity()
export class Job extends Common {
  @Column()
  title: string;
}
