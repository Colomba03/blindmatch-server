import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';


describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
            provide: getRepositoryToken(User),
            useValue: {
                create: jest.fn(),
                save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
                findOne: jest.fn(), // Use findOne instead of findOneBy
                update: jest.fn().mockResolvedValue({ affected: 1 } as UpdateResult),
                delete: jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult),
                find: jest.fn(),
            },
        },
    ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password123',
      birthdate: new Date('1990-01-01'),
      sex: 'male',
    };

    const expectedUser = { ...createUserDto, id: 1 };

    jest.spyOn(repository, 'create').mockImplementation(() => expectedUser);

    const result = await service.create(createUserDto);

    expect(result).toEqual(expectedUser);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith(expectedUser);
  });

  it('find a user by id', async () => {
    const userId = 1;
    const expectedUser: User = {
      id: 1,
      name: 'User Name',
      username: 'Username',
      email: 'email@example.com',
      password: 'hashedPassword',
      birthdate: new Date(),
      sex: 'M',
    };
    jest.spyOn(repository, 'findOne').mockResolvedValue(expectedUser);
  
    expect(await service.findOne(userId)).toEqual(expectedUser);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });


  it('should update a user', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      username: 'updatedjohndoe',
      email: 'updatedjohndoe@example.com',
      password: 'updatedpassword123',
    };
  
    const existingUser: User = {
      id: userId,
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password123',
      birthdate: new Date('1990-01-01'),
      sex: 'male',
    };
  
    jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser);
  
    const result = await service.update(userId, updateUserDto);
    const updatedUser = await service.findOne(userId);
  
    expect(updatedUser).toEqual(expect.objectContaining(updateUserDto));
    expect(repository.save).toHaveBeenCalledWith({ ...existingUser, ...updateUserDto });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });
  

  it('should remove a user', async () => {
    const userId = 1;

    await service.remove(userId);

    expect(repository.delete).toHaveBeenCalledWith(userId);
  });

  it('should return all users', async () => {
    const expectedUsers = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
        birthdate: new Date('1990-01-01'),
        sex: 'male',
      },
      {
        id: 2,
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'janedoe@example.com',
        password: 'password456',
        birthdate: new Date('1990-01-02'),
        sex: 'female',
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(expectedUsers);

    const result = await service.findAll();

    expect(result).toEqual(expectedUsers);
    expect(repository.find).toHaveBeenCalled();
  });
});
