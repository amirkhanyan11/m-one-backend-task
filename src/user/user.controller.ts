import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserDto } from './dto';
import { User } from '@prisma/client';
import { AgeToNumber } from './pipes';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async find(@Query(AgeToNumber) dto: FindUserDto) {
    dto = JSON.parse(JSON.stringify(dto)) as FindUserDto; // purge all empty fields
    if (Object.keys(dto).length === 0) {
      return this.userService.findAll();
    } else {
      return this.userService.findWhere(dto as User);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
