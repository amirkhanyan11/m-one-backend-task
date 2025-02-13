import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { User } from '@prisma/client';
import { SignInDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto as User);
  }

  @Post('/signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signin(signInDto);

    res.cookie('token', token, { httpOnly: true, signed: true, secure: true });

    return { message: 'Signed In' };
  }
}
