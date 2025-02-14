import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Friendship, Prisma, User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(user: User, targetUserId: number): Promise<Friendship> {
    const targetUser = await this.userService.findOne(targetUserId);
    if (!targetUser) {
      throw new BadRequestException('User not found');
    } else if (targetUser.id === user.id) {
      throw new BadRequestException(`Can't sent friend request to yourself`);
    }

    // array of pending requests of current user
    const frArr = await this.getFriendRequests(user);

    if (frArr.some((r) => r.friendsId === targetUserId)) {
      throw new BadRequestException(
        `You already have a friend request from this user`,
      );
    }

    return this.prisma.friendship.create({
      data: {
        friendsId: user.id,
        friendOfId: targetUserId,
      },
    });
  }

  async accept(user: User, targetUserId: number): Promise<Friendship> {
    const friendship = (await this.getFriendRequests(user)).find(
      (r) => r.friendsId === targetUserId,
    ) as Friendship;
    if (!friendship) {
      throw new BadRequestException('No friend request from this user');
    }
    return this.prisma.friendship.update({
      where: {
        friendsId_friendOfId: {
          friendsId: targetUserId,
          friendOfId: user.id,
        },
      },
      data: {
        status: 'accepted',
      },
    });
  }

  async getFriendRequests(user: User) {
    return this.prisma.friendship.findMany({
      where: {
        friendOfId: user.id,
        status: 'pending',
      },
    });
  }

  async getFriendsList(user: User) {
    return this.prisma.friendship.findMany({
      where: {
        friendOfId: user.id,
        status: 'accepted',
      },
    });
  }

  async deleteFriendship(user: User, targetUserId: number) {
    const targetUser = await this.userService.findOne(targetUserId);

    try {
      await this.prisma.friendship.deleteMany({
        where: {
          OR: [
            { friendsId: user.id, friendOfId: targetUser.id },
            { friendsId: targetUser.id, friendOfId: user.id },
          ],
        },
      });
      return { message: 'Friend deleted!' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Friend not found');
        }
      }
    }
  }
}
