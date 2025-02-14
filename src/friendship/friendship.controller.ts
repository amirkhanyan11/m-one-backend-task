import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../user/decorator';
import { User as PrismaUser } from '@prisma/client';
import {
  ApiProperty,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: 'No valid jwt token found in cookies',
})
@UseGuards(AuthGuard)
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @ApiOperation({ summary: 'Send a friend request' })
  @ApiCreatedResponse({
    description: 'successfully sent a friend request',
  })
  @ApiBadRequestResponse({
    description: `Can't send a friend request to yourself`,
  })
  @ApiBadRequestResponse({
    description: 'User does not exist',
  })
  @Post('send/:id')
  async create(@User() user: PrismaUser, @Param('id') id: string) {
    return this.friendshipService.create(user, +id);
  }

  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiOkResponse({
    description: 'Accepted',
  })
  @ApiBadRequestResponse({
    description: 'No such friend request',
  })
  @ApiBadRequestResponse({
    description: 'User does not exist',
  })
  @Post('accept/:id')
  async accept(@User() user: PrismaUser, @Param('id') id: string) {
    return this.friendshipService.accept(user, +id);
  }

  @ApiOperation({ summary: 'Get all pending requests' })
  @Get()
  async getFriendRequests(@User() user: PrismaUser) {
    return this.friendshipService.getFriendRequests(user);
  }

  @ApiOperation({ summary: 'Get your friends list' })
  @Get('accepted')
  async getFriendsList(@User() user: PrismaUser) {
    return this.friendshipService.getFriendsList(user);
  }

  @ApiOperation({
    summary:
      'Deny a pending friend request, or delete one accepted in the past',
  })
  @ApiBadRequestResponse({
    description: 'No such friend request',
  })
  @ApiBadRequestResponse({
    description: 'User does not exist',
  })
  @Delete(':id')
  async deleteFriendRequest(@User() user: PrismaUser, @Param('id') id: string) {
    return this.friendshipService.deleteFriendship(user, +id);
  }
}
