import { Column } from 'typeorm';
import { Common } from '../../common/common.entity';

export class User extends Common {
  @Column()
  email: string;
  @Column()
  password: string;
}
