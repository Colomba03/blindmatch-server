import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity'
import { CommunityMember } from '../../community_members/entities/community_member.entity'

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Post, post => post.community_id)
  posts: Post[];

  @OneToMany(() => CommunityMember, communityMember => communityMember.community)
  communityMembers: CommunityMember[];
}
