import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createMockUser } from '../shared/utils/create-mock-user.utility';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return at least one user and successfuly delete it', async () => {
    const mockUser = await createMockUser();
    await controller.remove(mockUser!.id.toString());
    expect(await controller.findOne(mockUser!.id.toString())).toBe(null);
  });

  it('should create a user and modify it', async () => {
    const mockUser = await createMockUser();
    const updatedUser = await controller.update(mockUser!.id.toString(), {
      name: 'Maggie',
    });

    expect(updatedUser).not.toEqual(mockUser);
    await controller.remove(mockUser!.id.toString());
  });
});
