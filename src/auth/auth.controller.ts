import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { User } from '@prisma/client';
import { SignInDto } from './dto';
import { Response } from 'express';
import { ApiOperation, ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'Returns the new user from the database',
  })
  @ApiBadRequestResponse({
    description: 'User already exists',
  })
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto as User);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({
    description: 'Adds token to the cookies',
  })
  @ApiBadRequestResponse({
    description: 'User not found',
  })
  @Post('/signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signin(signInDto);

    res.cookie('token', token, { httpOnly: true, signed: true });

    return { message: 'Signed In' };
  }
}
