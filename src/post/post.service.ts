import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Community } from '../community/entities/community.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Community) private communityRepository: Repository<Community>,
    private manager: EntityManager,
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

  async findAll() {
    return await this.postRepository.find();
  }

  async findAllExept(id:number) {
    const posts = await this.manager.query('select p.*,username from posts as p, users as u where p.user_id = u.id and p.user_id <> $1',[id]);
    return posts;
  }

  async findAllByInterests(id: number){
    const posts = await this.manager.query('select p.*,username from posts as p, users as u where p.user_id = u.id and p.user_id <> $1',[id]);
    const temp = await this.manager.query('select selected from user_interests where user_id = $1',[id]);
    const interests = temp[0].selected;
    const related_posts = [];
    let added = false;
    if(posts.length > 0 && interests.length > 0){
      for (let index = 0; index < posts.length; index++) {
        // console.log(index);
        const post = posts[index];
        const content = post.content.split(' ');
        added = false;
        // if(post.id != id)console.log(post.content);
        for(let j = 0; j < interests.length; j++){
          // console.log(content.indexOf(interests[j]));
          if(post.content.toLowerCase().includes(interests[j].toLowerCase())){
            related_posts.push(post);
            continue
          }
        }
      }
    }
    if(related_posts.length > 0) return related_posts;
    return 'No related posts found'
  } 

  async matchUsers(id: number){
    // const posts = await this.findAll();
    const interests = await this.manager.query('select distinct p.user_id,selected from user_interests as u,posts as p where p.user_id <> $1 and p.user_id = u.user_id',[id]);
    const temp = await this.manager.query('select selected from user_interests where user_id = $1',[id]);
    const user_interests = temp[0].selected;
    const matches = [];
    const match_total = user_interests.length;
    for (let index = 0; index < interests.length; index++) {
      let match_index = 0;
      const other_intr = interests[index].selected;
      console.log(other_intr);
      for (let j = 0; j < user_interests.length; j++) {
        const interest = user_interests[j];
        if(other_intr.includes(interest)){
          match_index += 1;
        }
        
      }
      console.log(match_index,match_total);
      const rating =(match_index/match_total) * 10
      console.log(rating.toFixed(3));
      console.log(id,interests[index].user_id);
      if(rating >= 5){
        const i = {"user_id":interests[index].user_id,"selected":interests[index].selected,"match_rating":rating.toFixed(3)}
        matches.push(i);
      }
      
    }
    return matches
  }

  async findOne(id: number): Promise<Post | undefined> {
    return await this.postRepository.findOneBy({ id });
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
