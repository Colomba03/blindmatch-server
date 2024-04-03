import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn,UpdateDateColumn,JoinColumn } from 'typeorm';
import { Community } from '../../community/entities/community.entity';
import { User } from '../../user/entities/user.entity';
  
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Community, { nullable: true }) 
  @JoinColumn({ name: 'community_id' })
  community_id?: Community; 

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date | null;
}
