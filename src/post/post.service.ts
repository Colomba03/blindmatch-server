import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post | undefined> {
    return this.postRepository.findOneBy({ id });
  }
  
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const result = await this.postRepository.update(id, updatePostDto);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  
    return this.findOne(id); 
  }

  async remove(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  
  }
}
