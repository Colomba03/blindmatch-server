import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto): Promise<string> {
    try {
      const { username, password } = loginDto;
      const user = await this.usersService.findOneByUsername(username);

      if (!user || user.password !== password) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      console.log('Access token generated:', { username: user.username, accessToken });
      return accessToken;
    } catch (error) {
      console.error('Login error:', error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
