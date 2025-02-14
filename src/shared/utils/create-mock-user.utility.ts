import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { PrismaService } from '../../prisma/prisma.service';

export async function createMockUser(user?: {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}): Promise<User | undefined> {
  const tmp = {
    name: 'Bart',
    surname: 'Simpson',
    email: 'mock@mocks.com',
    password: 'StrongPassword1488!',
  };
  if (!user) {
    user = tmp;
  } else {
    user = { ...tmp, ...user };
  }

  const userService = new UserService(new PrismaService());

  return userService.create(user as User);
}
