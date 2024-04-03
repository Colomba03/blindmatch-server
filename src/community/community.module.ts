// community.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunityService } from './community.service';

@Module({
  imports: [TypeOrmModule.forFeature([Community])],
  providers: [CommunityService],
  exports: [TypeOrmModule, CommunityService]
})
export class CommunityModule {}
