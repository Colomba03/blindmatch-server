import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Community } from '../../community/entities/community.entity';

@Entity('community_members')
export class CommunityMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column({ type: 'timestamp' })
  joined_at: Date;

  @ManyToOne(() => User, user => user.communityMembers)
  user: User;

  @ManyToOne(() => Community, community => community.communityMembers)
  community: Community;
  static community: any;
}
