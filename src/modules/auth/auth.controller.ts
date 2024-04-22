import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body('username') name: string, @Body('password') password: string, @Body('email') email: string) {
    return this.authService.signUp({name, password, email});
  }

  @Post('signin')
  async signIn(@Body('username') username: string, @Body('password') password: string) {
    // return this.authService.signIn(username, password);
  }
}
