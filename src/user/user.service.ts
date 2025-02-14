import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
    try {
      const newUser = await this.prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('User already exists');
        }
      }
      throw new HttpException('Internal Server Error', HttpStatus.BAD_REQUEST);
    }
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
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
