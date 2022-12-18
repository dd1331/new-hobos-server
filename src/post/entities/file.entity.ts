import { Column, Entity } from 'typeorm';
import { Common } from '../../common/common.entity';

@Entity()
export class FileEntity extends Common {
  @Column()
  url: string;
}
