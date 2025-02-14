import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards, HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserDto, UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { AgeToNumber } from './pipes';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: 'No valid jwt token found in cookies',
})
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      'Get all users depending on queries. If none specified, returns all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an array of users that satisfy search conditions',
    isArray: true,
  })
  @Get()
  async find(@Query(AgeToNumber) dto: FindUserDto) {
    dto = JSON.parse(JSON.stringify(dto)) as FindUserDto; // purge all empty fields
    if (Object.keys(dto).length === 0) {
      return this.userService.findAll();
    } else {
      return this.userService.findWhere(dto as User);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(+id, updateUserDto);
    return { message: 'User updated successfully.', result };
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
