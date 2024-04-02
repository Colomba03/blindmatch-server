import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Community } from '../../community/entities/community.entity';
import { User } from '../../user/entities/user.entity';
  
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Community)
  community_id: Community;

  @ManyToOne(() => User)
  user_id: User;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}
