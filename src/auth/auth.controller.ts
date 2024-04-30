import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const accessToken = await this.authService.login(loginDto);
      console.log('Login successful:', { username: loginDto.username, accessToken });
      return accessToken;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
