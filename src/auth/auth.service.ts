import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signup(user: User): Promise<User> {
    return (await this.userService.create(user)) as User;
  }

  async signin(siginDto: SignInDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: siginDto.email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(
      siginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Wrong Password');
    }

    const payload = { id: user.id, email: user.email };

    const token = await this.jwt.signAsync(payload);

    return token;
  }
}
