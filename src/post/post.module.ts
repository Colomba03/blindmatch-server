import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { UsersModule } from './../users/users.module'
import { CommunityModule } from '../community/community.module'
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post,User]),
    UsersModule, CommunityModule // Import UserModule here
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
