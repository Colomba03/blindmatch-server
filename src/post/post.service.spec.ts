import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Community } from '../community/entities/community.entity';


describe('PostService', () => {
  let service: PostService;
  let repository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockImplementation((post) => Promise.resolve(post)),
            findOneBy: jest.fn(),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockImplementation((post) => Promise.resolve(post)),
            findOneBy: jest.fn().mockImplementation(({ id }) => {
              if (id === 1) {
                return Promise.resolve({ id: 1, name: 'Test User', email: 'test@example.com' });
              }
              return Promise.resolve(null);
            }),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Community),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockImplementation((post) => Promise.resolve(post)),
            findOneBy: jest.fn().mockImplementation(({ id }) => {
              if (id === 1) {
                return Promise.resolve({ id: 1, name: 'Test Community', description: 'A test community' });
              }
              return Promise.resolve(null);
            }),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            find: jest.fn(),
          },
        },
      ],
    }).compile();
  
    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
    
  });
    
  it('create a new post successfully', async () => {
    const postDto = {
      title: 'Test Title',
      content: 'Test Content',
      userId: 1, 
      communityId: 1, 
    };
  
    const expectedPost = {
      ...postDto,
      id: 1, 
      user_id: { id: postDto.userId } as User, 
      community_id: postDto.communityId ? { id: postDto.communityId } as Community : null, 
      createdAt: new Date(), 
      updatedAt: null, 
    };
  
    jest.spyOn(repository, 'create').mockImplementation(() => expectedPost); 
    jest.spyOn(repository, 'save').mockResolvedValue(expectedPost); 
  
    await expect(service.create(postDto)).resolves.toEqual(expectedPost);
    expect(repository.create).toHaveBeenCalled(); 
    expect(repository.save).toHaveBeenCalledWith(expectedPost); 
  });

  it('find a post by id', async () => {
    const postId = 1;
    const expectedPost: Post = {
      id: 1,
      title: 'Test Title',
      content: 'Test Content',
      user_id: { id: 1, name: 'User Name', username: 'Username', email: 'email@example.com', password: 'hashedPassword', birthdate: new Date(), sex: 'M' } as User,
      community_id: { id: 1, name: 'Community Name', description: 'Description', created_at: new Date() } as Community,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(expectedPost);
  
    expect(await service.findOne(postId)).toEqual(expectedPost);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: postId });
  });

  it('update a post successfully', async () => {
    const postId = 1;
    const updateDto = { title: 'Updated Title' };
    const existingPost: Post = {
      id: postId,
      title: 'Old Title',
      content: 'Existing content',
      user_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
  
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingPost);
    
 
    repository.save = jest.fn().mockImplementation((post) => Promise.resolve({ ...post, ...updateDto }));
    
    const result = await service.update(postId, updateDto);
    
  
    expect(result).toEqual(expect.objectContaining(updateDto));
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ id: postId, ...updateDto }));
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: postId });
  });
  

  it('delete a post successfully', async () => {
    const postId = 1;
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] }); 
  
    await service.remove(postId);
    expect(repository.delete).toHaveBeenCalledWith(postId);
   
  });

  

  it('update a non-existent post', async () => {
    const postId = 999; 
    const updateDto = { title: 'Updated Title' };
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
  
    await expect(service.update(postId, updateDto)).rejects.toThrow();
  });


  it('delete a post successfully', async () => {
    const postId = 1; // 
  
    repository.delete = jest.fn().mockResolvedValue({ affected: 1 });
  
    await service.remove(postId);
  
    
    expect(repository.delete).toHaveBeenCalledWith(postId);
  });

it('not set updated_at on post creation', async () => {
  const postDto = {
    title: 'New Post',
    content: 'Content',
    userId: 1, 
    communityId: 1,
  };

  
  const expectedPost: Post = {
    ...postDto,
    id: 1,
    user_id: { id: postDto.userId } as User, 
    community_id: { id: postDto.communityId } as Community, 
    createdAt: new Date(), 
    updatedAt: null, 
  };

  
  jest.spyOn(repository, 'create').mockImplementation(() => expectedPost); 
  jest.spyOn(repository, 'save').mockResolvedValue(expectedPost); 

  const result = await service.create(postDto);

  expect(result.updatedAt).toBeNull(); // 
});


  it('return all posts', async () => {
    
    const expectedPosts: Post[] = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
       
        user_id: { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com', password: 'pass', birthdate: new Date(), sex: 'X' } as User,
        community_id: { id: 1, name: 'Community 1', description: 'Desc 1', created_at: new Date() } as Community,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        user_id: { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com', password: 'pass', birthdate: new Date(), sex: 'X' } as User,
        community_id: { id: 1, name: 'Community 1', description: 'Desc 1', created_at: new Date() } as Community,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  
    jest.spyOn(repository, 'find').mockResolvedValue(expectedPosts);
  
    await expect(service.findAll()).resolves.toEqual(expectedPosts);
    expect(repository.find).toHaveBeenCalled();
  });
  

});