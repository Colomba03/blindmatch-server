import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteResult, UpdateResult } from 'typeorm';


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
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('post os defined', () => {
    expect(service).toBeDefined();
  });

  it('created a new post correctly', async () => {
    const createPostDto: CreatePostDto = {
      communityId: 1,
      userId: 1,
      title: 'New Post Title',
      content: 'New Post Content',
    };

    const expectedPost = new Post();
    expectedPost.community_id = { id: createPostDto.communityId } as any; // Simulate the community relation
    expectedPost.user_id = { id: createPostDto.userId } as any; // Simulate the user relation
    expectedPost.title = createPostDto.title;
    expectedPost.content = createPostDto.content;

    jest.spyOn(repository, 'create').mockImplementation(() => expectedPost);
    jest.spyOn(repository, 'save').mockResolvedValue(expectedPost);

    await expect(service.create(createPostDto)).resolves.toEqual(expectedPost);
  });

  // Removed createMany test scenario as it requires implementation specifics not discussed

  it('updated a post correctly', async () => {
    const updatePostDto: UpdatePostDto = { /* ... */ };
    const postId = 1;
    const mockUpdateResult: UpdateResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };
  
    jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);
  
    const updatedPost: Post = {
      id: 1,
      community_id: { id: 1, name: 'Example Community' } as any, // Assuming a minimal mock of the Community entity
      user_id: { id: 1, username: 'exampleUser' } as any, // Assuming a minimal mock of the User entity
      title: 'Example Post Title',
      content: 'This is example post content.',
      created_at: new Date(),
      updated_at: new Date(),
      // Include any additional properties your Post entity might have
    };
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedPost);
  
    await expect(service.update(postId, updatePostDto)).resolves.toEqual(updatedPost);
  });

  it('delets a post correctly', async () => {
    const postId = 1;
    const mockDeleteResult: DeleteResult = {
      affected: 1,
      raw: [],
    };
  
    jest.spyOn(repository, 'delete').mockResolvedValue(mockDeleteResult);
  
    await expect(service.remove(postId)).resolves.toBeUndefined();
  });
});
