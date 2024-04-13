import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Community } from '../community/entities/community.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Community) private communityRepository: Repository<Community>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { userId, communityId } = createPostDto;

    // Validate the user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    // Validate the community exists if communityId is provided
    let community = null;
    if (communityId != null) {
      community = await this.communityRepository.findOneBy({ id: communityId });
      if (!community) {
        throw new NotFoundException(`Community with ID "${communityId}" not found.`);
      }
    }

    // Create the post with an optional community
    const post = this.postRepository.create({
      ...createPostDto,
      user_id: user,
      community_id: community // This can be null
    });

    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post | undefined> {
    return this.postRepository.findOneBy({ id });
  }
  
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found.`);
    }
  
  
    post.title = updatePostDto.title ?? post.title;
    post.content = updatePostDto.content ?? post.content;
  
    await this.postRepository.save(post);
    return post;
  }

  async remove(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  
  }
}
