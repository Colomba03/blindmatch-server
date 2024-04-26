import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find()
        .then(users => {
            console.log('Users:', users); 
            return users;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error; 
        });
}

async findOne(id: number): Promise<User> {
  return this.userRepository.findOne({ where: { id } });
}

async findOneByUsername(username: string): Promise<User> {
  return this.userRepository.findOne({ where: { username } });
}



  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // Update the user properties based on the provided DTO
    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      user.password = updateUserDto.password;
    }

    // Save the updated user entity to the database
    await this.userRepository.save(user);
    
    // Return the updated user
    return user;
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }



}
