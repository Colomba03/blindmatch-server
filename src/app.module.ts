/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo/entities/todo.entity';
import { InterestModule } from './interest/interest.module';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { CommunityModule } from './community/community.module';
import { Community } from './community/entities/community.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CommunityMembersModule } from './community_members/community_members.module';
import { CommunityMember } from './community_members/entities/community_member.entity';


@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DATABASE_HOST'),
      port: +configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USER'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      entities: [Todo, Post,Community,User,CommunityMember ], 
      synchronize: true,
    }),
    inject: [ConfigService]
  }), ConfigModule,ConfigModule.forRoot({ envFilePath: ['.env']}), TodoModule, InterestModule, PostModule, CommunityModule, UsersModule, CommunityMembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
