import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { InterestModule } from './interest/interest.module';
import { PostModule } from './post/post.module';
import { CommunityModule } from './community/community.module';
import { UsersModule } from './users/users.module';
import { CommunityMembersModule } from './community_members/community_members.module';
import { Todo } from './todo/entities/todo.entity';
import { Post } from './post/entities/post.entity';
import { Community } from './community/entities/community.entity';
import { User } from './users/entities/user.entity';
import { CommunityMember } from './community_members/entities/community_member.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { Interest } from './interest/entities/interest.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'), 
        entities: [Todo, Post, Community, User, CommunityMember, Interest],
        synchronize: process.env.NODE_ENV !== 'production',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? ['.env'] : undefined,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TodoModule,
    InterestModule,
    PostModule,
    CommunityModule,
    UsersModule,
    CommunityMembersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}

