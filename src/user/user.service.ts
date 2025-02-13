import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto, UpdateUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
    return this.prisma.user.create({
      data: user,
    });
  }

  async findWhere(user: User) {
    return this.prisma.user.findMany({
      where: user,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({});
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new BadRequestException('User does not exist');
        }
      }
    }
  }
}
