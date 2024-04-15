import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module'
import { CommunityModule } from '../community/community.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserModule, CommunityModule // Import UserModule here
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
