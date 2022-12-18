import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Common } from '../../common/common.entity';
import { FileEntity } from './file.entity';
import { Post } from './post.entity';

@Entity()
export class PostFile extends Common {
  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'file_id' })
  fileId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToOne(() => FileEntity, { cascade: ['insert'] })
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}
